import pool from "../config/auth.js";
import {
  checkTradeOwnership,
  createTradeInDB,
  deleteTradeFromDB,
  extractYearMonthFromDB,
  getFilteredStatsFromDB,
  getMonthlyPnlFromDB,
  getTradeLogsByIdsFromDB,
  getTradesCountFromDB,
  getTradesWithPaginationFromDB,
  updateTradeInDB,
} from "../repositories/tradeRepository.js";
import buildTradeFilters from "../utils/buildTradeFilters.js";
import getOverallStats from "../utils/getOverallStats.js";

export const getTradesService = async (query, userId) => {
  const page = parseInt(query.currentPage) || 1;
  const limit = parseInt(query.limit) || 9;
  const offset = (page - 1) * limit;

  const { whereClause, values, index, orderBy } = buildTradeFilters(
    query,
    userId,
  );

  const tradesRes = await getTradesWithPaginationFromDB({
    whereClause,
    values,
    index,
    orderBy,
    limit,
    offset,
  });

  const tradeIds = tradesRes.rows.map((t) => t.trade_id);

  const logsRes = await getTradeLogsByIdsFromDB(tradeIds);

  const logsMap = Object.create(null);

  for (const log of logsRes.rows) {
    if (!logsMap[log.trade_id]) {
      logsMap[log.trade_id] = [];
    }
    logsMap[log.trade_id].push(log);
  }

  const totalRes = await getTradesCountFromDB({ whereClause, values });

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

  return {
    trades_data: result,
    pagination: {
      total,
      limit,
      page,
      totalPages,
    },
    overallStats: await getOverallStats(pool, userId),
  };
};

export const getYearMonthService = async (userId) => {
  const result = await extractYearMonthFromDB(userId);

  return result;
};

export const getStatsService = async (query, userId) => {
  const { whereClause, values } = buildTradeFilters(query, userId);

  const result = await getFilteredStatsFromDB({ whereClause, values });

  return result.rows[0];
};

export const getMonthlyPnlService = async (query, userId) => {
  const { year } = query;
  const result = await getMonthlyPnlFromDB({ year, userId });

  return result.rows;
};

export const createTradeService = async (body, userId) => {
  const {
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
  } = body;

  if (
    !symbol ||
    !order_type ||
    !status ||
    !market_type ||
    !position ||
    !rating
  ) {
    const err = new Error("Missing required fields");
    err.statusCode = 400;
    throw err;
  }

  if (!Array.isArray(executions) || executions.length === 0) {
    const err = new Error("Executions required");
    err.statusCode = 400;
    throw err;
  }

  for (const exe of executions) {
    if (exe.quantity == null || exe.risk == null || !exe.entry_time) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }
  }

  const tradeData = await createTradeInDB({
    userId,
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
  });

  return tradeData;
};

export const updateTradeService = async ({ tradeId, body, userId }) => {
  const {
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
  } = body;

  const isMatch = await checkTradeOwnership(tradeId, userId);

  if (isMatch.rows.length === 0) {
    const err = new Error("Trade not found");
    err.statusCode = 404;
    throw err;
  }

  if (!symbol || !order_type || !status || !market_type || !position) {
    const err = new Error("Missing required fields");
    err.statusCode = 400;
    throw err;
  }

  if (!Array.isArray(executions) || executions.length === 0) {
    const err = new Error("Executions Required");
    err.statusCode = 400;
    throw err;
  }

  for (const exe of executions) {
    if (exe.quantity == null || exe.risk == null || !exe.entry_time) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }
  }

  const tradeData = await updateTradeInDB({
    tradeId,
    symbol,
    order_type,
    status,
    market_type,
    position,
    rating,
    description,
    executions,
    userId,
  });

  return tradeData;
};

export const tradeDeleteService = async ({ tradeId, userId }) => {
  const deleted = await deleteTradeFromDB({ tradeId, userId });

  return deleted;
};
