import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createTrade,
  deleteTrade,
  getMonthlyPnl,
  getStats,
  getTrades,
  getYearMonth,
  updateTrade,
} from "../controllers/tradesControllers.js";

const router = express.Router();

router.get("/", protect, getTrades);
router.get("/yearmonth", protect, getYearMonth);
router.get("/stats", protect, getStats);
router.get("/monthly-pnl", protect, getMonthlyPnl);
router.post("/", protect, createTrade);
router.patch("/:id", protect, updateTrade);
router.delete("/:id", protect, deleteTrade);

export default router;
