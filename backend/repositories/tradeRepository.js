import pool from "../config/auth.js";

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

export const createTradeInDB = async ({
  userId,
  symbol,
  order_type,
  status,
  market_type,
  position,
  rating,
  description,
  executions,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const newTrade = await client.query(
      "INSERT INTO trades(user_id,symbol,status,order_type,position,market_type,rating,description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        userId,
        symbol,
        status,
        order_type,
        position,
        market_type,
        rating,
        description,
      ],
    );

    const tradeId = newTrade.rows[0].trade_id;

    for (const exe of executions) {
      await client.query(
        "INSERT INTO trade_logs(trade_id,buy_price,sell_price,quantity,risk,entry_time,exit_time) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [
          tradeId,
          exe.buy_price || 0,
          exe.sell_price || 0,
          exe.quantity,
          exe.risk,
          exe.entry_time,
          exe.exit_time || null,
        ],
      );
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

export const checkTradeOwnership = async (tradeId, userId) => {
  return pool.query(
    `SELECT * FROM trades WHERE trade_id = $1 AND user_id = $2`,
    [tradeId, userId],
  );
};

export const updateTradeInDB = async ({
  tradeId,
  symbol,
  order_type,
  status,
  market_type,
  position,
  rating,
  description,
  executions,
  userId,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE trades
        SET
          symbol=$1,
          order_type=$2,
          status=$3,
          market_type=$4,
          position=$5,
          rating=$6,
          description=$7,
          updated_at=NOW()
        WHERE
          trade_id=$8 AND user_id=$9
        RETURNING *
        `,
      [
        symbol,
        order_type,
        status,
        market_type,
        position,
        rating,
        description,
        tradeId,
        userId,
      ],
    );

    const existingLogs = await client.query(
      `SELECT trade_logs_id FROM trade_logs WHERE trade_id=$1`,
      [tradeId],
    );

    const existingIds = existingLogs.rows.map((r) => r.trade_logs_id);
    const incomingIds = executions
      .filter((e) => e.trade_logs_id)
      .map((e) => e.trade_logs_id);

    const toDelete = existingIds.filter((eId) => !incomingIds.includes(eId));

    if (toDelete.length > 0) {
      await client.query(
        `DELETE FROM trade_logs WHERE trade_logs_id = ANY($1::uuid[])`,
        [toDelete],
      );
    }

    for (const exe of executions) {
      if (exe.trade_logs_id) {
        await client.query(
          `
        UPDATE trade_logs
        SET
          buy_price=$1,
          sell_price=$2,
          quantity=$3,
          risk=$4,
          entry_time=$5,
          exit_time=$6
        WHERE 
          trade_logs_id=$7 AND trade_id=$8
        RETURNING *
        `,
          [
            exe.buy_price,
            exe.sell_price,
            exe.quantity,
            exe.risk,
            exe.entry_time,
            exe.exit_time,
            exe.trade_logs_id,
            tradeId,
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
