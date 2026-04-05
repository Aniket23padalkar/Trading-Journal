import express from "express";
import pool from "../config/auth.js";
import { protect } from "../middleware/auth.js";
import getTradeByID from "../services/getTradeByID.js";
import updateTradeSummary from "../services/updateTradeSummary.js";
import getOverallStats from "../services/getOverallStats.js";
import buildTradeFilters from "../services/buildTradeFilters.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const page = parseInt(req.query.currentPage) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const offset = (page - 1) * limit;

  const { whereClause, values, index, orderBy } = buildTradeFilters(
    req.query,
    req.user.user_id,
  );

  const tradesQuery = `
    SELECT t.*, l.first_entry
    FROM trades t
    JOIN (
      SELECT trade_id, MIN(entry_time) AS first_entry
      FROM trade_logs
      GROUP BY trade_id
    ) l ON t.trade_id = l.trade_id
    WHERE ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${index} OFFSET $${index + 1}
  `;

  const tradesRes = await pool.query(tradesQuery, [...values, limit, offset]);

  const tradeIds = tradesRes.rows.map((t) => t.trade_id);

  const logsRes = await pool.query(
    `
    SELECT *
    FROM trade_logs
    WHERE trade_id = ANY($1::uuid[])
    ORDER BY entry_time ASC
    `,
    [tradeIds],
  );

  const logsMap = {};

  for (const log of logsRes.rows) {
    if (!logsMap[log.trade_id]) {
      logsMap[log.trade_id] = [];
    }
    logsMap[log.trade_id].push(log);
  }

  const countQuery = `
  SELECT COUNT(*) 
  FROM trades t
  JOIN(
    SELECT trade_id, MIN(entry_time) AS first_entry
    FROM trade_logs
    GROUP BY trade_id
  ) l ON t.trade_id = l.trade_id
  WHERE ${whereClause}`;

  const totalRes = await pool.query(countQuery, values);

  const total = Number(totalRes.rows[0].count);

  const totalPages = Math.ceil(total / limit);

  const result = tradesRes.rows.map((trade) => {
    const executions = logsMap[trade.trade_id] || [];

    return {
      trade: {
        trade_id: trade.trade_id,
        symbol: trade.symbol,
        status: trade.status,
        order_type: trade.order_type,
        market_type: trade.market_type,
        position: trade.position,
        rating: trade.rating,
        description: trade.description,
        created_at: trade.created_at,
        updated_at: trade.updated_at,
      },
      executions,
      stats: {
        pnl: trade.pnl,
        avg_buy_price: trade.avg_buy_price,
        avg_sell_price: trade.avg_sell_price,
        avg_risk: trade.avg_risk,
        avg_rr: trade.avg_rr,
        total_qty: trade.total_qty,
      },
    };
  });

  res.status(200).json({
    trades_data: result,
    pagination: {
      total,
      limit,
      page,
      totalPages,
    },
    overallStats: await getOverallStats(pool, req.user.user_id),
  });
});

router.get("/yearmonth", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `
      WITH first_logs AS (
        SELECT trade_id, MIN(entry_time) AS first_entry
        FROM trade_logs
        GROUP BY trade_id
      )
      SELECT
        ARRAY_AGG(DISTINCT EXTRACT(YEAR FROM first_entry)) AS years,
        ARRAY_AGG(DISTINCT EXTRACT(MONTH FROM first_entry)) AS months
      FROM first_logs fl
      JOIN trades t ON t.trade_id = fl.trade_id
      WHERE t.user_id = $1
      `,
      [req.user.user_id],
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
});

router.get("/stats", protect, async (req, res) => {
  const { whereClause, values } = buildTradeFilters(
    req.query,
    req.user.user_id,
  );
  try {
    const result = await pool.query(
      `
      WITH first_logs AS (
        SELECT trade_id, MIN(entry_time) AS first_entry
        FROM trade_logs
        GROUP BY trade_id
      )
      SELECT
        COALESCE(COUNT(t.trade_id),0) AS trades_count,
        COALESCE(SUM(t.pnl) FILTER(WHERE t.status = 'Closed'),0) AS trades_pnl,
        COALESCE(SUM(t.avg_rr) FILTER(WHERE t.status = 'Closed'),0) AS trade_rr,
        COALESCE(
          CAST(
            (COUNT(*) FILTER(WHERE t.pnl > 0 AND t.status = 'Closed') * 100.0)
            / NULLIF(COUNT(*) FILTER(WHERE t.status = 'Closed'),0)
          AS NUMERIC(5,2)) 
        ,0) AS trades_win_rate
      FROM trades t
      JOIN first_logs l ON t.trade_id = l.trade_id
      WHERE ${whereClause}
      `,
      values,
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("FULL ERROR:", err.message);
    console.error("QUERY:", whereClause);
    console.error("VALUES:", values);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/monthly-pnl", protect, async (req, res) => {
  const { year } = req.query;
  try {
    const result = await pool.query(
      `
      WITH first_logs AS (
        SELECT trade_id, MIN(entry_time) AS first_entry
        FROM trade_logs
        GROUP BY trade_id
      )
      SELECT 
        EXTRACT(MONTH FROM fl.first_entry) AS month,
        SUM(t.pnl) AS total_pnl
      FROM first_logs fl
      JOIN trades t ON t.trade_id = fl.trade_id
      WHERE t.user_id = $1
        AND EXTRACT(YEAR FROM fl.first_entry) = $2
        AND t.status = 'Closed'
      GROUP BY month
      ORDER BY month
      `,
      [req.user.user_id, year],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Monthly pnl not found!" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Server Error" });
  }
});

router.post("/", protect, async (req, res) => {
  const {
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
  } = req.body;

  if (
    !symbol ||
    !order_type ||
    !status ||
    !market_type ||
    !position ||
    !rating
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields!" });
  }

  if (!Array.isArray(executions) || executions.length === 0) {
    return res.status(400).json({ message: "Executions required!" });
  }

  for (const exe of executions) {
    if (exe.quantity == null || exe.risk == null || !exe.entry_time) {
      return res.status(400).json({ message: "Invalid execution data!" });
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const newTrade = await client.query(
      "INSERT INTO trades(user_id,symbol,status,order_type,position,market_type,rating,description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [
        req.user.user_id,
        symbol,
        status,
        order_type,
        position,
        market_type,
        rating,
        description,
      ],
    );

    const tradeId = newTrade.rows[0].trade_id;

    for (const exe of executions) {
      await client.query(
        "INSERT INTO trade_logs(trade_id,buy_price,sell_price,quantity,risk,entry_time,exit_time) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [
          tradeId,
          exe.buy_price || 0,
          exe.sell_price || 0,
          exe.quantity,
          exe.risk,
          exe.entry_time,
          exe.exit_time || null,
        ],
      );
    }

    await updateTradeSummary(client, tradeId, status);

    const tradeData = await getTradeByID(client, tradeId, req.user.user_id);
    console.log(tradeData);

    await client.query("COMMIT");
    res.status(201).json(tradeData);
  } catch (err) {
    await client.query("ROLLBACK");
    console.log(err);
    res.status(500).json({ message: "Server error!" });
  } finally {
    client.release();
  }
});

router.patch("/:id", protect, async (req, res) => {
  const { id } = req.params;
  const {
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
  } = req.body;

  const isMatch = await pool.query(
    `SELECT * FROM trades WHERE trade_id = $1 AND user_id = $2`,
    [id, req.user.user_id],
  );

  if (isMatch.rows.length === 0) {
    return res.status(404).json({ message: "Trade not found!" });
  }

  if (!symbol || !order_type || !status || !market_type || !position) {
    return res
      .status(400)
      .json({ message: "Please Provide all the required fields" });
  }

  if (!Array.isArray(executions) || executions.length === 0) {
    return res.status(400).json({ message: "Executions required" });
  }

  for (const exe of executions) {
    if (exe.quantity == null || exe.risk == null || !exe.entry_time) {
      return res.status(400).json({ message: "Invalid Executions data" });
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE trades
        SET
          symbol=$1,
          order_type=$2,
          status=$3,
          market_type=$4,
          position=$5,
          rating=$6,
          description=$7,
          updated_at=NOW()
        WHERE
          trade_id=$8 AND user_id=$9
        RETURNING *
        `,
      [
        symbol,
        order_type,
        status,
        market_type,
        position,
        rating,
        description,
        id,
        req.user.user_id,
      ],
    );

    const existingLogs = await client.query(
      `SELECT trade_logs_id FROM trade_logs WHERE trade_id=$1`,
      [id],
    );

    const existingIds = existingLogs.rows.map((r) => r.trade_logs_id);
    const incomingIds = executions
      .filter((e) => e.trade_logs_id)
      .map((e) => e.trade_logs_id);

    const toDelete = existingIds.filter((eId) => !incomingIds.includes(eId));

    if (toDelete.length > 0) {
      for (const eId of toDelete) {
        await client.query(`DELETE FROM trade_logs WHERE trade_logs_id = $1`, [
          eId,
        ]);
      }
    }

    for (const exe of executions) {
      if (exe.trade_logs_id) {
        await client.query(
          `
        UPDATE trade_logs
        SET
          buy_price=$1,
          sell_price=$2,
          quantity=$3,
          risk=$4,
          entry_time=$5,
          exit_time=$6
        WHERE 
          trade_logs_id=$7 AND trade_id=$8
        RETURNING *
        `,
          [
            exe.buy_price,
            exe.sell_price,
            exe.quantity,
            exe.risk,
            exe.entry_time,
            exe.exit_time,
            exe.trade_logs_id,
            id,
          ],
        );
      } else {
        await client.query(
          `
          INSERT INTO trade_logs
          (
            trade_id,
            buy_price,
            sell_price,
            quantity,
            risk,
            entry_time,
            exit_time
          )
          VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
          `,
          [
            id,
            exe.buy_price,
            exe.sell_price,
            exe.quantity,
            exe.risk,
            exe.entry_time,
            exe.exit_time,
          ],
        );
      }
    }

    await updateTradeSummary(client, id, status);

    const tradeData = await getTradeByID(client, id, req.user.user_id);

    await client.query("COMMIT");
    res.status(200).json(tradeData);
  } catch (err) {
    console.log(err);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Server Error" });
  } finally {
    client.release();
  }
});

router.delete("/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await pool.query(
      "DELETE FROM trades WHERE trade_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.user_id],
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ message: "Trade not found!" });
    }

    res.status(200).json({ message: "Trade successfully deleted!" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server error" });
  }
});

export default router;
