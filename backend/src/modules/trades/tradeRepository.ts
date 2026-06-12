import type { PoolClient } from "pg";
import pool from "../../config/db.js";
import type {
  CreateTradeParams,
  DB,
  GetCompleteTradeQueryResult,
  GetExecutionsByTradeIdQueryResult,
  GetExecutionsQueryResult,
  GetTradeLogsByIdQueryResult,
  GetTradeQueryResult,
  GetTradeRepoParams,
  GetTradesCountFromDBParams,
  GetTradeStatsQueryResult,
  GetYearAndMonthType,
  InsertIntoTradeLogsParams,
  UpdateExecutionsData,
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

export const getExecutionsFromDB = async ({
  trade_id,
  db,
}: {
  trade_id: string;
  db: DB;
}): Promise<GetExecutionsQueryResult[]> => {
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

  const result = await db.query<GetExecutionsQueryResult>(query, [trade_id]);

  return result.rows;
};

export const deleteFromExecutions = async (
  client: PoolClient,
  toDelete: string[],
): Promise<void> => {
  const query = `DELETE FROM executions WHERE execution_id = ANY($1::uuid[])`;

  await client.query(query, [toDelete]);
};

export const getTradeLogsFromDB = async ({
  user_id,
  trade_id,
}: {
  user_id: string;
  trade_id: string;
}): Promise<string | undefined> => {
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

  return result.rows[0]?.description || undefined;
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
  client,
}: CreateTradeParams): Promise<string | undefined> => {
  const query: string = `
    INSERT INTO trades
      (user_id, symbol, market_type, order_status, position, trade_rating, risk, direction, entry_time, exit_time) 
    VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
    RETURNING trade_id
  `;

  const result = await client.query<{ trade_id: string }>(query, [
    user_id,
    symbol,
    market_type,
    order_status,
    position,
    trade_rating,
    risk,
    direction,
    entry_time,
    exit_time,
  ]);

  return result.rows[0]?.trade_id;
};

export const insertIntoTradeLogsInDB = async ({
  client,
  trade_id,
  user_id,
  description,
}: InsertIntoTradeLogsParams): Promise<void> => {
  const query: string = `
    INSERT INTO trade_logs
      (trade_id, user_id, description)
    VALUES
      ($1,$2,$3)
  `;

  await client.query(query, [trade_id, user_id, description]);
};

export const insertIntoExecutionsDynamicValues = async (
  client: PoolClient,
  values: string[],
  params: (string | number | Date)[],
): Promise<void> => {
  const query: string = `
    INSERT INTO executions
      (trade_id, order_type, price, quantity, executed_at)
    VALUES
      ${values.join(",")}
  `;

  await client.query(query, params);
};

export const updateTradeInDB = async ({
  client,
  validatedTrade,
  trade_id,
  user_id,
}: UpdateTradeRepoParams): Promise<void> => {
  const query = `
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
  `;

  await client.query(query, [
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
  ]);
};

export const updateExecutionsFromDB = async (
  client: PoolClient,
  exe: UpdateExecutionsData,
  trade_id: string,
): Promise<void> => {
  const query: string = `
    UPDATE executions
    SET
      order_type = $1,
      price = $2,
      quantity = $3,
      executed_at = $4,
      updated_at = NOW()
    WHERE 
    execution_id=$5 AND trade_id=$6`;

  await client.query(query, [
    exe.order_type,
    exe.price,
    exe.quantity,
    exe.executed_at,
    exe.execution_id,
    trade_id,
  ]);
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

export const getTradeStatsFromDB = async (
  user_id: string,
  tradeIds: string[],
): Promise<GetTradeStatsQueryResult[]> => {
  const query = `
    SELECT
      t.trade_id,

      ROUND(AVG(e.price) FILTER (WHERE e.order_type = 'buy')::NUMERIC,2) AS avg_buy_price,
      ROUND(AVG(e.price) FILTER (WHERE e.order_type = 'sell')::NUMERIC,2) AS avg_sell_price,

      SUM(e.quantity) FILTER (WHERE e.order_type = 'buy') AS total_buy_qty,
      SUM(e.quantity) FILTER (WHERE e.order_type = 'sell') AS total_sell_qty,

      ROUND(
        (
          CASE
            WHEN t.order_status = 'closed' AND t.direction = 'long' THEN
              ((AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
              - AVG(e.price) FILTER (WHERE e.order_type = 'buy'))
              * SUM(e.quantity) FILTER (WHERE e.order_type = 'buy')

            WHEN t.order_status = 'closed' AND t.direction = 'short' THEN
              (AVG(e.price) FILTER (WHERE e.order_type = 'buy')
              - AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
              * SUM(e.quantity) FILTER (WHERE e.order_type = 'sell')

            ELSE 0
          END)::NUMERIC,2) AS pnl,

      ROUND(
        (
          CASE
            WHEN t.risk = 0 THEN NULL
            ELSE
              (
                CASE
                  WHEN t.order_status = 'closed' AND t.direction = 'long' THEN
                    (AVG(e.price) FILTER (WHERE e.order_type = 'sell')
                    - AVG(e.price) FILTER (WHERE e.order_type = 'buy'))
                    * SUM(e.quantity) FILTER (WHERE e.order_type = 'buy')

                  WHEN t.order_status = 'closed' AND t.direction = 'short' THEN
                    (AVG(e.price) FILTER (WHERE e.order_type = 'buy')
                    - AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
                    * SUM(e.quantity) FILTER (WHERE e.order_type = 'sell')

                  ELSE 0
                END
          ) / t.risk
        END
        )::NUMERIC,
        2) AS rr_ratio
    FROM trades t
    LEFT JOIN executions e
      ON t.trade_id = e.trade_id
    WHERE t.user_id = $1 AND t.trade_id = ANY($2::uuid[])
    GROUP BY t.trade_id
  `;

  const result = await pool.query<GetTradeStatsQueryResult>(query, [
    user_id,
    tradeIds,
  ]);

  return result.rows;
};

export const getCompleteTradeFromDB = async (
  trade_id: string,
  user_id: string,
): Promise<GetCompleteTradeQueryResult | null> => {
  const query = `
    SELECT
      t.trade_id,
      t.symbol,
      t.market_type,
      t.order_status,
      t.position,
      t.risk,
      t.direction,
      t.trade_rating,
      t.entry_time,
      t.exit_time,
      t.created_at,
      t.updated_at,
    COALESCE(
      json_agg(
        json_build_object(
          'execution_id',e.execution_id,
          'order_type', e.order_type,
          'price', e.price,
          'quantity', e.quantity,
          'executed_at', e.executed_at,
          'created_at', e.created_at,
          'updated_at', e.updated_at
        )
      ) FILTER (WHERE e.execution_id IS NOT NULL) ,
       '[]'
      ) AS executions,

      json_build_object(
        'trade_logs_id',tl.trade_logs_id,
        'description',tl.description,
        'created_at',tl.created_at,
        'updated_at',tl.updated_at
      ) AS trade_logs,

      ROUND(AVG(e.price) FILTER (WHERE e.order_type = 'buy')::NUMERIC,2) AS avg_buy_price,
      ROUND(AVG(e.price) FILTER (WHERE e.order_type = 'sell')::NUMERIC,2) AS avg_sell_price,

      SUM(e.quantity) FILTER (WHERE e.order_type = 'buy') AS total_buy_qty,
      SUM(e.quantity) FILTER (WHERE e.order_type = 'sell') AS total_sell_qty,

      ROUND(
        (
          CASE
            WHEN t.order_status = 'closed' AND t.direction = 'long' THEN
              ((AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
              - AVG(e.price) FILTER (WHERE e.order_type = 'buy'))
              * SUM(e.quantity) FILTER (WHERE e.order_type = 'buy')

            WHEN t.order_status = 'closed' AND t.direction = 'short' THEN
              (AVG(e.price) FILTER (WHERE e.order_type = 'buy')
              - AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
              * SUM(e.quantity) FILTER (WHERE e.order_type = 'sell')

            ELSE 0
          END)::NUMERIC,2) AS pnl,

      ROUND(
        (
          CASE
            WHEN t.risk = 0 THEN NULL
            ELSE
              (
                CASE
                  WHEN t.order_status = 'closed' AND t.direction = 'long' THEN
                    (AVG(e.price) FILTER (WHERE e.order_type = 'sell')
                    - AVG(e.price) FILTER (WHERE e.order_type = 'buy'))
                    * SUM(e.quantity) FILTER (WHERE e.order_type = 'buy')

                  WHEN t.order_status = 'closed' AND t.direction = 'short' THEN
                    (AVG(e.price) FILTER (WHERE e.order_type = 'buy')
                    - AVG(e.price) FILTER (WHERE e.order_type = 'sell'))
                    * SUM(e.quantity) FILTER (WHERE e.order_type = 'sell')

                  ELSE 0
                END
          ) / t.risk
        END
        )::NUMERIC,
        2) AS rr_ratio
    FROM trades t
    LEFT JOIN executions e ON e.trade_id = t.trade_id
    LEFT JOIN trade_logs tl ON tl.trade_id = t.trade_id
    WHERE t.trade_id = $1 AND t.user_id = $2
    GROUP BY t.trade_id, tl.trade_logs_id
  `;

  const result = await pool.query<GetCompleteTradeQueryResult>(query, [
    trade_id,
    user_id,
  ]);

  return result.rows[0] || null;
};

export const getTradesCountFromDB = async ({
  whereClause,
  values,
}: GetTradesCountFromDBParams): Promise<{ count: number } | null> => {
  const query = `
        SELECT COUNT(*)
        FROM trades
        WHERE ${whereClause}
    `;

  const result = await pool.query<{ count: number }>(query, values);

  return result.rows[0] || null;
};

export const extractYearMonthFromDB = async (
  user_id: string,
): Promise<GetYearAndMonthType | undefined> => {
  const query: string = `
    SELECT
      ARRAY_AGG(DISTINCT EXTRACT(YEAR FROM entry_time)) AS years,
      ARRAY_AGG(DISTINCT EXTRACT(MONTH FROM entry_time)) AS months
    FROM trades
    WHERE user_id = $1
  `;

  const result = await pool.query<GetYearAndMonthType>(query, [user_id]);

  return result.rows[0] || undefined;
};

// export const getFilteredStatsFromDB = async ({ whereClause, values }) => {
//   const query = `
//     WITH first_logs AS (
//         SELECT trade_id, MIN(entry_time) AS first_entry
//         FROM trade_logs
//         GROUP BY trade_id
//       )
//       SELECT
//         COALESCE(COUNT(t.trade_id),0) AS trades_count,
//         COALESCE(SUM(t.pnl) FILTER(WHERE t.status = 'Closed'),0) AS trades_pnl,
//         COALESCE(SUM(t.avg_rr) FILTER(WHERE t.status = 'Closed'),0) AS trade_rr,
//         COALESCE(
//           CAST(
//             (COUNT(*) FILTER(WHERE t.pnl > 0 AND t.status = 'Closed') * 100.0)
//             / NULLIF(COUNT(*) FILTER(WHERE t.status = 'Closed'),0)
//           AS NUMERIC(5,2))
//         ,0) AS trades_win_rate
//       FROM trades t
//       JOIN first_logs l ON t.trade_id = l.trade_id
//       WHERE ${whereClause}
//   `;

//   return pool.query(query, values);
// };

// export const getMonthlyPnlFromDB = async ({ year, userId }) => {
//   const query = `
//     WITH first_logs AS (
//       SELECT trade_id, MIN(entry_time) AS first_entry
//       FROM trade_logs
//       GROUP BY trade_id
//     )
//     SELECT
//       EXTRACT(MONTH FROM fl.first_entry) AS month,
//       SUM(t.pnl) AS total_pnl
//     FROM first_logs fl
//     JOIN trades t ON t.trade_id = fl.trade_id
//     WHERE t.user_id = $1
//       AND EXTRACT(YEAR FROM fl.first_entry) = $2
//       AND t.status = 'Closed'
//     GROUP BY month
//     ORDER BY month
//   `;

//   return pool.query(query, [userId, year]);
// };
