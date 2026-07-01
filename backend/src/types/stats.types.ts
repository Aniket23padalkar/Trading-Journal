import type { GetMonthlyPnlQueryData } from "../schemas/trade.schema.js";

export interface GetMonthlyPnlParams {
  user_id: string;
  querydata: GetMonthlyPnlQueryData;
}

export interface GetMonthlyPnlData {
  month: number;
  total_pnl: number;
}
