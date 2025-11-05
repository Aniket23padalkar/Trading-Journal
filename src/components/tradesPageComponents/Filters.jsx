import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

export default function Filters() {
  const { filterValue, setFilterValue } = useContext(GlobalContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilterValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex items-center gap-2 absolute rounded-2xl h-full w-120 lg:w-180 dark:bg-gray-950 pr-2 bg-white">
      <select
        className="filter-select"
        name="order"
        value={filterValue.order}
        onChange={handleChange}
      >
        <option value="">Order</option>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
      <select
        name="status"
        value={filterValue.status}
        className="filter-select"
        onChange={handleChange}
      >
        <option value="">Status</option>
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
      </select>
      <select
        name="marketType"
        value={filterValue.marketType}
        className="filter-select"
        onChange={handleChange}
      >
        <option value="">Market-Type</option>
        <option value="Equity">Equity</option>
        <option value="Options">Options</option>
        <option value="Futures">Futures</option>
      </select>
      <select
        className="filter-select"
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
      <div className="lg:flex py-1 items-center hidden ml-1 text-violet-400 dark:text-blue-300 bg-violet-50 dark:bg-blue-900 rounded-md">
        {/* <label>Date Range:</label> */}
        <input
          type="date"
          name="fromDate"
          className="px-2 outline-none text-xs text-violet-400 dark:text-blue-300 uppercase"
          onChange={handleChange}
          value={filterValue.fromDate}
        />
        <span className="text-sm">to</span>
        <input
          type="date"
          name="toDate"
          className="px-2 outline-none text-xs text-violet-400 dark:text-blue-300 uppercase"
          onChange={handleChange}
          value={filterValue.toDate}
        />
      </div>
    </div>
  );
}
