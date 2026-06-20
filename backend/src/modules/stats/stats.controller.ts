import type { Request, Response } from "express";
import { GetOverallStatsService } from "./stats.services.js";
import { AppError } from "../../utils/AppError.js";
import type { GetOverallStatsData } from "../../types/stats.types.js";

export const GetOverallStats = async (
  req: Request,
  res: Response<{
    success: boolean;
    data: GetOverallStatsData;
    message: string;
  }>,
) => {
  if (!req.user.user_id) {
    throw new AppError("Unauthorized", 401);
  }
  const result = await GetOverallStatsService(req.user.user_id);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Overall stats successfully fetched",
  });
};
