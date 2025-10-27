import { createContext, useContext, useEffect, useState } from "react";
import FilterTrades from "../utils/FilterTrades.jsx";

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

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    const result = FilterTrades(trades, filterValue);
    setFilteredTrades(result);
  }, [trades]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValue]);

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
