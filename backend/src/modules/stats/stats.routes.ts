import express from "express";
import { GetOverallStats } from "./stats.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/async.handler.js";

const router = express.Router();

router.get("/overallstats", protect, asyncHandler(GetOverallStats));

export default router;
