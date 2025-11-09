import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../context/Context";
import AddModal from "../components/AddModal";
import ViewModal from "../components/ViewModal";
import Pagination from "../components/tradesPageComponents/Pagination";
import TradesTable from "../components/tradesPageComponents/TradesTable";
import usePagination from "../hooks/usePagination";
import TableFooter from "../components/tradesPageComponents/TableFooter";
import TradesHeader from "../components/tradesPageComponents/TradesHeader";
import FilterTrades from "../utils/FilterTrades";
import { FilterContext } from "../context/FilterContext";

export default function Trades() {
  const { trades } = useContext(GlobalContext);
  const { filterValue } = useContext(FilterContext);
  const [viewModal, setViewModal] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentViewTrade, setCurrentViewTrade] = useState(null);

  const filteredTrades = useMemo(
    () => FilterTrades(trades, filterValue),
    [trades, filterValue]
  );

  const { totalPages, currentTrades, indexOfFirstTrade } = usePagination(
    filteredTrades,
    9,
    currentPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValue]);

  const handleSetEditTrade = useCallback((trade) => {
    setEditTrade(trade);
    setAddModal(true);
  }, []);

  const handleSetViewModal = useCallback((val) => {
    setViewModal(val);
  }, []);

  const handleSetAddModal = useCallback((val) => {
    setAddModal(val);
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSetPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="flex flex-col gap-2 items-center justify-between h-full w-full py-4 px-2 lg:p-4 rounded-3xl bg-gray-100 dark:bg-gray-800">
      {/* Header Section */}
      <TradesHeader setAddModal={handleSetAddModal} />

      {/* Trades Table */}
      <TradesTable
        currentTrades={currentTrades}
        indexOfFirstTrade={indexOfFirstTrade}
        handleSetViewModal={handleSetViewModal}
        handleSetEditTrade={handleSetEditTrade}
        setCurrentViewTrade={setCurrentViewTrade}
      />

      {/* Table Footer */}
      <TableFooter filteredTrades={filteredTrades} />

      {/* Pagination Section */}
      <Pagination
        totalPages={totalPages}
        currentTrades={currentTrades}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleSetPage={handleSetPage}
      />

      {/* Modals */}
      {addModal && (
        <AddModal
          editTrade={editTrade}
          setEditTrade={setEditTrade}
          setAddModal={setAddModal}
        />
      )}
      {viewModal && (
        <ViewModal
          setViewModal={setViewModal}
          currentViewTrade={currentViewTrade}
        />
      )}
    </div>
  );
}
