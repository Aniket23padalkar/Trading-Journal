import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  createTrade,
  deleteTrade,
  getMonthlyPnl,
  getStats,
  getTrades,
  getYearMonth,
  updateTrade,
} from "./tradesControllers.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import { createTradeSchema } from "../../schemas/trade.schema.js";

const router = express.Router();

router.post(
  "/",
  validate(createTradeSchema),
  protect,
  asyncHandler(createTrade),
);
router.patch("/:id", protect, asyncHandler(updateTrade));
router.delete("/:id", protect, asyncHandler(deleteTrade));
router.get("/", protect, getTrades);
router.get("/yearmonth", protect, getYearMonth);
router.get("/stats", protect, getStats);
router.get("/monthly-pnl", protect, getMonthlyPnl);

export default router;
