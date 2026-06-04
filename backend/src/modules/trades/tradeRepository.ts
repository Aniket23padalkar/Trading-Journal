import pool from "../../config/db.js";
import type { CreateTradeData } from "../../schemas/trade.schema.js";
import type {
  CreateTradeWithUserId,
  ExecutionsRow,
  GetExecutionsQueryResult,
  GetTradeQueryResult,
  UpdateTradeRepoParams,
} from "../../types/trade.types.js";
import { AppError } from "../../utils/AppError.js";

export const getTradeFromDB = async ({
  trade_id,
  user_id,
}: {
  trade_id: string;
  user_id: string;
}): Promise<GetTradeQueryResult | null> => {
  const query = `
    SELECT
      symbol,
      market_type,
      order_status,
      position,
      trade_rating,
      entry_time,
      exit_time
    FROM trades 
    WHERE trade_id = $1 AND user_id = $2`;

  const result = await pool.query<GetTradeQueryResult>(query, [
    trade_id,
    user_id,
  ]);

  return result.rows[0] || null;
};

export const getExecutionsFromDB = async (
  trade_id: string,
): Promise<GetExecutionsQueryResult[] | null> => {
  const query = `
    SELECT 
      order_type,
      price,
      quantity,
      executed_at
    FROM executions
    WHERE trade_id = $1
  `;

  const result = await pool.query<GetExecutionsQueryResult>(query, [trade_id]);

  return result.rows || null;
};

export const getTradeLogsFromDB = async ({
  user_id,
  trade_id,
}: {
  user_id: string;
  trade_id: string;
}): Promise<string | null> => {
  const query = `
    SELECT 
      description
    FROM trade_logs
    WHERE user_id = $1 AND trade_id = $2
  `;

  const result = await pool.query<{ description: string }>(query, [
    user_id,
    trade_id,
  ]);

  return result.rows[0]?.description || null;
};

export const createTradeInDB = async ({
  user_id,
  symbol,
  order_status,
  market_type,
  position,
  trade_rating,
  entry_time,
  exit_time,
  executions,
  description,
}: CreateTradeWithUserId): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const newTrade = await client.query<{ trade_id: string }>(
      `
        INSERT INTO trades
          (user_id, symbol, market_type, order_status, position, trade_rating, entry_time, exit_time) 
        VALUES 
          ($1,$2,$3,$4,$5,$6,$7,$8) 
        RETURNING trade_id`,
      [
        user_id,
        symbol,
        order_status,
        market_type,
        position,
        trade_rating,
        entry_time,
        exit_time,
      ],
    );

    if (!newTrade.rows[0]?.trade_id) {
      throw new AppError("Error while creating a trade", 500);
    }

    const tradeId: string = newTrade.rows[0].trade_id;

    await client.query(
      `
        INSERT INTO trade_logs
          (trade_id, user_id, description)
        VALUES
          ($1,$2,$3)
      `,
      [tradeId, user_id, description],
    );

    const values: string[] = [];
    const rows: ExecutionsRow[] = executions.map((exe) => [
      tradeId,
      exe.order_type,
      exe.price,
      exe.quantity,
      exe.executed_at,
    ]);
    const params = rows.flat();

    executions.forEach((exe, i) => {
      const base = i * 5;

      values.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`,
      );

      params.push(
        tradeId,
        exe.order_type,
        exe.price,
        exe.quantity,
        exe.executed_at,
      );
    });

    await client.query(
      `INSERT INTO executions
          (trade_id, order_type, price, quantity, executed_at) 
        VALUES 
          ${values.join(",")} 
        `,
      params,
    );

    await client.query("COMMIT");
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    if (err instanceof AppError) {
      console.error(err);
      throw new AppError(err.message || "Failed to create trade", 500);
    }
  } finally {
    client.release();
  }
};

export const updateTradeInDB = async ({
  validatedTrade,
  trade_id,
  user_id,
}: UpdateTradeRepoParams) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE trades
        SET
          symbol = $1,
          market_type = $2,
          order_status = $3,
          position = $4,
          trade_rating = $5,
          entry_time = $6,
          exit_time = $7,
          updated_at = NOW()
        WHERE
          trade_id = $8 AND user_id = $9
        `,
      [
        validatedTrade.symbol,
        validatedTrade.market_type,
        validatedTrade.order_status,
        validatedTrade.position,
        validatedTrade.trade_rating,
        validatedTrade.entry_time,
        validatedTrade.exit_time,
        trade_id,
        user_id,
      ],
    );

    const existingExecutions = await client.query(
      `SELECT execution_id FROM trade_logs WHERE trade_id = $1`,
      [trade_id],
    );

    const existingIds = existingExecutions.rows.map((r) => r.execution_id);
    const incomingIds = validatedTrade.executions
      .filter((e) => e.execution_id)
      .map((e) => e.execution_id);

    const toDelete = existingIds.filter((eId) => !incomingIds.includes(eId));

    if (toDelete.length > 0) {
      await client.query(
        `DELETE FROM executions WHERE execution_id = ANY($1::uuid[])`,
        [toDelete],
      );
    }

    for (const exe of validatedTrade.executions) {
      if (exe.execution_id) {
        await client.query(
          `
        UPDATE executions
        SET
          order_type = $1,
          price = $2,
          quantity = $3,
          executed_at = $4,
          updated_at = NOW()
        WHERE 
          execution_id=$5 AND trade_id=$6
        RETURNING *
        `,
          [
            exe.order_type,
            exe.price,
            exe.quantity,
            exe.executed_at,
            exe.execution_id,
            trade_id,
          ],
        );
      } else {
        await client.query(
          `
          INSERT INTO trade_logs
          (
            trade_id,
            buy_price,
            sell_price,
            quantity,
            risk,
            entry_time,
            exit_time
          )
          VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
          `,
          [
            tradeId,
            exe.buy_price,
            exe.sell_price,
            exe.quantity,
            exe.risk,
            exe.entry_time,
            exe.exit_time,
          ],
        );
      }
    }

    await updateTradeSummary(client, tradeId, status);

    const tradeData = await getTradeByID(client, tradeId, userId);

    await client.query("COMMIT");

    return tradeData;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteTradeFromDB = async ({ id, userId }) => {
  const query = `
    DELETE
    FROM trades
    WHERE user_id = $1 AND trade_id = $2 RETURNING *
  `;

  return pool.query(query, [userId, id]);
};

export const getTradesWithPaginationFromDB = async ({
  whereClause,
  values,
  index,
  orderBy,
  limit,
  offset,
}) => {
  const query = `
        SELECT
            t.*,
            l.first_entry
        FROM trades t
        JOIN(
            SELECT trade_id, MIN(entry_time) AS first_entry
            FROM trade_logs
            GROUP BY trade_id
        ) l ON t.trade_id = l.trade_id
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${index} OFFSET $${index + 1}
    `;

  return pool.query(query, [...values, limit, offset]);
};

export const getTradeLogsByIdsFromDB = async (tradeIds) => {
  const query = `
        SELECT *
        FROM trade_logs
        WHERE trade_id = ANY($1::uuid[])
        ORDER BY entry_time ASC
    `;

  return pool.query(query, [tradeIds]);
};

export const getTradesCountFromDB = async ({ whereClause, values }) => {
  const query = `
        SELECT COUNT(*)
        FROM trades t
        JOIN(
            SELECT trade_id, MIN(entry_time) AS first_entry
            FROM trade_logs
            GROUP BY trade_id
        ) l ON t.trade_id = l.trade_id
        WHERE ${whereClause}
    `;

  return pool.query(query, values);
};

export const extractYearMonthFromDB = async (userId) => {
  const query = `
    WITH first_logs AS(
      SELECT trade_id, MIN(entry_time) AS first_entry
      FROM trade_logs
      GROUP BY trade_id
    )
    SELECT 
      ARRAY_AGG(DISTINCT EXTRACT(YEAR FROM first_entry)) AS years,
      ARRAY_AGG(DISTINCT EXTRACT(MONTH FROM first_entry)) AS months
    FROM first_logs fl
    JOIN trades t ON t.trade_id = fl.trade_id
    WHERE user_id = $1
  `;

  return pool.query(query, [userId]);
};

export const getFilteredStatsFromDB = async ({ whereClause, values }) => {
  const query = `
    WITH first_logs AS (
        SELECT trade_id, MIN(entry_time) AS first_entry
        FROM trade_logs
        GROUP BY trade_id
      )
      SELECT
        COALESCE(COUNT(t.trade_id),0) AS trades_count,
        COALESCE(SUM(t.pnl) FILTER(WHERE t.status = 'Closed'),0) AS trades_pnl,
        COALESCE(SUM(t.avg_rr) FILTER(WHERE t.status = 'Closed'),0) AS trade_rr,
        COALESCE(
          CAST(
            (COUNT(*) FILTER(WHERE t.pnl > 0 AND t.status = 'Closed') * 100.0)
            / NULLIF(COUNT(*) FILTER(WHERE t.status = 'Closed'),0)
          AS NUMERIC(5,2)) 
        ,0) AS trades_win_rate
      FROM trades t
      JOIN first_logs l ON t.trade_id = l.trade_id
      WHERE ${whereClause}
  `;

  return pool.query(query, values);
};

export const getMonthlyPnlFromDB = async ({ year, userId }) => {
  const query = `
    WITH first_logs AS (
      SELECT trade_id, MIN(entry_time) AS first_entry
      FROM trade_logs
      GROUP BY trade_id
    )
    SELECT 
      EXTRACT(MONTH FROM fl.first_entry) AS month,
      SUM(t.pnl) AS total_pnl
    FROM first_logs fl
    JOIN trades t ON t.trade_id = fl.trade_id
    WHERE t.user_id = $1
      AND EXTRACT(YEAR FROM fl.first_entry) = $2
      AND t.status = 'Closed'
    GROUP BY month
    ORDER BY month
  `;

  return pool.query(query, [userId, year]);
};
