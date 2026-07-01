import { createContext, useEffect, useState } from "react";
import { getTradesData } from "../api/tradesService.js";
import type {
  ContextProviderProps,
  TradesContextType,
} from "../types/context.types.js";
import type {
  FilterValues,
  FilterValuesUI,
  OverallStatsData,
  Pagination,
  TradesData,
} from "../types/trades.types.js";
import { cleanParams } from "../utils/cleanParams.js";
import type { GetFilteredStatsData } from "../types/stats.types.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { getErrorMessage } from "../utils/error.handler.js";

export const TradeContext = createContext<TradesContextType | null>(null);

export default function TradeProvider({ children }: ContextProviderProps) {
  const { user, authLoading } = useAuthContext();

  const [overallStats, setOverallStats] = useState<OverallStatsData | null>(
    null,
  );

  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [trades, setTrades] = useState<TradesData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterValues, setFilterValues] = useState<FilterValuesUI>({
    direction: "",
    order_status: "",
    market_type: "",
    position: "",
    fromDate: "",
    toDate: "",
    year: "",
    month: "",
    pnlSort: "",
    dateTimeSort: "",
  });
  const [filteredStats, setFilteredStats] =
    useState<GetFilteredStatsData | null>(null);

  const payload: FilterValues = {
    direction: filterValues.direction || null,
    order_status: filterValues.order_status || null,
    market_type: filterValues.market_type || null,
    position: filterValues.position || null,
    fromDate: filterValues.fromDate ? filterValues.fromDate : null,
    toDate: filterValues.toDate === "" ? null : filterValues.toDate,
    year: filterValues.year === "" ? null : Number(filterValues.year),
    month: filterValues.month || null,
    pnlSort: filterValues.pnlSort || null,
    dateTimeSort: filterValues.dateTimeSort || null,
  };

  const params = cleanParams({
    page: currentPage,
    limit: 15,
    ...payload,
  });

  async function fetchTrades() {
    setFetchLoading(true);
    try {
      const result = await getTradesData(params);

      setOverallStats(result?.overall_stats);
      setTrades(result?.trades_data);
      setPagination(result?.pagination);
      setFilteredStats(result?.filtered_stats);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.log(message);
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    fetchTrades();
  }, [currentPage, filterValues]);

  return (
    <TradeContext.Provider
      value={{
        trades,
        setTrades,
        overallStats,
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        filterValues,
        setFilterValues,
        fetchTrades,
        fetchLoading,
        filteredStats,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}
