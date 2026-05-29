import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "./authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUser);
router.post("/logout", protect, logoutUser);

export default router;
