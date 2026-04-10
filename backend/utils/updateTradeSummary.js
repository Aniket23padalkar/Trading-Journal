import calculateStats from "./calculateStats.js";

export default async function updateTradeSummary(client, tradeId, status) {
  const logsRes = await client.query(
    `SELECT * FROM trade_logs WHERE trade_id = $1`,
    [tradeId],
  );

  const executions = logsRes.rows;

  const stats = calculateStats(executions, status);

  await client.query(
    `
    UPDATE trades
    SET
        pnl = $1,
        avg_buy_price =$2,
        avg_sell_price = $3,
        avg_risk = $4,
        avg_rr = $5,
        total_qty = $6
    WHERE trade_id = $7
    `,
    [
      stats.pnl,
      stats.avgBuy,
      stats.avgSell,
      stats.avgRisk,
      stats.avgRR,
      stats.totalQty,
      tradeId,
    ],
  );
}
