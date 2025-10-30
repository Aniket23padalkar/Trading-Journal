import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import AddModal from "../../components/addmodal/AddModal";
import ViewModal from "../../components/viewmodal/ViewModal";
import Pagination from "../../components/pagination/Pagination";
import TradesTable from "../../components/trades-table/TradesTable";
import usePagination from "../../hooks/usePagination";
import TableFooter from "../../components/table-footer/TableFooter";
import TradesHeader from "../../components/tradesheader/TradesHeader";

export default function Trades() {
  const { addModal, viewModal, currentPage, filteredTrades } =
    useContext(GlobalContext);

  const { totalPages, currentTrades, indexOfFirstTrade } = usePagination(
    filteredTrades,
    9,
    currentPage
  );

  return (
    <div className="flex flex-col gap-2 items-center justify-between h-full w-full p-4 rounded-3xl bg-gray-100">
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
