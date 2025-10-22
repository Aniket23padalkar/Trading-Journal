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

  const { totalPages, currentTrades } = usePagination(
    filteredTrades,
    5,
    currentPage
  );

  return (
    <div className="trades-container">
      {/* Header Section */}
      <div className="header">
        {viewFilters && <Filters />}
        <button id="filter-btn" onClick={() => setViewFilters(!viewFilters)}>
          <FaFilter size={12} /> <span>Filters</span>
        </button>

        <button onClick={() => setAddModal(true)} id="add-btn">
          + Add
        </button>
      </div>

      {/* Trades Table */}
      <TradesTable currentTrades={currentTrades} />

      {/* Pagination Section */}
      <Pagination totalPages={totalPages} currentTrades={currentTrades} />

      {/* Modals */}
      {addModal && <AddModal />}
      {viewModal && <ViewModal />}
    </div>
  );
}
