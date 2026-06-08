import {
  createTradeInDB,
  deleteTradeFromDB,
  getExecutionsByIdsFromDB,
  getExecutionsFromDB,
  getTradeFromDB,
  getTradeLogsByIdFromDB,
  getTradeLogsFromDB,
  getTradesCountFromDB,
  getTradeStatsFromDB,
  getTradesWithPaginationFromDB,
  updateTradeInDB,
} from "./tradeRepository.js";
import buildTradeFilters from "../../utils/build.trade.filters.js";
import {
  createTradeSchema,
  type CreateTradeData,
} from "../../schemas/trade.schema.js";
import { AppError } from "../../utils/AppError.js";
import type {
  GetTradesResponse,
  GetTradesServicesParams,
  TradesDataType,
  UpdateTradeServiceParams,
} from "../../types/trade.types.js";
import {
  validateDirection,
  validateExecutionTime,
  validateOrderTypes,
  validateQuantities,
} from "./trade.validator.js";
import { safeMerge } from "../../utils/merge.utils.js";
import { removeUndefined } from "../../utils/removeundefined.utils.js";

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
}: UpdateTradeServiceParams): Promise<TradesDataType> => {
  const trade = await getTradeFromDB({ trade_id, user_id });

  if (!trade) throw new AppError("Trade not found", 404);

  const executions = await getExecutionsFromDB(trade_id);

  const description = await getTradeLogsFromDB({ user_id, trade_id });

  const existingTrade = {
    ...trade,
    description,
    executions,
  };

  const cleanedBody = removeUndefined(body);

  const updatedTrade = safeMerge(existingTrade, cleanedBody);

  const merged = {
    ...existingTrade,
    ...updatedTrade,
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

  return tradeData;
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
}: GetTradesServicesParams): Promise<GetTradesResponse> => {
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

  if (!tradesRes) {
    throw new AppError("Trade not found", 404);
  }

  const tradeIds = tradesRes?.map((t) => t.trade_id) ?? [];

  const logsRes = await getExecutionsByIdsFromDB(tradeIds);

  if (!logsRes) {
    throw new AppError("Executions not found", 404);
  }

  type ExecutionObj = (typeof logsRes)[number];

  const logsMap = logsRes.reduce<Record<string, ExecutionObj[]>>((acc, exe) => {
    const tradeId: string = exe.trade_id;

    if (!acc[tradeId]) {
      acc[tradeId] = [];
    }

    acc[tradeId].push(exe);

    return acc;
  }, Object.create(null));

  const tradeLogs = await getTradeLogsByIdFromDB(tradeIds, user_id);

  if (!tradeLogs) {
    throw new AppError("Trade logs not found", 404);
  }

  type TradeLogObj = (typeof tradeLogs)[number];

  const tradeLogsMap = tradeLogs.reduce<Record<string, TradeLogObj>>(
    (acc, log) => {
      const logId: string = log.trade_id;

      acc[logId] = log;

      return acc;
    },
    Object.create(null),
  );

  const statsRes = await getTradeStatsFromDB(user_id, tradeIds);

  if (!statsRes) {
    throw new AppError("Error while getting stats", 500);
  }

  type StatsMapObj = (typeof statsRes)[number];

  const statsMap = statsRes.reduce<Record<string, StatsMapObj>>((acc, stat) => {
    const tradeId: string = stat.trade_id;

    acc[tradeId] = stat;

    return acc;
  }, Object.create(null));

  const totalRes = await getTradesCountFromDB({ whereClause, values });

  if (!totalRes) {
    throw new AppError("Trade count not found", 404);
  }

  const total: number = totalRes.count;

  const totalPages: number = Math.ceil(total / limit);

  const trades_data: TradesDataType[] = tradesRes.map((trade) => {
    const executions = logsMap[trade.trade_id] || [];
    const trade_logs_raw = tradeLogsMap[trade.trade_id] || null;
    const stats_raw = statsMap[trade.trade_id] || null;

    const trade_logs = trade_logs_raw
      ? (function ({ trade_id, user_id, ...rest }) {
          return rest;
        })(trade_logs_raw)
      : null; //IIFE Immediate Invoke Function

    // const trade_logs = trade_logs_raw
    //   ? (({ trade_id, user_id, ...rest }) => rest)(trade_logs_raw)
    //   : null;

    const stats = stats_raw
      ? (({ trade_id, ...rest }) => rest)(stats_raw)
      : null; // This is mordern IIFE with arrow fucntion

    return {
      trade: {
        trade_id: trade.trade_id,
        symbol: trade.symbol,
        order_status: trade.order_status,
        market_type: trade.market_type,
        position: trade.position,
        direction: trade.direction,
        risk: trade.risk,
        trade_rating: trade.trade_rating,
        entry_time: trade.entry_time,
        exit_time: trade.exit_time,
        created_at: trade.created_at,
        updated_at: trade.updated_at,
      },
      executions: executions.map(({ trade_id, ...rest }) => rest),
      trade_logs,
      stats,
    };
  });

  return {
    trades_data,
    pagination: {
      total,
      limit,
      page,
      totalPages,
    },
  };
};

// export const getYearMonthService = async (userId) => {
//   const result = await extractYearMonthFromDB(userId);

//   return result;
// };

// export const getStatsService = async (query, userId) => {
//   const { whereClause, values } = buildTradeFilters(query, userId);

//   const result = await getFilteredStatsFromDB({ whereClause, values });

//   return result.rows[0];
// };

// export const getMonthlyPnlService = async (query, userId) => {
//   const { year } = query;
//   const result = await getMonthlyPnlFromDB({ year, userId });

//   return result.rows;
// };
