import type { createTradeData } from "../schemas/trade.schema.js";

export interface CreateTradeWithUserId extends createTradeData {
  user_id: string;
}

export type ExecutionsRow = [
  tradeId: string,
  order_type: string,
  price: number,
  quantity: number,
  executed_at: Date,
];
