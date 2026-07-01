import type {
  GetMonthlyPnlData,
  GetMonthlyPnlParams,
} from "../../types/stats.types.js";
import { AppError } from "../../utils/AppError.js";
import { getMonthlyPnlRepo } from "./stats.repository.js";

export const getMonthlyPnlService = async ({
  user_id,
  querydata,
}: GetMonthlyPnlParams): Promise<GetMonthlyPnlData[]> => {
  const result = await getMonthlyPnlRepo({ user_id, querydata });

  if (!result || result === undefined || result.length === 0) {
    throw new AppError("Error while fetching monthlypnl", 500);
  }

  const monthlyPnl: GetMonthlyPnlData[] = result.map((item) => {
    return {
      month: Number(item.month),
      total_pnl: Number(item.total_pnl),
    };
  });

  return monthlyPnl;
};
