CREATE TYPE order_type_enum AS ENUM ('buy', 'sell');

CREATE TABLE executions(
    execution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID REFERENCES trades(trade_id) ON DELETE CASCADE,

    order_type order_type_enum NOT NULL DEFAULT 'buy',
    price DECIMAL(12,4) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),

    executed_at TIMESTAMP WITH TIME ZONE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_executions_trade_time ON executions(trade_id,executed_at);

CREATE TRIGGER set_updated_at_executions
BEFORE UPDATE ON executions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();