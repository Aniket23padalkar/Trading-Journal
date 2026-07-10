import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import tradeRoutes from "./modules/trades/trade.routes.js";
import statsRoutes from "../src/modules/stats/stats.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/rate.limiter.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any)._start = process.hrtime.bigint();
  next();
});

app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser());

app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/stats", statsRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    const client = await pool.connect();
    const db = await client.query("SELECT current_database()");
    console.log("connected to database", db.rows[0]);
    client.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database on startup", err);
    process.exit(1);
  }
};

startServer();
