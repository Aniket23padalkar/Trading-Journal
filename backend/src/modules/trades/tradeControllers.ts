import type { Request, Response } from "express";
import {
  createTradeService,
  getTradesService,
  tradeDeleteService,
  updateTradeService,
} from "./tradeService.js";
import { AppError } from "../../utils/AppError.js";
import type {
  GetTradeQueryData,
  TradeParamsTradeId,
  UpdateTradeData,
} from "../../schemas/trade.schema.js";
import type { GetTradesResponse } from "../../types/trade.types.js";

export const createTrade = async (req: Request, res: Response) => {
  if (!req.user?.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await createTradeService(req.body, req.user?.user_id);

  return res.status(201).json({ success: true, message: result.message });
};

export const updateTrade = async (
  req: Request<TradeParamsTradeId, {}, UpdateTradeData>,
  res: Response,
) => {
  const trade_id = req.params.trade_id;

  if (!req.user?.user_id) {
    throw new AppError("Unauthorized", 401);
  }

  const data = await updateTradeService({
    trade_id,
    body: req.body,
    user_id: req.user.user_id,
  });

  return res.status(200).json(data);
};

export const deleteTrade = async (
  req: Request<TradeParamsTradeId>,
  res: Response,
) => {
  const data = await tradeDeleteService({
    trade_id: req.params.trade_id,
    user_id: req.user.user_id,
  });

  return res.status(200).json({ success: true, data: data.trade_id });
};

export const getTrades = async (
  req: Request<{}, {}, {}, GetTradeQueryData>,
  res: Response<{ success: boolean; trades_data: GetTradesResponse }>,
) => {
  const result = await getTradesService({
    query: req.query,
    user_id: req.user.user_id,
  });
  return res.status(200).json({ success: true, trades_data: result });
};

// export const getYearMonth = async (req, res) => {
//   try {
//     const data = await getYearMonthService(req.user.user_id);

//     res.status(200).json(data.rows[0]);
//   } catch (err) {
//     console.error(err);
//     if (err.statusCode) {
//       return res.status(err.statusCode).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const getStats = async (req, res) => {
//   try {
//     const data = await getStatsService(req.query, req.user.user_id);

//     res.status(200).json(data);
//   } catch (err) {
//     console.error(err);
//     if (err.statusCode) {
//       return res.status(err.statusCode).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export const getMonthlyPnl = async (req, res) => {
//   try {
//     const data = await getMonthlyPnlService(req.query, req.user.user_id);

//     res.status(200).json(data);
//   } catch (err) {
//     console.error(err);
//     if (err.statusCode) {
//       return res.status(err.statusCode).json({ message: err.message });
//     }
//     res.status(500).json({ message: "Server Error" });
//   }
// };
