import React, { useContext } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import TradeRow from "./TradeRow.js";
import { deleteTrade } from "../../api/tradesService.js";
import { useTradesContext } from "../../hooks/useTradesContext.js";
import { getErrorMessage } from "../../utils/error.handler.js";
import type { TradesData } from "../../types/trades.types.js";

interface TradesTableParams {
  handleSetViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetEditTrade: (trade: TradesData) => void;
  setCurrentViewTrade: React.Dispatch<React.SetStateAction<TradesData | null>>;
}

function TradesTable({
  handleSetViewModal,
  handleSetEditTrade,
  setCurrentViewTrade,
}: TradesTableParams) {
  const { trades, setTrades, setFilterValues, filterValues, fetchLoading } =
    useTradesContext();

  function handleFilterChange(): void {
    setFilterValues((prev) => ({
      ...prev,
      pnlSort:
        prev.pnlSort === "desc"
          ? "asc"
          : prev.pnlSort === "asc"
            ? "desc"
            : "desc",
      dateTimeSort: "",
    }));
  }

  function handleDateTimeSort(): void {
    setFilterValues((prev) => ({
      ...prev,
      dateTimeSort:
        prev.dateTimeSort === "desc"
          ? "asc"
          : prev.dateTimeSort === "asc"
            ? "desc"
            : "desc",
      pnlSort: "",
    }));
  }

  async function handleDeleteTrade(trade_id: string): Promise<void> {
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
        const deleted = await deleteTrade(trade_id);
        console.log(deleted);

        setTrades((prev) => prev.filter((t) => t.trade.trade_id !== trade_id));

        Swal.fire({
          title: "Deleted!",
          text: "Your Trade has been deleted.",
          icon: "success",
        });
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        Swal.fire({
          title: "Error!",
          text: message,
          icon: "error",
        });
      }
    }
  }

  return (
    <section className="flex h-full w-full items-center bg-transparent relative">
      <div className="w-full h-full h shadow shadow-gray-500 dark:shadow-none overflow-x-auto scrollbar-thin-x">
        {fetchLoading ? (
          <div className="flex absolute left-0 top-0 items-center justify-center h-full w-full">
            <ScaleLoader color="#20dfbc" />
          </div>
        ) : <table className="w-full border-collapse bg-white dark:bg-sky-950 dark:text-white ">
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
                {filterValues.dateTimeSort === "desc" ? (
                  <FaArrowDown />
                ) : filterValues.dateTimeSort === "asc" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{" "}
                <p>Entry Time</p>
              </th>
              <th>risk</th>
              <th
                className="flex items-center gap-3 justify-center cursor-pointer select-none"
                onClick={handleFilterChange}
              >
                {filterValues.pnlSort === "desc" ? (
                  <FaArrowDown />
                ) : filterValues.pnlSort === "asc" ? (
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
                  trade={trade}
                  index={index}
                  handleSetEditTrade={handleSetEditTrade}
                  setCurrentViewTrade={setCurrentViewTrade}
                  handleSetViewModal={handleSetViewModal}
                  handleDeleteTrade={handleDeleteTrade}
                />
              ))}
          </tbody>
        </table>}
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
