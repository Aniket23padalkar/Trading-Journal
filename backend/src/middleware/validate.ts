import type { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";

export const validate =
  <T extends ZodType>(schema: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.parse(req.body);

    req.body = result;
    next();
  };
