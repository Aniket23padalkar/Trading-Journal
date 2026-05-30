import type { number } from "zod";
import type { UserId } from "./auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user: UserId;
    }
  }
}
