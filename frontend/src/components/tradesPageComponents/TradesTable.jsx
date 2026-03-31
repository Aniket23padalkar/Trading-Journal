import React, { useContext } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import TradeRow from "./TradeRow";
import { deleteTrade } from "../../services/tradesService.js";
import { TradeContext } from "../../context/TradesContext";

function TradesTable({
  handleSetViewModal,
  handleSetEditTrade,
  setCurrentViewTrade,
}) {
  const { trades, setTrades, setFilterValue, filterValue, fetchLoading } =
    useContext(TradeContext);

  function handleFilterChange() {
    setFilterValue((prev) => ({
      ...prev,
      pnlSort:
        prev.pnlSort === "DESC"
          ? "ASC"
          : prev.pnlSort === "ASC"
            ? "DESC"
            : "DESC",
      dateTimeSort: "",
    }));
  }

  function handleDateTimeSort() {
    setFilterValue((prev) => ({
      ...prev,
      dateTimeSort:
        prev.dateTimeSort === "DESC"
          ? "ASC"
          : prev.dateTimeSort === "ASC"
            ? "DESC"
            : "DESC",
      pnlSort: "",
    }));
  }

  async function handleDeleteTrade(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const deleted = await deleteTrade(id);
        console.log(deleted);

        setTrades((prev) => prev.filter((t) => t.trade.trade_id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your Trade has been deleted.",
          icon: "success",
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
        });
      }
    }
  }

  return (
    <section className="flex h-full w-full items-center bg-transparent relative">
      <div className="w-full min-h-102 h shadow shadow-gray-500 dark:shadow-none overflow-x-auto scrollbar-thin-x">
        {fetchLoading && (
          <div className="flex absolute left-0 top-0 items-center justify-center h-full w-full">
            <ScaleLoader color="#20dfbc" />
          </div>
        )}
        <table className="w-full border-collapse bg-white dark:bg-sky-950 dark:text-white ">
          <thead>
            <tr className="text-center whitespace-nowrap bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
              <th className="w-8 bg-gray-200 dark:bg-gray-950">#</th>
              <th className="text-left">symbol</th>
              <th>order</th>
              <th>status</th>
              <th>market-type</th>
              <th>quantity</th>
              <th>position</th>
              <th
                className="flex items-center gap-1 justify-center cursor-pointer select-none"
                onClick={handleDateTimeSort}
              >
                {filterValue.dateTimeSort === "DESC" ? (
                  <FaArrowDown />
                ) : filterValue.dateTimeSort === "ASC" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{" "}
                <p>Entry Time</p>
              </th>
              <th>risk/trade</th>
              <th
                className="flex items-center gap-3 justify-center cursor-pointer select-none"
                onClick={handleFilterChange}
              >
                {filterValue.pnlSort === "DESC" ? (
                  <FaArrowDown />
                ) : filterValue.pnlSort === "ASC" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{" "}
                <p>P&L (₹)</p>
              </th>
              <th>R:R Ratio</th>
              <th>rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trades?.length > 0 &&
              trades?.map((trade, index) => (
                <TradeRow
                  key={trade.trade.trade_id}
                  t={trade}
                  index={index}
                  handleSetEditTrade={handleSetEditTrade}
                  setCurrentViewTrade={setCurrentViewTrade}
                  handleSetViewModal={handleSetViewModal}
                  handleDeleteTrade={handleDeleteTrade}
                />
              ))}
          </tbody>
        </table>
      </div>
      {trades.length === 0 && !fetchLoading && (
        <div className="flex items-center justify-center top-0 dark:text-white left-0 absolute h-full w-full">
          <h1>Nothing To Show! Please Add Trades</h1>
        </div>
      )}
    </section>
  );
}

export default React.memo(TradesTable);
