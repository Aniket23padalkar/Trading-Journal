import {
  createTradeInDB,
  deleteFromExecutions,
  deleteTradeFromDB,
  extractYearMonthFromDB,
  getCompleteTradeFromDB,
  getExecutionsByIdsFromDB,
  getExecutionsFromDB,
  getFilteredStatsRepo,
  getTradeFromDB,
  getTradeLogsByIdFromDB,
  getTradeLogsFromDB,
  getTradesCountFromDB,
  getTradeStatsFromDB,
  getTradesWithPaginationFromDB,
  insertIntoExecutionsDynamicValues,
  insertIntoTradeLogsInDB,
  updateExecutionsFromDB,
  updateTradeInDB,
  updateTradeLogsInDB,
} from "./tradeRepository.js";
import buildTradeFilters from "../../utils/build.trade.filters.js";
import {
  createTradeSchema,
  type CreateTradeData,
} from "../../schemas/trade.schema.js";
import { AppError } from "../../utils/AppError.js";
import type {
  ExecutionsRow,
  GetTradesResponse,
  GetTradesServicesParams,
  GetYearAndMonthType,
  TradesDataType,
  UpdateExecutionsData,
  UpdateTradeServiceParams,
} from "../../types/trade.types.js";
import {
  validateDirection,
  validateExecutionTime,
  validateOpenClose,
  validateOrderTypes,
  validateQuantities,
} from "./trade.validator.js";
import { safeMerge } from "../../utils/merge.utils.js";
import { removeUndefined } from "../../utils/removeundefined.utils.js";
import pool from "../../config/db.js";
import { groupBy, mapBy } from "../../utils/array.utils.js";
import calculateStats from "../../utils/calculateStats.js";
import type { GetFilteredStatsData } from "../../types/stats.types.js";

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

  validateOpenClose({ executions, order_status });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { pnl } = calculateStats({ executions, order_status });

    const trade_id = await createTradeInDB({
      user_id,
      symbol,
      order_status,
      market_type,
      position,
      trade_rating,
      risk,
      direction,
      entry_time,
      exit_time,
      client,
      pnl,
    });

    if (trade_id === undefined) {
      throw new AppError("Error while creating a trade", 500);
    }

    await insertIntoTradeLogsInDB({ client, trade_id, user_id, description });

    const values: string[] = [];
    const rows: ExecutionsRow[] = [];
    const params = rows.flat();

    executions.forEach((exe, i) => {
      const base = i * 5;

      values.push(
        `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`,
      );

      params.push(
        trade_id,
        exe.order_type,
        exe.price,
        exe.quantity,
        exe.executed_at,
      );
    });

    await insertIntoExecutionsDynamicValues(client, values, params);

    await client.query("COMMIT");
    return { message: "Trade created successfully" };
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    console.error("Create trade Error", err);
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Failed to create trade", 500);
  } finally {
    client.release();
  }
};

export const updateTradeService = async ({
  trade_id,
  body,
  user_id,
}: UpdateTradeServiceParams): Promise<TradesDataType> => {
  const trade = await getTradeFromDB({ trade_id, user_id });

  if (!trade) throw new AppError("Trade not found", 404);

  const executions = await getExecutionsFromDB({ db: pool, trade_id });

  const description = await getTradeLogsFromDB({ user_id, trade_id });

  const existingTrade = {
    ...trade,
    description,
    executions,
  };

  const cleanedBody = removeUndefined(body);

  const updatedTrade = safeMerge(existingTrade, cleanedBody);

  const validatedTrade = createTradeSchema.parse(updatedTrade);

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

  validateOpenClose({
    executions: validatedTrade.executions,
    order_status: validatedTrade.order_status,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { pnl } = calculateStats({
      executions: validatedTrade.executions,
      order_status: validatedTrade.order_status,
    });

    await updateTradeInDB({ validatedTrade, trade_id, user_id, client, pnl });

    await updateTradeLogsInDB({
      client,
      trade_id,
      user_id,
      description: validatedTrade.description,
    });

    const existingExecutions = await getExecutionsFromDB({
      db: client,
      trade_id,
    });

    const existingIds: string[] = existingExecutions.map((r) => r.execution_id);

    const incoming: UpdateExecutionsData[] = validatedTrade.executions || [];

    const incomingIds = incoming
      .filter((e) => e.execution_id)
      .map((e) => e.execution_id);

    const toDelete: string[] = existingIds.filter(
      (eId) => !incomingIds.includes(eId),
    );

    if (toDelete.length > 0) {
      await deleteFromExecutions(client, toDelete);
    }

    const updates: UpdateExecutionsData[] = incoming?.filter(
      (e) => e.execution_id,
    );
    const inserts: UpdateExecutionsData[] = incoming.filter(
      (e) => !e.execution_id,
    );

    await Promise.all(
      updates.map((exe) => updateExecutionsFromDB(client, exe, trade_id)),
    );

    if (inserts.length) {
      const values: string[] = [];
      const rows: ExecutionsRow[] = [];
      const params = rows.flat();

      inserts.forEach((exe, i) => {
        const base: number = i * 5;

        values.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`,
        );

        params.push(
          trade_id,
          exe.order_type,
          exe.price,
          exe.quantity,
          exe.executed_at,
        );
      });

      await insertIntoExecutionsDynamicValues(client, values, params);
    }

    await client.query("COMMIT");

    const updatedTrade_raw = await getCompleteTradeFromDB(trade_id, user_id);

    if (!updatedTrade_raw) {
      throw new AppError("Trade not found", 404);
    }

    const updatedTrade: TradesDataType = {
      trade: {
        trade_id: updatedTrade_raw.trade_id,
        symbol: updatedTrade_raw.symbol,
        order_status: updatedTrade_raw.order_status,
        market_type: updatedTrade_raw.market_type,
        position: updatedTrade_raw.position,
        direction: updatedTrade_raw.direction,
        risk: Number(updatedTrade_raw.risk),
        trade_rating: updatedTrade_raw.trade_rating,
        entry_time: new Date(updatedTrade_raw.entry_time),
        exit_time: new Date(updatedTrade_raw.exit_time),
        pnl: Number(updatedTrade_raw.pnl) || null,
        created_at: new Date(updatedTrade_raw.created_at),
        updated_at: new Date(updatedTrade_raw.updated_at),
      },
      executions: updatedTrade_raw.executions,
      trade_logs: updatedTrade_raw.trade_logs,
      stats: {
        avg_buy_price: Number(updatedTrade_raw.avg_buy_price),
        avg_sell_price: Number(updatedTrade_raw.avg_sell_price),
        total_buy_qty: Number(updatedTrade_raw.total_buy_qty),
        total_sell_qty: Number(updatedTrade_raw.total_sell_qty),
        total_qty: Number(updatedTrade_raw.total_qty),
        rr_ratio: Number(updatedTrade_raw.rr_ratio),
      },
    };

    return updatedTrade;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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

  const logsMap = groupBy(logsRes, "trade_id");

  const tradeLogs = await getTradeLogsByIdFromDB(tradeIds, user_id);

  if (!tradeLogs) {
    throw new AppError("Trade logs not found", 404);
  }

  const tradeLogsMap = mapBy(tradeLogs, "trade_id");

  const statsRes = await getTradeStatsFromDB(user_id, tradeIds);

  if (!statsRes) {
    throw new AppError("Error while getting stats", 500);
  }

  const statsMap = mapBy(statsRes, "trade_id");

  const totalRes = await getTradesCountFromDB({ whereClause, values });

  if (!totalRes) {
    throw new AppError("Trade count not found", 404);
  }

  const total: number = totalRes.count;

  const totalPages: number = Math.ceil(total / limit);

  const filteredStatsRaw = await getFilteredStatsRepo({ whereClause, values });

  if (!filteredStatsRaw || filteredStatsRaw === undefined) {
    throw new AppError("Error while fetching filtered stats", 500);
  }

  const filtered_stats: GetFilteredStatsData = {
    trades_count: Number(filteredStatsRaw.trades_count),
    win_rate: Number(filteredStatsRaw.win_rate),
    total_pnl: Number(filteredStatsRaw.total_pnl),
    total_rr: Number(filteredStatsRaw.total_rr),
  };

  const trades_data: TradesDataType[] = tradesRes.map((trade) => {
    const executions_raw = logsMap[trade.trade_id] || [];
    const trade_logs_raw = tradeLogsMap[trade.trade_id] || null;
    const stats_raw = statsMap[trade.trade_id] || null;

    const executions = executions_raw.map((item) => {
      return {
        execution_id: item.execution_id,
        order_type: item.order_type,
        price: Number(item.price),
        quantity: Number(item.quantity),
        executed_at: new Date(item.executed_at),
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      };
    });

    const trade_logs = trade_logs_raw
      ? {
          trade_logs_id: trade_logs_raw?.trade_logs_id,
          description: trade_logs_raw?.description,
          created_at: new Date(trade_logs_raw.created_at),
          updated_at: new Date(trade_logs_raw.updated_at),
        }
      : null;

    const stats = {
      avg_buy_price: Number(stats_raw?.avg_buy_price),
      avg_sell_price: Number(stats_raw?.avg_sell_price),
      total_buy_qty: Number(stats_raw?.total_buy_qty),
      total_sell_qty: Number(stats_raw?.total_sell_qty),
      total_qty: Number(stats_raw?.total_qty),
      rr_ratio: Number(stats_raw?.rr_ratio),
    };

    return {
      trade: {
        trade_id: trade.trade_id,
        symbol: trade.symbol,
        order_status: trade.order_status,
        market_type: trade.market_type,
        position: trade.position,
        direction: trade.direction,
        risk: Number(trade.risk),
        trade_rating: trade.trade_rating,
        entry_time: new Date(trade.entry_time),
        exit_time: trade.exit_time ? new Date(trade.exit_time) : null,
        pnl: Number(trade.pnl) || null,
        created_at: new Date(trade.created_at),
        updated_at: new Date(trade.updated_at),
      },
      executions,
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
    filtered_stats,
  };
};

export const getYearMonthService = async (user_id: string) => {
  const result = await extractYearMonthFromDB(user_id);

  if (!result || result.length === 0) {
    throw new AppError("Error fetching year months", 500);
  }

  const yearMonths: GetYearAndMonthType[] = result.map((item) => {
    return {
      year: Number(item.year),
      months: item.months,
    };
  });

  return yearMonths;
};
