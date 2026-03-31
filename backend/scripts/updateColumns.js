import pool from "../config/auth.js";
import updateTradeSummary from "../services/updateTradeSummary.js";

async function updateColumns() {
  const trades = await pool.query(`SELECT trade_id,status FROM trades`);

  for (const trade of trades.rows) {
    await updateTradeSummary(pool, trade.trade_id, trade.status);
  }

  console.log("updated column successfully!");
  process.exit();
}

updateColumns();
