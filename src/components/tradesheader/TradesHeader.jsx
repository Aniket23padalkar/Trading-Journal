import { useContext } from "react";
import "./tradesheader.css";
import { GlobalContext } from "../../context/Context";
import { FaFilter } from "react-icons/fa";
import Filters from "../../components/filters/Filters";

export default function TradesHeader() {
  const { setAddModal, viewFilters, setViewFilters } =
    useContext(GlobalContext);
  return (
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
  );
}
