import express from "express";
import { getFilteredStats, getOverallStats } from "./stats.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import { getTradeQuerySchema } from "../../schemas/trade.schema.js";

const router = express.Router();

router.get("/overallstats", protect, asyncHandler(getOverallStats));
router.get(
  "/filteredstats",
  validate(getTradeQuerySchema, "query"),
  protect,
  asyncHandler(getFilteredStats),
);

export default router;
