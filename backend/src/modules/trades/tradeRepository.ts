import pool from "../../config/db.js";
import type {
  CreateTradeWithUserId,
  ExecutionsRow,
  GetExecutionsByTradeIdQueryResult,
  GetExecutionsQueryResult,
  GetTradeLogsByIdQueryResult,
  GetTradeQueryResult,
  GetTradeRepoParams,
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
      trade_id,
      symbol,
      market_type,
      order_status,
      position,
      risk,
      direction,
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
      execution_id,
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
  risk,
  direction,
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
          (user_id, symbol, market_type, order_status, position, trade_rating, risk, direction, entry_time, exit_time) 
        VALUES 
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
        RETURNING trade_id`,
      [
        user_id,
        symbol,
        order_status,
        market_type,
        position,
        trade_rating,
        risk,
        direction,
        entry_time,
        exit_time,
      ],
    );

    if (!newTrade.rows[0]?.trade_id) {
      throw new AppError("Error while creating a trade", 500);
    }

    const trade_id: string = newTrade.rows[0].trade_id;

    await client.query(
      `
        INSERT INTO trade_logs
          (trade_id, user_id, description)
        VALUES
          ($1,$2,$3)
      `,
      [trade_id, user_id, description],
    );

    const values: string[] = [];
    const rows: ExecutionsRow[] = executions.map((exe) => [
      trade_id,
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
        trade_id,
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
          risk = $6,
          entry_time = $7,
          exit_time = $8,
          updated_at = NOW()
        WHERE
          trade_id = $9 AND user_id = $10
        `,
      [
        validatedTrade.symbol,
        validatedTrade.market_type,
        validatedTrade.order_status,
        validatedTrade.position,
        validatedTrade.trade_rating,
        validatedTrade.risk,
        validatedTrade.entry_time,
        validatedTrade.exit_time,
        trade_id,
        user_id,
      ],
    );

    const existingExecutions = await client.query<{ execution_id: string }>(
      `SELECT execution_id FROM executions WHERE trade_id = $1`,
      [trade_id],
    );

    const existingIds = existingExecutions.rows.map((r) => r.execution_id);

    const incoming = validatedTrade.executions || [];

    const incomingIds = incoming
      .filter((e) => e.execution_id)
      .map((e) => e.execution_id);

    const toDelete = existingIds.filter((eId) => !incomingIds.includes(eId));

    if (toDelete.length > 0) {
      await client.query(
        `DELETE FROM executions WHERE execution_id = ANY($1::uuid[])`,
        [toDelete],
      );
    }

    const updates = incoming.filter((e) => e.execution_id);
    const inserts = incoming.filter((e) => !e.execution_id);

    await Promise.all(
      updates.map((exe) =>
        client.query(
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
          `,
          [
            exe.order_type,
            exe.price,
            exe.quantity,
            exe.executed_at,
            exe.execution_id,
            trade_id,
          ],
        ),
      ),
    );

    if (inserts.length) {
      const values: string[] = [];
      const rows: ExecutionsRow[] = inserts.map((exe) => [
        trade_id,
        exe.order_type,
        exe.price,
        exe.quantity,
        exe.executed_at,
      ]);
      const params = rows.flat();

      inserts.forEach((exe, i) => {
        const base: number = i * 5;

        values.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`,
        );

        params.push(
          trade_id,
          exe.order_type,
          exe.price,
          exe.quantity,
          exe.executed_at,
        );
      });

      await client.query(
        `
          INSERT INTO executions
            (trade_id, order_type, price, quantity, executed_at)
          VALUES
            ${values.join(",")}
        `,
        params,
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deleteTradeFromDB = async ({
  trade_id,
  user_id,
}: {
  trade_id: string;
  user_id: string;
}): Promise<{ trade_id: string } | null> => {
  const query = `
    DELETE
    FROM trades
    WHERE trade_id = $1 AND user_id = $2
    RETURNING trade_id
  `;

  const result = await pool.query<{ trade_id: string }>(query, [
    trade_id,
    user_id,
  ]);

  return result.rows[0] || null;
};

export const getTradesWithPaginationFromDB = async ({
  whereClause,
  values,
  index,
  orderBy,
  limit,
  offset,
}: GetTradeRepoParams): Promise<GetTradeQueryResult[] | null> => {
  const query = `
        SELECT
            trade_id,
            symbol,
            market_type,
            order_status,
            position,
            risk,
            direction,
            trade_rating,
            entry_time,
            exit_time,
            created_at,
            updated_at
        FROM trades
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${index} OFFSET $${index + 1}
    `;

  const result = await pool.query<GetTradeQueryResult>(query, [
    ...values,
    limit,
    offset,
  ]);

  return result.rows || null;
};

export const getTradeLogsByIdFromDB = async (
  trade_ids: string[],
  user_id: string,
): Promise<GetTradeLogsByIdQueryResult[] | null> => {
  const query = `
    SELECT *
    FROM trade_logs
    WHERE trade_id = ANY($1::uuid[])
      AND user_id = $2
  `;

  const result = await pool.query<GetTradeLogsByIdQueryResult>(query, [
    trade_ids,
    user_id,
  ]);

  return result.rows || null;
};

export const getExecutionsByIdsFromDB = async (
  trade_ids: string[],
): Promise<GetExecutionsByTradeIdQueryResult[] | null> => {
  const query = `
        SELECT *
        FROM executions
        WHERE trade_id = ANY($1::uuid[])
        ORDER BY executed_at ASC
    `;

  const result = await pool.query<GetExecutionsByTradeIdQueryResult>(query, [
    trade_ids,
  ]);

  return result.rows || null;
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
