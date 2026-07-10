CREATE TYPE market_type_enum AS ENUM ('equity','options','futures');
CREATE TYPE order_status_enum AS ENUM ('open','closed');
CREATE TYPE position_enum AS ENUM ('intraday','btst', 'stbt','swing','positional','longterm');
CREATE TYPE trade_rating_enum AS ENUM ('worst','poor','average','good','best');

CREATE TABLE trades(
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    
    market_type market_type_enum NOT NULL DEFAULT 'equity',
    order_status order_status_enum NOT NULL DEFAULT 'open',
    position position_enum NOT NULL DEFAULT 'intraday',

    trade_rating trade_rating_enum NOT NULL DEFAULT 'average',

    entry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_time TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trades_user_id ON trades(user_id);

CREATE TRIGGER set_updated_at_trades
BEFORE UPDATE ON trades
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();