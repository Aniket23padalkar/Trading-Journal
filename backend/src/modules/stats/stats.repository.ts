import pool from "../../config/db.js";
import type {
  GetMonthlyPnlData,
  GetMonthlyPnlParams,
} from "../../types/stats.types.js";

export const getMonthlyPnlRepo = async ({
  user_id,
  querydata,
}: GetMonthlyPnlParams): Promise<GetMonthlyPnlData[] | undefined> => {
  const query: string = `
    SELECT
      EXTRACT(MONTH FROM entry_time) AS month,
      COALESCE(SUM(pnl),0) AS total_pnl 
    FROM trades
    WHERE user_id = $1
      AND order_status = 'closed'
      AND EXTRACT(YEAR FROM entry_time) = $2
    GROUP BY month
    ORDER BY month
  `;

  const result = await pool.query<GetMonthlyPnlData>(query, [
    user_id,
    querydata.year,
  ]);

  return result.rows || undefined;
};
