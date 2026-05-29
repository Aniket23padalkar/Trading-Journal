export default async function getTradeByID(client, tradeId, userId) {
  const tradeRes = await client.query(
    `SELECT * FROM trades WHERE trade_id = $1 AND user_id = $2`,
    [tradeId, userId],
  );

  const trade = tradeRes.rows[0];

  if (!trade) {
    throw new Error("Trade not found");
  }

  const logsRes = await client.query(
    `
		SELECT * 
		FROM trade_logs
		WHERE trade_id = $1
		ORDER BY entry_time ASC
		`,
    [tradeId],
  );

  return {
    trade: {
      trade_id: trade.trade_id,
      symbol: trade.symbol,
      status: trade.status,
      order_type: trade.order_type,
      market_type: trade.market_type,
      position: trade.position,
      rating: trade.rating,
      description: trade.description,
      created_at: trade.created_at,
      updated_at: trade.updated_at,
    },
    executions: logsRes.rows,
    stats: {
      pnl: trade.pnl,
      avg_buy_price: trade.avg_buy_price,
      avg_sell_price: trade.avg_sell_price,
      avg_risk: trade.avg_risk,
      avg_rr: trade.avg_rr,
      total_qty: trade.total_qty,
    },
  };
}
