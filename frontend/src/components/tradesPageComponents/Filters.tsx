import { useTradesContext } from "../../hooks/useTradesContext.js";

export default function Filters() {
  const { filterValues, setFilterValues } = useTradesContext();

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) {
    const { name, value } = e.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex items-center gap-2 absolute rounded-2xl h-full w-86 lg:w-120 xl:w-180 dark:bg-gray-950 pr-2 bg-white">
      <select
        className="filter-select"
        name="order_type"
        value={filterValues.order_type}
        onChange={handleChange}
      >
        <option value="">Order</option>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <select
        name="market_type"
        value={filterValues.market_type}
        className="filter-select"
        onChange={handleChange}
      >
        <option value="">Market-Type</option>
        <option value="Equity">Equity</option>
        <option value="Options">Options</option>
        <option value="Futures">Futures</option>s
      </select>
      <select
        className="filter-select"
        name="position"
        value={filterValues.position}
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
      <div className="md:flex py-1 items-center hidden ml-1 text-violet-400 dark:text-blue-300 bg-violet-50 dark:bg-blue-900 rounded-md">
        {/* <label>Date Range:</label> */}
        <input
          type="date"
          name="fromDate"
          className="px-2 outline-none text-xs text-violet-400 dark:text-blue-300 uppercase"
          onChange={handleChange}
          value={
            typeof filterValues.fromDate === "string"
              ? filterValues.fromDate
              : ""
          }
        />
        <span className="text-sm">to</span>
        <input
          type="date"
          name="toDate"
          className="px-2 outline-none text-xs text-violet-400 dark:text-blue-300 uppercase"
          onChange={handleChange}
          value={
            typeof filterValues.toDate === "string" ? filterValues.toDate : ""
          }
        />
      </div>
    </div>
  );
}
