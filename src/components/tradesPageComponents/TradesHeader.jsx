import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { FaFilter } from "react-icons/fa";
import Filters from "./Filters";

export default function TradesHeader() {
  const {
    trades,
    setAddModal,
    viewFilters,
    setViewFilters,
    filterValue,
    setFilterValue,
  } = useContext(GlobalContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilterValue((prev) => ({ ...prev, [name]: value }));
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
      pnlSort: "",
      dateTimeSort: "",
    });
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
    <div className="flex w-full justify-between items-center py-2 px-6 relative rounded-xl shadow shadow-gray-400 bg-white dark:bg-gray-950 dark:shadow-none dark:text-white">
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
          onClick={handleClearFilters}
          className="py-1 px-3 rounded-md cursor-pointer hover:bg-red-300 text-sm bg-red-200 text-red-500 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-700"
        >
          Clear
        </button>
        <button
          className={
            viewFilters
              ? "flex items-center px-4 py-0 gap-1 cursor-pointer rounded-md bg-blue-100 dark:bg-blue-500  text-blue-400 dark:text-blue-100 border border-blue-300 dark:border-none dark:py-0.5"
              : "flex items-center px-4 py-0 gap-1 cursor-pointer rounded-md bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-200 border border-blue-500 dark:border-none dark:py-0.5"
          }
          onClick={() => setViewFilters(!viewFilters)}
        >
          <FaFilter size={12} /> <span>Filters</span>
        </button>

        <button
          onClick={() => setAddModal(true)}
          className="h-full py-1 px-5 font-bold cursor-pointer hover:scale-105 text-green-700 text-sm rounded-lg bg-green-200 border border-green-700 dark:bg-teal-500 dark:text-green-800 dark:border-none"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
