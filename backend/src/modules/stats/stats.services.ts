import type { GetOverallStatsData } from "../../types/stats.types.js";
import { AppError } from "../../utils/AppError.js";
import { getOverallStatsRepo } from "./stats.repository.js";

export const GetOverallStatsService = async (
  user_id: string,
): Promise<GetOverallStatsData> => {
  const result = await getOverallStatsRepo(user_id);

  if (result === undefined) {
    throw new AppError("Error while getting overall stats", 500);
  }

  const overallStats: GetOverallStatsData = {
    total_pnl: Number(result.total_pnl),
    max_profit: Number(result.max_profit),
    max_loss: Number(result.max_loss),
    total_profit: Number(result.total_profit),
    total_loss: Number(result.total_loss),
    overall_rr: Number(result.overall_rr),
    average_risk_per_trade: Number(result.average_risk_per_trade),
    total_profit_trades: Number(result.total_profit_trades),
    total_loss_trades: Number(result.total_loss_trades),
    ctc_trades: Number(result.ctc_trades),
    closed_trades: Number(result.closed_trades),
    win_rate: Number(result.win_rate),
  };

  return overallStats;
};
