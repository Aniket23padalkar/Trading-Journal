CREATE TYPE direction_enum AS ENUM ('long','short');

ALTER TABLE trades
ADD COLUMN IF NOT EXISTS direction direction_enum NOT NULL;