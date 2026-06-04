import type {
  CreateTradeData,
  UpdateTradeData,
} from "../schemas/trade.schema.js";

export interface CreateTradeWithUserId extends CreateTradeData {
  user_id: string;
}

export type ExecutionsRow = [
  trade_id: string,
  order_type: string,
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
  market_type: string;
  order_status: string;
  position: string;
  trade_rating: string;
  entry_time: Date;
  exit_time: Date;
}

export interface GetExecutionsQueryResult {
  order_type: string;
  price: number;
  quantity: number;
  executed_at: Date;
}

export interface UpdateTradeRepoParams {
  validatedTrade: CreateTradeData;
  trade_id: string;
  user_id: string;
}
