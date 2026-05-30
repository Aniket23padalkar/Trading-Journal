import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { config } from "../config/env.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token!" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = {
      user_id: decoded.id,
      firstname: decoded.firstname,
      email_id: decoded.email_id,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Not authorized, token failed!" });
  }
};
