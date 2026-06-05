import pool from "../../config/db.js";
import {
  checkTradeOwnership,
  createTradeInDB,
  deleteTradeFromDB,
  extractYearMonthFromDB,
  getExecutionsFromDB,
  getFilteredStatsFromDB,
  getMonthlyPnlFromDB,
  getTradeFromDB,
  getTradeLogsByIdsFromDB,
  getTradesCountFromDB,
  getTradesWithPaginationFromDB,
  updateTradeInDB,
} from "./tradeRepository.js";
import buildTradeFilters from "../../utils/build.trade.filters.js";
import getOverallStats from "../../utils/getOverallStats.js";
import {
  createTradeSchema,
  type CreateTradeData,
} from "../../schemas/trade.schema.js";
import { AppError } from "../../utils/AppError.js";
import type {
  GetTradesServicesParams,
  UpdateTradeServiceParams,
} from "../../types/trade.types.js";
import {
  validateDirection,
  validateExecutionTime,
  validateOrderTypes,
  validateQuantities,
} from "./trade.validator.js";

export const createTradeService = async (
  body: CreateTradeData,
  user_id: string,
): Promise<{ message: string }> => {
  const {
    symbol,
    market_type,
    order_status,
    position,
    trade_rating,
    risk,
    direction,
    entry_time,
    exit_time,
    executions,
    description,
  } = body;

  validateDirection({ executions, direction });

  validateExecutionTime({ executions, entry_time });

  validateOrderTypes({ executions, order_status });

  validateQuantities({ executions, direction });

  await createTradeInDB({
    symbol,
    market_type,
    order_status,
    position,
    trade_rating,
    risk,
    direction,
    entry_time,
    exit_time,
    executions,
    description,
    user_id,
  });

  return { message: "Trade created successfully" };
};

export const updateTradeService = async ({
  trade_id,
  body,
  user_id,
}: UpdateTradeServiceParams) => {
  const trade = await getTradeFromDB({ trade_id, user_id });

  if (!trade) throw new AppError("Trade not found", 404);

  const executions = await getExecutionsFromDB(trade_id);

  if (!executions) {
    throw new AppError("Executions required", 400);
  }

  const description = await getTradeLogsByIdsFromDB({ user_id, trade_id });

  const existingTrade = {
    ...trade,
    description: description,
    executions,
  };

  const merged = {
    ...existingTrade,
    ...body,
  };

  const validatedTrade = createTradeSchema.parse(merged);

  validateDirection({
    executions: validatedTrade.executions,
    direction: validatedTrade.direction,
  });

  validateExecutionTime({
    executions: validatedTrade.executions,
    entry_time: validatedTrade.entry_time,
  });

  validateOrderTypes({
    executions: validatedTrade.executions,
    order_status: validatedTrade.order_status,
  });

  validateQuantities({
    executions: validatedTrade.executions,
    direction: validatedTrade.direction,
  });

  const tradeData = await updateTradeInDB({
    validatedTrade,
    trade_id,
    user_id,
  });
};

export const tradeDeleteService = async ({
  trade_id,
  user_id,
}: {
  trade_id: string;
  user_id: string;
}): Promise<{ trade_id: string }> => {
  const deleted = await deleteTradeFromDB({ trade_id, user_id });

  if (!deleted) {
    throw new AppError("Error while deleting trade", 500);
  }

  return deleted;
};

export const getTradesService = async ({
  query,
  user_id,
}: GetTradesServicesParams) => {
  const page: number = query.page || 1;
  const limit: number = query.limit || 9;
  const offset: number = (page - 1) * limit;

  const { whereClause, values, index, orderBy } = buildTradeFilters(
    query,
    user_id,
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
