import type { Request, Response } from "express";
import {
  getFilteredStatsService,
  getMonthlyPnlService,
  getOverallStatsService,
} from "./stats.services.js";
import { AppError } from "../../utils/AppError.js";
import type {
  GetFilteredStatsData,
  GetMonthlyPnlData,
  GetOverallStatsData,
} from "../../types/stats.types.js";
import type {
  GetMonthlyPnlQueryData,
  GetTradeQueryData,
} from "../../schemas/trade.schema.js";

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

export const getFilteredStats = async (
  req: Request<{}, {}, {}, GetTradeQueryData>,
  res: Response<{
    success: boolean;
    data: GetFilteredStatsData;
    message: string;
  }>,
) => {
  if (!req.user.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await getFilteredStatsService({
    user_id: req.user.user_id,
    query: req.validated?.query,
  });

  return res.status(200).json({
    success: true,
    data: result,
    message: "Filtered stats fetched successfully",
  });
};

export const getMonthlyPnl = async (
  req: Request<{}, {}, {}, GetMonthlyPnlQueryData>,
  res: Response<{
    success: boolean;
    data: GetMonthlyPnlData[];
    message: string;
  }>,
) => {
  if (!req.user.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await getMonthlyPnlService({
    user_id: req.user.user_id,
    querydata: req.validated?.query,
  });

  return res.status(200).json({
    success: true,
    data: result,
    message: "Monthly pnl fetched successfully",
  });
};
