import type { NextFunction, Request, Response } from "express";
import { z, type ZodObject } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: z.treeifyError(result.error) });
    }

    req.body = result.data;
    next();
  };
