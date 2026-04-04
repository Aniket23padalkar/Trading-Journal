import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import tradeRoutes from "./routes/trades.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://tradelens-nu.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${req.statusCode} ${duration}ms`);
  });

  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log(process.env.DB_URL);
