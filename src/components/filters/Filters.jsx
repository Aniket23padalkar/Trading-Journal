import { useContext } from "react";
import "./filters.css";
import { GlobalContext } from "../../context/Context";

export default function Filters() {
  const { filterValue, setFilterValue } = useContext(GlobalContext);

  console.log(filterValue);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilterValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleClearFilters() {
    setFilterValue({
      order: "",
      status: "",
      marketType: "",
      position: "",
      fromDate: "",
      toDate: "",
      year: "",
      month: "",
    });
  }

  return (
    <div className="filters">
      <select
        name="order"
        value={filterValue.order}
        id="order"
        onChange={handleChange}
      >
        <option value="">Order</option>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
      <select
        name="status"
        value={filterValue.status}
        id="status"
        onChange={handleChange}
      >
        <option value="">Status</option>
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
      </select>
      <select
        name="marketType"
        value={filterValue.marketType}
        id=""
        onChange={handleChange}
      >
        <option value="">Market-Type</option>
        <option value="Equity">Equity</option>
        <option value="Options">Options</option>
        <option value="Futures">Futures</option>
      </select>
      <select
        name="position"
        value={filterValue.position}
        onChange={handleChange}
      >
        <option value="">Position</option>
        <option value="Intraday">Intraday</option>
        <option value="BTST">BTST</option>
        <option value="STBT">STBT</option>
        <option value="Swing">Swing</option>
        <option value="Positional">Positional</option>
        <option value="Long-Term">Long-Term</option>
      </select>
      <div className="date-range">
        {/* <label>Date Range:</label> */}
        <input
          type="date"
          name="fromDate"
          className="from-to-date"
          onChange={handleChange}
          value={filterValue.fromDate}
        />
        <span>to</span>
        <input
          type="date"
          name="toDate"
          className="from-to-date"
          onChange={handleChange}
          value={filterValue.toDate}
        />
      </div>

      <button onClick={handleClearFilters} id="clear-btn">
        Clear
      </button>
    </div>
  );
}
