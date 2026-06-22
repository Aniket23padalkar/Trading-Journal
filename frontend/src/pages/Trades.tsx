import { useCallback, useContext, useEffect, useState } from "react";
import AddModal from "../components/tradesPageComponents/AddModal.js";
import ViewModal from "../components/tradesPageComponents/ViewModal.js";
import Pagination from "../components/tradesPageComponents/Pagination.js";
import TradesTable from "../components/tradesPageComponents/TradesTable.js";
import TableFooter from "../components/tradesPageComponents/TableFooter.js";
import TradesHeader from "../components/tradesPageComponents/TradesHeader.js";
import { TradeContext } from "../context/TradesContext.js";
import { useTradesContext } from "../hooks/useTradesContext.js";
import type { EditTrade, TradesData } from "../types/trades.types.js";

export default function Trades() {
  const { setCurrentPage, pagination, filterValues } = useTradesContext();
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editTrade, setEditTrade] = useState<EditTrade | null>(null);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [currentViewTrade, setCurrentViewTrade] = useState<TradesData | null>(
    null,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterValues]);

  const handleSetEditTrade = useCallback(
    (trade: TradesData) => {
      setEditTrade({
        ...trade.trade,
        description: trade.trade_logs.description,
        executions: trade.executions,
      });
      setAddModal(true);
    },
    [setEditTrade, setAddModal],
  );

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(pagination?.totalPages, prev + 1));
  }, [pagination?.totalPages]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, [setCurrentPage]);

  return (
    <section className="flex flex-col gap-2 items-center justify-between h-full w-full lg:w-248 xl:w-285 2xl:w-full py-4 px-2 lg:p-4 rounded-3xl bg-gray-100 dark:bg-gray-800">
      {/* Header Section */}
      <TradesHeader setAddModal={setAddModal} />

      {/* Trades Table */}
      <TradesTable
        handleSetViewModal={setViewModal}
        handleSetEditTrade={handleSetEditTrade}
        setCurrentViewTrade={setCurrentViewTrade}
      />

      {/* Table Footer */}
      <TableFooter />

      {/* Pagination Section */}
      <Pagination
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        handleSetPage={setCurrentPage}
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
