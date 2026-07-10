CREATE INDEX CONCURRENTLY idx_trades_user_filters
ON trades(user_id, order_status, direction, market_type, entry_time DESC);