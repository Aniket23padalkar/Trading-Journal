import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config/env.js";
import type { MyJwtPayload } from "../types/jwt.types.js";
import { AppError } from "../utils/AppError.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("Not authorized! no token", 401);
  }

  const decoded = jwt.verify(token, config.jwtSecret);

  if (typeof decoded === "string") {
    throw new AppError("Invalid token", 401);
  }

  req.user = decoded as MyJwtPayload;
  next();
};
