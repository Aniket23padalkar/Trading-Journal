import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.controllers.js";
import { asyncHandler } from "../../utils/async.handler.js";
import { validate } from "../../middleware/validate.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../../schemas/auth.schema.js";
import {
  loginLimiter,
  registerLimiter,
} from "../../middleware/rate.limiter.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validate(registerUserSchema),
  asyncHandler(registerUser),
);
router.post(
  "/login",
  loginLimiter,
  validate(loginUserSchema),
  asyncHandler(loginUser),
);
router.get("/me", protect, asyncHandler(getUser));
router.post("/logout", protect, asyncHandler(logoutUser));

export default router;
