import type { Request, Response } from "express";
import {
  createTradeService,
  getTradesService,
  getYearMonthService,
  tradeDeleteService,
  updateTradeService,
} from "./tradeService.js";
import { AppError } from "../../utils/AppError.js";
import type {
  GetTradeQueryData,
  TradeParamsTradeId,
  UpdateTradeData,
} from "../../schemas/trade.schema.js";
import type {
  GetTradesResponse,
  TradesDataType,
} from "../../types/trade.types.js";

export const createTrade = async (
  req: Request,
  res: Response<{ success: boolean; message: string }>,
) => {
  if (!req.user?.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await createTradeService(
    req.validated?.body,
    req.user?.user_id,
  );

  return res.status(201).json({ success: true, message: result.message });
};

export const updateTrade = async (
  req: Request<TradeParamsTradeId, {}, UpdateTradeData>,
  res: Response<{ success: boolean; data: TradesDataType; message: string }>,
) => {
  const trade_id = req.validated?.params.trade_id;

  if (!req.user?.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await updateTradeService({
    trade_id,
    body: req.validated?.body,
    user_id: req.user.user_id,
  });

  return res.status(200).json({
    success: true,
    data: result,
    message: "Trade updated successfully",
  });
};

export const deleteTrade = async (
  req: Request<TradeParamsTradeId>,
  res: Response<{
    success: boolean;
    data: { trade_id: string };
    message: string;
  }>,
) => {
  const data = await tradeDeleteService({
    trade_id: req.validated?.params.trade_id,
    user_id: req.user.user_id,
  });

  return res
    .status(200)
    .json({ success: true, data: data, message: "Trade Deleted" });
};

export const getTrades = async (
  req: Request<{}, {}, {}, GetTradeQueryData>,
  res: Response<{ success: boolean; data: GetTradesResponse; message: string }>,
) => {
  const result = await getTradesService({
    query: req.validated?.query,
    user_id: req.user.user_id,
  });

  return res.status(200).json({
    success: true,
    data: result,
    message: "Trades fetched successfully",
  });
};

export const getYearMonth = async (req: Request, res: Response) => {
  const result = await getYearMonthService(req.user.user_id);

  return res.status(200).json({
    success: true,
    data: result,
    message: "Trades fetched successfully",
  });
};
