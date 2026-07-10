import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError, z } from "zod";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = 500;
  let message: string = "Internal server error";
  let errors: unknown = undefined;

  console.error(err);

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = z.flattenError(err);
  } else if (typeof err === "object" && err !== null) {
    const e = err as any;

    if (e.code === "23505") {
      statusCode = 409;
      message = "Email already exists";
    } else if (e.code === "23503") {
      statusCode = 400;
      message = "Invalid reference";
    } else if (err instanceof Error) {
      message = err.message;
    }
  } else if (typeof err === "string") {
    message = err;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV === "development" && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};
