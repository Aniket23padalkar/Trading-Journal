import type { Client, Pool, PoolClient } from "pg";
import type {
  CreateTradeData,
  ExecutionsData,
  GetTradeQueryData,
  UpdateTradeData,
} from "../schemas/trade.schema.js";

export type DB = Pool | PoolClient;

export type CreateTradeParams = Omit<
  CreateTradeData,
  "executions" | "description"
> & {
  client: PoolClient;
  user_id: string;
  pnl: number | null;
};

export interface InsertIntoTradeLogsParams {
  user_id: string;
  trade_id: string;
  description: string | undefined;
  client: PoolClient;
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
  exit_time: Date | null;
  pnl: number | null;
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

export type UpdateExecutionsData = Omit<
  GetExecutionsQueryResult,
  "execution_id"
> & {
  execution_id?: string | undefined;
};

export interface UpdateTradeRepoParams {
  client: PoolClient;
  validatedTrade: UpdateTradeData;
  trade_id: string;
  user_id: string;
  pnl: number | null;
}

export interface GetTradesServicesParams {
  query: GetTradeQueryData;
  user_id: string;
}

export interface ValidateDirectionParams {
  executions: ExecutionsData[] | undefined;
  direction: "long" | "short" | undefined;
}

export interface ValidateExecutionTimeParams {
  executions: ExecutionsData[] | undefined;
  entry_time: Date | undefined;
}

export interface ValidateOrderTypeParams {
  executions: ExecutionsData[] | undefined;
  order_status: "open" | "closed" | undefined;
}

export interface ValidateQuantitiesParams {
  executions: ExecutionsData[] | undefined;
  direction: "long" | "short" | undefined;
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
  total_qty: number;
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

export interface FilteredStatsData {
  trades_count: number;
  win_rate: number;
  total_pnl: number;
  total_rr: number;
}

export interface OverallStatsData {
  overall_pnl: number;
  max_profit: number;
  max_loss: number;
  overall_profit: number;
  overall_loss: number;
  overall_rr: number;
  average_risk_per_trade: number;
  overall_profit_trades: number;
  overall_loss_trades: number;
  ctc_trades: number;
  closed_trades: number;
  overall_win_rate: number;
}

export interface GetTradesResponse {
  trades_data: TradesDataType[];
  pagination: PaginationType;
  filtered_stats: FilteredStatsData;
  overall_stats: OverallStatsData;
}

export interface GetCompleteTradeQueryResult {
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

  overall_pnl: number;
  max_profit: number;
  max_loss: number;
  overall_profit: number;
  overall_loss: number;
  overall_rr: number;
  average_risk_per_trade: number;
  overall_profit_trades: number;
  overall_loss_trades: number;
  ctc_trades: number;
  closed_trades: number;
  overall_win_rate: number;

  trades_count: number;
  win_rate: number;
  total_pnl: number;
  total_rr: number;

  executions: Omit<GetExecutionsByTradeIdQueryResult, "trade_id">[];

  trade_logs: Omit<GetTradeLogsByIdQueryResult, "trade_id" | "user_id">;

  avg_buy_price: number;
  avg_sell_price: number;
  total_buy_qty: number;
  total_sell_qty: number;
  pnl: number;
  total_qty: number;
  rr_ratio: number;
}

export interface GetYearAndMonthType {
  year: number;
  months: number[];
}
