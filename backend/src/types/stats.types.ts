import type {
  GetMonthlyPnlQueryData,
  GetTradeQueryData,
} from "../schemas/trade.schema.js";
import type { BuildFilterValues } from "./trade.types.js";

export interface GetOverallStatsData {
  total_pnl: number;
  max_profit: number;
  max_loss: number;
  total_profit: number;
  total_loss: number;
  overall_rr: number;
  average_risk_per_trade: number;
  total_profit_trades: number;
  total_loss_trades: number;
  ctc_trades: number;
  closed_trades: number;
  win_rate: number;
}

export interface GetFilteredStatsServiceParams {
  user_id: string;
  query: GetTradeQueryData;
}

export interface GetFilteredStatsRepoParams {
  whereClause: string;
  values: BuildFilterValues[];
}

export interface GetFilteredStatsData {
  trades_count: number;
  win_rate: number;
  total_pnl: number;
  total_rr: number;
}

export interface GetMonthlyPnlParams {
  user_id: string;
  querydata: GetMonthlyPnlQueryData;
}

export interface GetMonthlyPnlData {
  month: number;
  total_pnl: number;
}
