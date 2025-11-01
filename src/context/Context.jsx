import { createContext, useContext, useEffect, useState } from "react";
import FilterTrades from "../utils/FilterTrades.jsx";
import useLocalStorage from "../hooks/useLocalStorage.jsx";
import useTradesData from "../hooks/useTradesData.jsx";

export const GlobalContext = createContext(null);

export default function GlobalStateContext({ children }) {
  const [trades, setTrades] = useTradesData("tradesV2", []);
  const [addModal, setAddModal] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [currentViewTrade, setCurrentViewTrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewFilters, setViewFilters] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [addQtyModal, setAddQtyModal] = useState(false);
  const [entries, setEntries] = useState({
    addedEntries: [],
    initialBuy: "",
    initialSell: "",
    initialQty: "",
    initialRisk: "",
    initialEntryTime: "",
    initialExitTime: "",
  });
  const [filterValue, setFilterValue] = useState({
    order: "",
    status: "",
    marketType: "",
    position: "",
    fromDate: "",
    toDate: "",
    year: "",
    month: "",
  });
  const [formData, setFormData] = useState({
    symbol: "",
    order: "",
    status: "",
    marketType: "",
    position: "",
    rating: "",
    description: "",
  });

  useEffect(() => {
    const result = FilterTrades(trades, filterValue);
    setFilteredTrades(result);
  }, [filterValue, trades]);

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
        entries,
        setEntries,
        addQtyModal,
        setAddQtyModal,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
