import type {
  CreateTradeData,
  ExecutionsData,
  GetTradeQueryData,
  UpdateTradeData,
} from "../schemas/trade.schema.js";

export interface CreateTradeWithUserId extends CreateTradeData {
  user_id: string;
}

export type ExecutionsRow = [
  trade_id: string,
  order_type: "buy" | "sell",
  price: number,
  quantity: number,
  executed_at: Date,
];

export interface UpdateTradeServiceParams {
  trade_id: string;
  body: UpdateTradeData;
  user_id: string;
}

export interface GetTradeQueryResult {
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

export interface GetExecutionsQueryResult {
  execution_id: string;
  order_type: "buy" | "sell";
  price: number;
  quantity: number;
  executed_at: Date;
}

export interface UpdateTradeRepoParams {
  validatedTrade: CreateTradeData;
  trade_id: string;
  user_id: string;
}

export interface GetTradesServicesParams {
  query: GetTradeQueryData;
  user_id: string;
}

export interface ValidateDirectionParams {
  executions: ExecutionsData[];
  direction: "long" | "short";
}

export interface ValidateExecutionTimeParams {
  executions: ExecutionsData[];
  entry_time: Date;
}

export interface ValidateOrderTypeParams {
  executions: ExecutionsData[];
  order_status: "open" | "closed";
}

export interface ValidateQuantitiesParams {
  executions: ExecutionsData[];
  direction: "long" | "short";
}

export type BuildFilterValues = string | Date | number;

export interface GetTradeRepoParams {
  whereClause: string;
  values: BuildFilterValues[];
  index: number;
  orderBy: string;
  limit: number;
  offset: number;
}

export interface GetExecutionsByTradeIdQueryResult {
  execution_id: string;
  trade_id: string;
  order_type: "buy" | "sell";
  price: number;
  quantity: number;
  executed_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface GetTradeLogsByIdQueryResult {
  trade_logs_id: string;
  trade_id: string;
  user_id: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface GetTradeStatsQueryResult {
  trade_id: string;
  avg_buy_price: number;
  avg_sell_price: number;
  total_buy_qty: number;
  total_sell_qty: number;
  pnl: number;
  rr_ratio: number;
}

export interface GetTradesCountFromDBParams {
  whereClause: string;
  values: BuildFilterValues[];
}

export interface TradesDataType {
  trade: GetTradeQueryResult;
  executions: Omit<GetExecutionsByTradeIdQueryResult, "trade_id">[];
  trade_logs: Omit<GetTradeLogsByIdQueryResult, "trade_id" | "user_id"> | null;
  stats: Omit<GetTradeStatsQueryResult, "trade_id"> | null;
}

interface PaginationType {
  limit: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface GetTradesResponse {
  trades_data: TradesDataType[];
  pagination: PaginationType;
}
