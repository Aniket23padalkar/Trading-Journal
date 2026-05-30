import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./authControllers.js";
import { asyncHandler } from "../../utils/async.handler.js";

const router = express.Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/me", protect, asyncHandler(getUser));
router.post("/logout", protect, asyncHandler(logoutUser));

export default router;
