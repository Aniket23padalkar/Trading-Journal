import express from "express";
import { getMonthlyPnl } from "./stats.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import { getMonthlyPnlQuerySchema } from "../../schemas/trade.schema.js";

const router = express.Router();

router.get(
  "/monthlypnl",
  validate(getMonthlyPnlQuerySchema, "query"),
  protect,
  asyncHandler(getMonthlyPnl),
);

export default router;
