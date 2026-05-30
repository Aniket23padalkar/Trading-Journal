import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL_DEV,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", async (client) => {
  const db = await client.query("SELECT current_database()");
  console.log("Connected to database", db.rows[0]);
});

pool.on("error", (err) => {
  console.log("Database error", err);
});

export default pool;
