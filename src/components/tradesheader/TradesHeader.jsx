import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { FaFilter } from "react-icons/fa";
import Filters from "../../components/filters/Filters";

export default function TradesHeader() {
  const {
    trades,
    setAddModal,
    viewFilters,
    setViewFilters,
    filterValue,
    setFilterValue,
    filteredTrades,
  } = useContext(GlobalContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilterValue((prev) => ({ ...prev, [name]: value }));
  }

  let yearList = [];
  let monthList = [];

  trades.forEach((trade) => {
    const date = new Date(trade.entries.initialEntryTime);
    const year = date.getFullYear();
    let month = date.toLocaleString("en-IN", { month: "short" });

    if (month === "Sept") month = "Sep";

    if (!filterValue.year || Number(filterValue.year) === year) {
      monthList.push(month);
    }
    yearList.push(year);
  });

  const uniqueYear = Array.from(new Set(yearList));
  uniqueYear.sort();
  const years = uniqueYear;

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const uniqueMonth = Array.from(
    new Set(monthList.filter((m) => m && monthOrder.includes(m)))
  );
  uniqueMonth.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
  const months = uniqueMonth;
  return (
    <div className="flex w-full justify-between items-center py-2 px-6 relative rounded-xl shadow shadow-gray-400 bg-white">
      <div className="flex items-center">
        <p className="drop-shadow-lg font-medium mr-2">
          Yearly/Monthly Trades :
        </p>
        <select
          name="year"
          className="filter-select mr-2"
          value={filterValue.year}
          onChange={handleChange}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {/* <p>Monthly Trades :</p> */}
        <select name="month" className="filter-select" onChange={handleChange}>
          <option value="">All month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {viewFilters && <Filters />}
      <div className="flex items-center gap-2">
        <button
          className={
            viewFilters
              ? "flex items-center px-4 py-0 gap-1 cursor-pointer rounded-md bg-blue-100 text-blue-400 border border-blue-300"
              : "flex items-center px-4 py-0 gap-1 cursor-pointer rounded-md bg-blue-100 text-blue-500 border border-blue-500"
          }
          onClick={() => setViewFilters(!viewFilters)}
        >
          <FaFilter size={12} /> <span>Filters</span>
        </button>

        <button
          onClick={() => setAddModal(true)}
          className="h-full py-1 px-5 font-bold cursor-pointer hover:scale-105 text-green-700 text-sm rounded-lg bg-green-200 border border-green-700"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
