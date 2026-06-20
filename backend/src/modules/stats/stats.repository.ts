import pool from "../../config/db.js";
import type { GetOverallStatsData } from "../../types/stats.types.js";

export const getOverallStatsRepo = async (
  user_id: string,
): Promise<GetOverallStatsData | undefined> => {
  const query = `
        SELECT
            COALESCE(SUM(pnl) FILTER (WHERE order_status = 'closed'),0) AS total_pnl,

            COALESCE(MAX(pnl) FILTER (WHERE pnl > 0 AND order_status = 'closed'),0) AS max_profit,
            COALESCE(MIN(pnl) FILTER (WHERE pnl < 0 AND order_status = 'closed'),0) AS max_loss,

            COALESCE(SUM(pnl) FILTER (WHERE pnl > 0 AND order_status = 'closed'),0) AS total_profit,
            COALESCE(SUM(pnl) FILTER (WHERE pnl < 0 AND order_status = 'closed'),0) AS total_loss,

            COALESCE(SUM(pnl / risk) FILTER(WHERE order_status = 'closed'),0) AS overall_rr,
            COALESCE(AVG(risk),0) AS average_risk_per_trade,

            COALESCE(COUNT(*) FILTER (WHERE pnl > 0 AND order_status = 'closed'),0) AS total_profit_trades,
            COALESCE(COUNT(*) FILTER (WHERE pnl < 0 AND order_status = 'closed'),0) AS total_loss_trades,
            COALESCE(COUNT(*) FILTER (WHERE pnl = 0 AND order_status = 'closed'),0) AS ctc_trades,
            COALESCE(COUNT(*) FILTER (WHERE order_status = 'closed'),0) AS closed_trades,

            COALESCE(
              CAST(
                (COUNT(*) FILTER(WHERE pnl > 0) * 100)
                / NULLIF(COUNT(*) FILTER (WHERE order_status = 'closed'),0)
                AS NUMERIC(5,2))
            ,0) AS win_rate
        FROM trades
        WHERE user_id = $1
    `;

  const result = await pool.query<GetOverallStatsData>(query, [user_id]);

  return result.rows[0] || undefined;
};
