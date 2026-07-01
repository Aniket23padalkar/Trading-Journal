import type { Request, Response } from "express";
import { getMonthlyPnlService } from "./stats.services.js";
import { AppError } from "../../utils/AppError.js";
import type { GetMonthlyPnlData } from "../../types/stats.types.js";
import type { GetMonthlyPnlQueryData } from "../../schemas/trade.schema.js";

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
