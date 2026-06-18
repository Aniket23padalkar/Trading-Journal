import type { Request } from "express";
import { GetOverallStatsService } from "./stats.services.js";
import { AppError } from "../../utils/AppError.js";

export const GetOverallStats = async (req: Request, res: Response) => {
  if (!req.user.user_id) {
    throw new AppError("Unauthorized", 401);
  }
  const result = await GetOverallStatsService(req.user.user_id);
};
