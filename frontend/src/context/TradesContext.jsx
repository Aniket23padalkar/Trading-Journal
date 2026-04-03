import { createContext, useEffect, useState } from "react";
import { getTradesData } from "../services/tradesService";

export const TradeContext = createContext(null);

export default function TradeProvider({ children }) {
  const [trades, setTrades] = useState([]);
  const [pagination, setPagination] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [overallStats, setOverallStats] = useState();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [filterValue, setFilterValue] = useState({
    order_type: "",
    status: "",
    market_type: "",
    position: "",
    fromDate: "",
    toDate: "",
    year: "",
    month: "",
    pnlSort: "",
    dateTimeSort: "",
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const params = {
    currentPage,
    limit: 9,
    ...filterValue,
  };

  async function fetchTrades() {
    try {
      setFetchLoading(true);
      const data = await getTradesData(params);

      setTrades(data?.trades_data);

      setPagination(data?.pagination);

      setOverallStats(data?.overallStats);
    } catch (err) {
      console.log(err);
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    fetchTrades();
  }, [currentPage, filterValue]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <TradeContext.Provider
      value={{
        trades,
        setTrades,
        theme,
        setTheme,
        pagination,
        setPagination,
        currentPage,
        setCurrentPage,
        overallStats,
        filterValue,
        setFilterValue,
        fetchTrades,
        fetchLoading,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}
