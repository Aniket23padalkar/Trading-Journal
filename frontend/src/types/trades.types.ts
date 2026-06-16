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
  total_qty: number;
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

export interface FilterValuesUI {
  direction: string | "";
  order_status: string | "";
  market_type: string | "";
  position: string | "";
  fromDate: Date | "";
  toDate: Date | "";
  year: number | "";
  month: number | "";
  pnlSort: string | "";
  dateTimeSort: string | "";
}

export interface FilterValues {
  direction: string | null;
  order_status: string | null;
  market_type: string | null;
  position: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  year: number | null;
  month: number | null;
  pnlSort: string | null;
  dateTimeSort: string | null;
}

export interface FormDataUIType {
  symbol: string;
  market_type: "equity" | "options" | "futures" | "";
  order_status: "open" | "closed" | "";
  position:
    | "intraday"
    | "btst"
    | "stbt"
    | "swing"
    | "positional"
    | "longterm"
    | "";
  risk: number | "";
  direction: "long" | "short" | "";
  trade_rating: "worst" | "poor" | "average" | "good" | "best" | "";
  description: string;
  entry_time: Date | "";
  exit_time?: Date | "";
}

export interface FormDataType {
  symbol: string;
  market_type: "equity" | "options" | "futures" | null;
  order_status: "open" | "closed" | null;
  position:
    | "intraday"
    | "btst"
    | "stbt"
    | "swing"
    | "positional"
    | "longterm"
    | null;
  risk: number | null;
  direction: "long" | "short" | null;
  trade_rating: "worst" | "poor" | "average" | "good" | "best" | null;
  description: string | null;
  entry_time: Date | null;
  exit_time?: Date | null;
}

export interface ExecutionsUIType {
  order_type: "buy" | "sell" | "";
  price: number | "";
  quantity: number | "";
  executed_at: Date | "";
}

export interface ExecutionsType {
  order_type: "buy" | "sell" | null;
  price: number | null;
  quantity: number | null;
  executed_at: Date | null;
}

interface ExecutionsTypeWithID extends ExecutionsUIType {
  execution_id?: string;
}

export interface UpdateTradeParams {
  trade_id: string;
  formData: FormDataType;
  executions: ExecutionsTypeWithID[];
}

export interface InsertTradeParams {
  formData: FormDataType;
  executions: ExecutionsUIType[];
}

export interface GetYearAndMonthData {
  years: number[];
  months: number[];
}

export interface FormattedMonthsData {
  label: string | undefined;
  value: number;
}

export interface GetYearAndMonthResponse {
  years: number[];
  months: FormattedMonthsData[];
}

export interface HandleExecutionEntries<T extends keyof ExecutionsUIType> {
  index: number;
  field: T;
  value: ExecutionsUIType[T];
}

export interface EditTrade {
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
  description: string;
  executions: ExecutionsUIType[];
}
