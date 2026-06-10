export interface Trades {
  trade_id: string;
  symbol: string;
  market_type: "equity" | "options" | "futures";
  order_status: "open" | "closed";
  position: "intraday" | "btst" | "stbt" | "swing" | "positional" | "longterm";
  risk: number;
  direction: "long" | "short";
  trade_rating: "worst" | "poor" | "average" | "good" | "best";
  entry_time: Date;
  exit_time: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Executions {
  execution_id: string;
  order_type: "buy" | "sell";
  price: number;
  quantity: number;
  executed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TradeLogs {
  trade_logs_id: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface Stats {
  avg_buy_price: number;
  avg_sell_price: number;
  total_buy_qty: number;
  total_sell_qty: number;
  pnl: number;
  rr_ratio: number;
}

export interface TradesData {
  trade: Trades;
  executions: Executions[];
  trade_logs: TradeLogs;
  stats: Stats;
}

export interface Pagination {
  limit: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface Data {
  trades_data: TradesData[] | [];
  pagination: Pagination;
}

export interface FilterValues {
  order_type: string;
  order_status: string;
  market_type: string;
  position: string;
  fromDate: Date | null;
  toDate: Date | null;
  year: number | null;
  month: number | null;
  pnlSort: string;
  dateTimeSort: string;
}
