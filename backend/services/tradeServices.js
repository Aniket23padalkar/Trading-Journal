export default async function getTradeByID(client, tradeId) {
  const result = await client.query(
    `
		SELECT
			json_build_object(
				'trade', json_build_object(
					'trade_id', t.trade_id,
					'symbol', t.symbol,
					'status', t.status,
					'order_type', t.order_type,
					'position', t.position,
					'market_type', t.market_type,
					'rating', t.rating,
					'description', t.description,
					'created_at', t.created_at,
					'updated_at', t.updated_at
				),
				'executions',
				json_agg(
					json_build_object(
						'trade_logs_id', tl.trade_logs_id,
						'buy_price', tl.buy_price,
						'sell_price', tl.sell_price,
						'quantity', tl.quantity,
						'risk', tl.risk,
						'entry_time', tl.entry_time,
						'exit_time', tl.exit_time
					)
						ORDER BY tl.entry_time DESC
				),
				'stats',
				json_build_object(
					'pnl', t.pnl,

          'total_qty',t.total_qty,

          'avg_risk', t.avg_risk,

          'avg_rr', t.avg_rr,
          
          'avg_buy_price', t.avg_buy_price,

          'avg_sell_price', t.avg_sell_price
				)
			) AS trade_data
		FROM trades t
		LEFT JOIN trade_logs tl
		ON t.trade_id = tl.trade_id
		WHERE t.trade_id = $1
		GROUP BY t.trade_id
		ORDER BY t.created_at ASC
		`,
    [tradeId],
  );

  return result.rows[0]?.trade_data;
}
