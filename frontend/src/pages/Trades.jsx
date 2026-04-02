import { useCallback, useContext, useEffect, useState } from "react";
import AddModal from "../components/AddModal";
import ViewModal from "../components/ViewModal";
import Pagination from "../components/tradesPageComponents/Pagination";
import TradesTable from "../components/tradesPageComponents/TradesTable";
import TableFooter from "../components/tradesPageComponents/TableFooter";
import TradesHeader from "../components/tradesPageComponents/TradesHeader";
import { TradeContext } from "../context/TradesContext";

export default function Trades() {
  const { setCurrentPage, pagination, filterValue } = useContext(TradeContext);
  const [viewModal, setViewModal] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [currentViewTrade, setCurrentViewTrade] = useState(null);

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
    setCurrentPage((prev) => Math.min(pagination?.totalPages, prev + 1));
  }, [pagination?.totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleSetPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <section className="flex flex-col gap-2 items-center justify-between h-full w-full py-4 px-2 lg:p-4 rounded-3xl bg-gray-100 dark:bg-gray-800">
      {/* Header Section */}
      <TradesHeader setAddModal={handleSetAddModal} />

      {/* Trades Table */}
      <TradesTable
        handleSetViewModal={handleSetViewModal}
        handleSetEditTrade={handleSetEditTrade}
        setCurrentViewTrade={setCurrentViewTrade}
      />

      {/* Table Footer */}
      <TableFooter />

      {/* Pagination Section */}
      <Pagination
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
    </section>
  );
}
