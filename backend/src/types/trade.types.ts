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
  symbol: string;
  market_type: "equity" | "options" | "futures";
  order_status: "open" | "closed";
  position: "intraday" | "btst" | "stbt" | "swing" | "positional" | "longterm";
  risk: number;
  direction: "long" | "short";
  trade_rating: "worst" | "poor" | "average" | "good" | "best";
  entry_time: Date;
  exit_time: Date;
}

export interface GetExecutionsQueryResult {
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

export type BuildFilterValues = string | Date;
