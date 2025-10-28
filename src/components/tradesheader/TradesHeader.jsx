import { useContext } from "react";
import "./tradesheader.css";
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
  console.log(monthList);

  trades.forEach((trade) => {
    const date = new Date(trade.formData.entryTime);
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
    <div className="header">
      <div className="year-month">
        <p>Yearly/Monthly Trades :</p>
        <select
          name="year"
          className="year-month-filter"
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
        <select
          name="month"
          className="year-month-filter"
          onChange={handleChange}
        >
          <option value="">All month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {viewFilters && <Filters />}
      <div className="trades-header-btns">
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
    </div>
  );
}
