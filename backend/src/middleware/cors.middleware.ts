import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://tradelens-nu.vercel.app",
];

export const corsMiddleware = cors({
  origin: (origin: string | undefined, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Cors Blocked"));
    }
  },
  credentials: true,
});
