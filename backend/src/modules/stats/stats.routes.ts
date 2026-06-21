import express from "express";
import {
  getFilteredStats,
  getMonthlyPnl,
  getOverallStats,
} from "./stats.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import {
  getMonthlyPnlQuerySchema,
  getTradeQuerySchema,
} from "../../schemas/trade.schema.js";

const router = express.Router();

router.get("/overallstats", protect, asyncHandler(getOverallStats));
router.get(
  "/filteredstats",
  validate(getTradeQuerySchema, "query"),
  protect,
  asyncHandler(getFilteredStats),
);
router.get(
  "/monthlypnl",
  validate(getMonthlyPnlQuerySchema, "query"),
  protect,
  asyncHandler(getMonthlyPnl),
);

export default router;
