export interface GetFilteredStatsData {
  trades_count: number;
  win_rate: number;
  total_pnl: number;
  total_rr: number;
}

export interface GetMonthlyPnlData {
  month: number;
  total_pnl: number;
}

export interface MonthlyPnlDataType {
  month: string;
  total_pnl: number;
}
