import { createContext, useEffect, useState } from "react";
import { getTradesData } from "../api/tradesService.js";
import type {
  ContextProviderProps,
  TradesContextType,
} from "../types/context.types.js";
import type {
  FilterValues,
  Pagination,
  TradesData,
} from "../types/trades.types.js";
import { cleanParams } from "../utils/cleanParams.js";

export const TradeContext = createContext<TradesContextType | null>(null);

export default function TradeProvider({ children }: ContextProviderProps) {
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [trades, setTrades] = useState<TradesData[] | []>([]);
  const [pagination, setPagination] = useState<Pagination | {}>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    order_type: "",
    order_status: "",
    market_type: "",
    position: "",
    fromDate: null,
    toDate: null,
    year: null,
    month: null,
    pnlSort: "",
    dateTimeSort: "",
  });

  const params = cleanParams({
    currentPage,
    limit: 9,
    ...filterValues,
  });

  async function fetchTrades() {
    try {
      const data = await getTradesData(params);
      console.log(data);

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
