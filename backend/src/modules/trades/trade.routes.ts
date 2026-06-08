import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  createTrade,
  deleteTrade,
  getTrades,
  updateTrade,
} from "./tradeControllers.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createTradeSchema,
  getTradeQuerySchema,
  tradeParamsSchema,
  updateTradeSchema,
} from "../../schemas/trade.schema.js";

const router = express.Router();

router.post(
  "/",
  validate(createTradeSchema),
  protect,
  asyncHandler(createTrade),
);
router.patch(
  "/:trade_id",
  validate(tradeParamsSchema, "params"),
  validate(updateTradeSchema, "body"),
  protect,
  asyncHandler(updateTrade),
);
router.delete(
  "/:trade_id",
  validate(tradeParamsSchema, "params"),
  protect,
  asyncHandler(deleteTrade),
);
router.get(
  "/",
  validate(getTradeQuerySchema, "query"),
  protect,
  asyncHandler(getTrades),
);
// router.get("/yearmonth", protect, getYearMonth);
// router.get("/stats", protect, getStats);
// router.get("/monthly-pnl", protect, getMonthlyPnl);

export default router;
