import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config/env.js";
import type { MyJwtPayload } from "../types/jwt.types.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/async.handler.js";
import pool from "../config/db.js";
import type { SafeUser } from "../types/auth.types.js";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token || typeof token !== "string") {
      throw new AppError("Not authorized! no token", 401);
    }

    let decoded: MyJwtPayload;

    try {
      const verified = jwt.verify(token, config.jwtSecret);

      if (typeof verified !== "object" || !("user_id" in verified)) {
        throw new AppError("Invalid token payload", 401);
      }

      decoded = verified as MyJwtPayload;
    } catch (err) {
      throw new AppError("Invalid or expired token", 401);
    }

    const result = await pool.query<SafeUser>(
      `
        SELECT 
          user_id,
          first_name,
          last_name,
          email,
          role,
          created_at
        FROM users
        WHERE user_id = $1
      `,
      [decoded.user_id],
    );

    const userData = result.rows[0];

    if (!userData) {
      throw new AppError("User not found", 404);
    }
    req.user = userData;
    return next();
  },
);
