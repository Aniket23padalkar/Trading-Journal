import { useContext } from "react";
import { GlobalContext } from "../context/Context";
import AddModal from "../components/AddModal";
import ViewModal from "../components/ViewModal";
import Pagination from "../components/tradesPageComponents/Pagination";
import TradesTable from "../components/tradesPageComponents/TradesTable";
import usePagination from "../hooks/usePagination";
import TableFooter from "../components/tradesPageComponents/TableFooter";
import TradesHeader from "../components/tradesPageComponents/TradesHeader";

export default function Trades() {
  const { addModal, viewModal, currentPage, filteredTrades } =
    useContext(GlobalContext);

  const { totalPages, currentTrades, indexOfFirstTrade } = usePagination(
    filteredTrades,
    9,
    currentPage
  );

  return (
    <div className="flex flex-col gap-2 items-center justify-between h-full w-full p-4 rounded-3xl bg-gray-100 dark:bg-gray-800">
      {/* Header Section */}
      <TradesHeader />

      {/* Trades Table */}
      <TradesTable
        currentTrades={currentTrades}
        indexOfFirstTrade={indexOfFirstTrade}
      />

      {/* Table Footer */}
      <TableFooter />

      {/* Pagination Section */}
      <Pagination totalPages={totalPages} currentTrades={currentTrades} />

      {/* Modals */}
      {addModal && <AddModal />}
      {viewModal && <ViewModal />}
    </div>
  );
}
