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
    order_type: "",
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

  const payload: FilterValues = {
    order_type: filterValues.order_type,
    order_status: filterValues.order_status,
    market_type: filterValues.market_type,
    position: filterValues.position,
    fromDate: new Date(filterValues.fromDate),
    toDate: new Date(filterValues.toDate),
    year: Number(filterValues.year),
    month: Number(filterValues.month),
    pnlSort: filterValues.pnlSort,
    dateTimeSort: filterValues.dateTimeSort,
  };

  const params = cleanParams({
    page: currentPage,
    limit: 9,
    ...payload,
  });

  console.log(trades);

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
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}
