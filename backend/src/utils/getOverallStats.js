export default async function getOverallStats(pool, userId) {
  const overallRes = await pool.query(
    `
      SELECT 
        COALESCE(SUM(pnl),0) AS overall_pnl,

        COALESCE(MAX(pnl) FILTER (WHERE pnl > 0 AND status = 'Closed'),0) AS max_profit,
        COALESCE(MIN(pnl) FILTER (WHERE pnl < 0 AND status = 'Closed'),0) AS max_loss,

        COALESCE(SUM(pnl) FILTER (WHERE pnl > 0 AND status = 'Closed'),0) AS total_profit,
        COALESCE(SUM(pnl) FILTER (WHERE pnl < 0 AND status ='Closed'),0) AS total_loss,

        COALESCE(SUM(avg_rr) FILTER (WHERE status = 'Closed'),0) AS overall_rr,
        COALESCE(CAST(AVG(avg_risk) FILTER (WHERE status = 'Closed') AS NUMERIC(10,2)),0) AS average_risk_per_trade,

        COALESCE(COUNT(*) FILTER (WHERE pnl > 0 AND status = 'Closed'),0) AS total_profit_trades,
        COALESCE(COUNT(*) FILTER (WHERE pnl < 0 AND status = 'Closed'),0) AS total_loss_trades,
        COALESCE(COUNT(*) FILTER (WHERE pnl = 0 AND status = 'Closed'),0) AS ctc_trades,
        COALESCE(COUNT(*) FILTER (WHERE status = 'Closed'),0) AS closed_trades,
        COALESCE(
          CAST(
            (
              COUNT(*) FILTER (WHERE pnl > 0 AND status = 'Closed') * 100.0)
              /NULLIF(COUNT(*) FILTER (WHERE status = 'Closed'),0) 
              AS NUMERIC(5,2)) ,0) 
              AS win_rate
      FROM trades 
      WHERE user_id = $1`,
    [userId],
  );

  return overallRes.rows[0];
}
