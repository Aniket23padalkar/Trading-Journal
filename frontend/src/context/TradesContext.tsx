import { createContext, useEffect, useState } from "react";
import { getTradesData } from "../api/tradesService.js";
import type {
  ContextProviderProps,
  TradesContextType,
} from "../types/context.types.js";
import type {
  FilterValues,
  FilterValuesUI,
  Pagination,
  TradesData,
} from "../types/trades.types.js";
import { cleanParams } from "../utils/cleanParams.js";

export const TradeContext = createContext<TradesContextType | null>(null);

export default function TradeProvider({ children }: ContextProviderProps) {
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [trades, setTrades] = useState<TradesData[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 9,
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

  console.log(trades);

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
    limit: 9,
    ...payload,
  });

  async function fetchTrades() {
    try {
      const data = await getTradesData(params);

      setTrades(data?.trades_data);

      setPagination(data?.pagination);
    } catch (err) {
      console.log(err);
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
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        filterValues,
        setFilterValues,
        fetchTrades,
        fetchLoading,
        payload,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}
