


CREATE TABLE trade_logs (
    trade_logs_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(trade_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE

    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trade_logs_trade_id ON trade_logs(trade_id);

CREATE TRIGGER set_updated_at_trade_logs
BEFORE UPDATE ON trade_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();