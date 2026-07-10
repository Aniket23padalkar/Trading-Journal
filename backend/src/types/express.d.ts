import type { SafeUser } from "./auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user: SafeUser;
      validated?: {
        body?: any;
        params?: any;
        query?: any;
      };
    }
  }
}
