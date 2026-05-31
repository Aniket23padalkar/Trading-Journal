import type { CookieOptions, Request, Response } from "express";
import { loginService, registerService } from "./auth.service.js";
import type { loginData, registerData } from "../../schemas/auth.schema.js";
import { AppError } from "../../utils/AppError.js";
import type { SafeUser } from "../../types/auth.types.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, //30days
};

export const registerUser = async (
  req: Request<{}, {}, registerData>,
  res: Response<{ success: boolean; message: string }>,
) => {
  const data = await registerService(req.body);
  return res.status(201).json({ success: true, message: data.message });
};

export const loginUser = async (
  req: Request<{}, {}, loginData>,
  res: Response<{ success: boolean; data: SafeUser }>,
) => {
  const { token, user } = await loginService(req.body);
  res.cookie("token", token, cookieOptions);
  return res.status(200).json({ success: true, data: user });
};

export const getUser = async (
  req: Request,
  res: Response<{ success: boolean; data: SafeUser }>,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  return res.status(200).json({ success: true, data: req.user });
};

export const logoutUser = async (
  req: Request,
  res: Response<{ success: boolean; message: string }>,
) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully!" });
};
