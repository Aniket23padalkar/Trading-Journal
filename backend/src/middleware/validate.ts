import type { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";

export const validate =
  <T extends ZodType>(schema: T, type: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[type];
    const result = schema.parse(data);

    req.validated = {
      ...(req.validated || {}),
      [type]: result,
    };

    next();
  };
