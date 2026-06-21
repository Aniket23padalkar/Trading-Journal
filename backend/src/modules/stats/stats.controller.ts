import type { Request, Response } from "express";
import {
  getFilteredStatsService,
  getOverallStatsService,
} from "./stats.services.js";
import { AppError } from "../../utils/AppError.js";
import type { GetOverallStatsData } from "../../types/stats.types.js";
import { success } from "zod";

export const getOverallStats = async (
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
  const result = await getOverallStatsService(req.user.user_id);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Overall stats successfully fetched",
  });
};

export const getFilteredStats = async (req: Request, res: Response) => {
  if (!req.user.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await getFilteredStatsService({
    user_id: req.user.user_id,
    query: req.validated?.query,
  });

  return res
    .status(200)
    .json({
      success: true,
      data: result,
      message: "Filtered stats fetched successfully",
    });
};
