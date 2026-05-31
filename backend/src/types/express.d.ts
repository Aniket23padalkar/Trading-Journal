import type { SafeUser } from "./auth.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
