import type { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";
import { AppError } from "../utils/AppError.js";

export const validate =
  <T extends ZodType>(schema: T) =>
  (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        "Validation failed",
        400,
        z.flattenError(result.error),
      );
    }

    req.body = result.data;
    next();
  };
