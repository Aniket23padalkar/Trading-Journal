import React, {
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { GlobalContext } from "../../context/Context";
import { FaFilter } from "react-icons/fa";
const Filters = React.lazy(() => import("./Filters"));
import { FilterContext } from "../../context/FilterContext";
import { ScaleLoader } from "react-spinners";

function TradesHeader({ setAddModal }) {
  const { trades } = useContext(GlobalContext);
  const { filterValue, setFilterValue } = useContext(FilterContext);
  const [viewFilters, setViewFilters] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFilterValue((prev) => {
        if (prev?.[name] === value) return prev;
        return { ...prev, [name]: value };
      });
    },
    [setFilterValue]
  );

  const handleClearFilters = useCallback(() => {
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
  }, [setFilterValue]);

  const { years, months } = useMemo(() => {
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

    return { years: uniqueYear, months: uniqueMonth };
  }, [trades, filterValue.year]);

  const handleOpen = useCallback(() => {
    setAddModal(true);
  }, [setAddModal]);

  const handleViewFilter = useCallback(() => {
    setViewFilters((prev) => !prev);
  }, [setViewFilters]);

  return (
    <header className="flex w-full justify-between items-center p-2 lg:py-2 lg:px-6 relative rounded-xl shadow shadow-gray-400 bg-white dark:bg-gray-950 dark:shadow-none dark:text-white">
      <div className="flex items-center">
        <p className="drop-shadow-lg font-medium mr-2 text-sm  xl:text-lg">
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
      {viewFilters && (
        <Suspense
          fallback={
            <div className="flex absolute h-full w-full justify-between items-center">
              <ScaleLoader color="##20dfbc" />
            </div>
          }
        >
          <Filters />
        </Suspense>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={handleClearFilters}
          className="py-0.5 px-1.5 lg:py-1 lg:px-3 rounded-md cursor-pointer hover:bg-red-300 text-sm bg-red-200 text-red-500 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-700"
        >
          Clear
        </button>
        <button
          className={
            viewFilters
              ? "flex items-center lg:px-4 py-0 gap-1 cursor-pointer rounded-md lg:bg-blue-100 lg:dark:bg-blue-500  text-blue-400 dark:text-blue-100 lg:border lg:border-blue-300 dark:border-none dark:py-0.5"
              : "flex items-center lg:px-4 py-0 gap-1 cursor-pointer rounded-md lg:bg-blue-100 lg:dark:bg-blue-900 text-blue-500 dark:text-blue-200 lg:border lg:border-blue-500 dark:border-none dark:py-0.5"
          }
          onClick={handleViewFilter}
        >
          <FaFilter className="text-lg lg:text-sm" />{" "}
          <span className="hidden lg:block">Filters</span>
        </button>

        <button
          onClick={handleOpen}
          className="h-full py-0.5 px-2 lg:py-1 lg:px-5 font-bold cursor-pointer hover:scale-105 text-green-700 text-sm rounded-lg bg-green-200 border border-green-700 dark:bg-teal-500 dark:text-green-800 dark:border-none"
        >
          + Add
        </button>
      </div>
    </header>
  );
}

export default React.memo(TradesHeader);
