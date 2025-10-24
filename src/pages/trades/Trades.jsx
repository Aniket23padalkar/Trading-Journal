import { useContext } from "react";
import "./trades.css";
import { GlobalContext } from "../../context/Context";
import AddModal from "../../components/addmodal/AddModal";
import { FaFilter } from "react-icons/fa";
import ViewModal from "../../components/viewmodal/ViewModal";
import Filters from "../../components/filters/Filters";
import Pagination from "../../components/pagination/Pagination";
import TradesTable from "../../components/trades-table/TradesTable";
import usePagination from "../../hooks/usePagination";
import TableFooter from "../../components/table-footer/TableFooter";

export default function Trades() {
  const {
    addModal,
    setAddModal,
    viewModal,
    currentPage,
    viewFilters,
    setViewFilters,
    filteredTrades,
  } = useContext(GlobalContext);

  const { totalPages, currentTrades, indexOfFirstTrade } = usePagination(
    filteredTrades,
    9,
    currentPage
  );

  return (
    <div className="trades-container">
      {/* Header Section */}
      <div className="header">
        {viewFilters && <Filters />}
        <button
          className={viewFilters ? "filter-btn active" : "filter-btn"}
          onClick={() => setViewFilters(!viewFilters)}
        >
          <FaFilter size={12} /> <span>Filters</span>
        </button>

        <button onClick={() => setAddModal(true)} id="add-btn">
          + Add
        </button>
      </div>

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
