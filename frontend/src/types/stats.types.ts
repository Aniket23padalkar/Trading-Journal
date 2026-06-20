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
