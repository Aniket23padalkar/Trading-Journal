import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("Connected to database");
});

pool.on("error", () => {
  console.log("Database error", err);
});

export default pool;
