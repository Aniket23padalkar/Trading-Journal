import type { CookieOptions, Request, Response } from "express";
import { loginService, registerService } from "./authService.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, //30days
};

export const registerUser = async (req: Request, res: Response) => {
  const data = await registerService(req.body);
  res.status(201).json({ message: data.message });
};

export const loginUser = async (req: Request, res: Response) => {
  const { token, user } = await loginService(req.body);
  res.cookie("token", token, cookieOptions);
  res.status(200).json({ user });
};

export const getUser = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully!" });
};
