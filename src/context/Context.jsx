import { createContext, useContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalStateContext({ children }) {
  const [trades, setTrades] = useState(() => loadFromLocalStorage());
  const [addModal, setAddModal] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [currentViewTrade, setCurrentViewTrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewFilters, setViewFilters] = useState(false);
  const [filterValue, setFilterValue] = useState({
    order: "",
    status: "",
    marketType: "",
    position: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [formData, setFormData] = useState({
    symbol: "",
    order: "",
    status: "",
    buyPrice: "",
    sellPrice: "",
    marketType: "",
    quantity: "",
    risk: "",
    position: "",
    entryTime: "",
    exitTime: "",
    rating: "",
    description: "",
  });

  function loadFromLocalStorage() {
    const stored = localStorage.getItem("trades");
    if (stored) {
      return JSON.parse(stored);
    }

    return [];
  }

  function formatDateTime(dt) {
    if (!dt) return "--";
    return new Date(dt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function calculatePnL(buyPrice, sellPrice, quantity) {
    const b = Number(buyPrice);
    const s = Number(sellPrice);
    const q = Number(quantity);

    if (!b || !s) return 0;

    let pnl = (s - b) * q;

    return pnl.toFixed(2);
  }

  function calculateRRratio(formData) {
    const rrRatio =
      calculatePnL(formData.buyPrice, formData.sellPrice, formData.quantity) /
      formData.risk;
    return rrRatio.toFixed(2);
  }

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  return (
    <GlobalContext.Provider
      value={{
        trades,
        setTrades,
        addModal,
        setAddModal,
        formData,
        setFormData,
        currentEditId,
        setCurrentEditId,
        viewModal,
        setViewModal,
        currentViewTrade,
        setCurrentViewTrade,
        formatDateTime,
        calculatePnL,
        calculateRRratio,
        currentPage,
        setCurrentPage,
        viewFilters,
        setViewFilters,
        filterValue,
        setFilterValue,
        filteredTrades,
        setFilteredTrades,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
