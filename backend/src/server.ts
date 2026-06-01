import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.js";
import tradeRoutes from "./modules/trades/trades.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { globalLimiter } from "./middleware/rate.limiter.js";
import { corsMiddleware } from "./middleware/cors.middleware.js";

dotenv.config();

const app = express();

app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser());

app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
