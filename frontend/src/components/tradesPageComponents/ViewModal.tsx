import { useState } from "react";
import formatDateTime from "../../utils/formatDateTime.js";
import useDrag from "../../hooks/useDrag.js";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import { useThemeContext } from "../../hooks/useThemeContext.js";
import type { TradesData } from "../../types/trades.types.js";

interface ViewModalParams {
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentViewTrade: TradesData | null;
}

export default function ViewModal({
  setViewModal,
  currentViewTrade,
}: ViewModalParams) {
  if (!currentViewTrade) return;

  const { theme } = useThemeContext();
  const [description, setDescription] = useState(false);

  const { modalRef, handleMouseDown } = useDrag();

  function handleViewOrderColor() {
    if (currentViewTrade?.trade.direction === "long") return "#44ca80ff";
    if (currentViewTrade?.trade.direction === "short") return "#ff7779ff";
    return "white";
  }

  function handleRatingColor() {
    if (currentViewTrade?.trade.trade_rating === "worst") return "red";
    if (currentViewTrade?.trade.trade_rating === "poor") return "#ff787aff";
    if (currentViewTrade?.trade.trade_rating === "average")
      return theme === "dark" ? "gray" : "#000000";
    if (currentViewTrade?.trade.trade_rating === "good") return "#66c43bff";
    if (currentViewTrade?.trade.trade_rating === "best") return "green";
    return "black";
  }

  function handleCloseViewModal() {
    setViewModal(false);
  }

  return (
    <article
      className="flex flex-col absolute lg:fixed h-full w-11/12 lg:top-1/5 lg:left-1/6 lg:w-3/4 bg-white dark:bg-gray-800 dark:text-white dark:shadow-none lg:h-120 rounded-xl overflow-hidden shadow-xl shadow-gray-400 "
      ref={modalRef}
    >
      <div
        className="flex w-full items-center justify-between px-4 h-10 bg-teal-700 select-none cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h1 className="uppercase text-white text-xl font-bold text-shadow-lg tracking-widest text-shadow-gray-600">
          {currentViewTrade?.trade.symbol}
        </h1>
        <span
          className="px-2 rounded shadow-sm shadow-gray-700 capitalize"
          style={{ backgroundColor: handleViewOrderColor(), color: "white" }}
        >
          {currentViewTrade?.trade.direction}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 relative p-2">
        <div className="flex w-full">
          <div className="view-modal-section border-none">
            <span className="view-modal-span">Avg-Buy-Price</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade?.stats.avg_buy_price).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Avg-Sell-Price</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade?.stats.avg_sell_price).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Total-Quantity</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade?.stats.total_qty).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Avg-Risk</span>
            <h1 className="flex items-center justify-center view-modal-h1">
              <FaIndianRupeeSign />
              {Number(currentViewTrade?.trade.risk).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Status</span>
            <h1 className="view-modal-h1 capitalize">
              {currentViewTrade?.trade.order_status}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Market-Type</span>
            <h1 className="view-modal-h1 capitalize">
              {currentViewTrade?.trade.market_type}
            </h1>
          </div>
        </div>

        <div className="flex w-full">
          <div className="view-modal-section border-none">
            <span className="view-modal-span">Position</span>
            <h1 className="view-modal-h1 uppercase">
              {currentViewTrade?.trade.position}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Entry-Time</span>
            <h1 className="view-modal-h1 font-light text-sm pt-1 text-indigo-600 dark:text-blue-400">
              {formatDateTime(currentViewTrade.trade.entry_time)}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Total PnL</span>
            <h1
              className={`view-modal-h1 flex items-center justify-center gap-1 ${
                currentViewTrade?.trade.pnl
                  ? currentViewTrade?.trade.pnl > 0
                    ? "text-green-500"
                    : "text-red-400"
                  : null
              }`}
            >
              <FaIndianRupeeSign />
              {Number(currentViewTrade.trade.pnl).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">R:R Ratio</span>
            <h1 className="view-modal-h1 pt-1">
              {Number(currentViewTrade.stats.rr_ratio).toFixed(2)}X
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Exit-Time</span>
            <h1 className="view-modal-h1 font-light pt-1 text-indigo-600 dark:text-blue-400">
              {formatDateTime(currentViewTrade.trade.exit_time)}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span ">Trade-Rating</span>
            <h1
              className="view-modal-h1 pt-1 capitalize"
              style={{ color: handleRatingColor() }}
            >
              {currentViewTrade.trade.trade_rating}
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 h-63.75 border-t pt-2 border-blue-300">
          <div
            className={`flex flex-col lg:flex-1 h-50 overflow-y-auto p-2 ${
              description
                ? "absolute h-full p-4 transition ease-in-out bg-white dark:bg-gray-800 left-0 top-0 w-full z-10"
                : ""
            }`}
          >
            <span className="flex justify-between w-full font-bold pb-2 border-b border-gray-400">
              Trade-Description :{" "}
              <button
                onClick={() => setDescription(!description)}
                className="bg-blue-200 px-2 rounded font-light cursor-pointer text-blue-700 hover:scale-105"
              >
                {description ? "Close" : "Details"}
              </button>
            </span>
            <div className="prose prose-sm max-w-none pt-2">
              <ReactMarkdown>
                {currentViewTrade.trade_logs.description
                  ? currentViewTrade.trade_logs.description
                  : "## No Description!"}
              </ReactMarkdown>
            </div>
          </div>
          <div className="flex items-center h-63.5 flex-col w-full lg:w-152.5 sm:border-t lg:border-t-0 lg:border-l border-blue-300 dark:border-blue-600 p-2">
            <div className="flex w-full">
              <h1 className="font-medium pb-2 pl-2">Added Qty Details :</h1>
            </div>
            <div className="overflow-y-auto w-full">
              <table className="shadow border-collapse w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="font-bold text-xs">#</th>
                    <th className="font-bold text-xs">Executed_at</th>
                    <th className="font-bold text-xs">Price</th>
                    <th className="font-bold text-xs">Qty</th>
                    <th className="font-bold text-xs">Order_type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentViewTrade?.executions?.map((entry, index) => {
                    return (
                      <tr className="" key={entry.execution_id}>
                        <td className="text-xs bg-gray-100 dark:bg-gray-900">
                          {index + 1}
                        </td>
                        <td className="text-xs text-blue-700 dark:text-blue-400">
                          {formatDateTime(entry.executed_at)}
                        </td>
                        <td
                          className={`text-xs ${entry.order_type === "buy" ? "text-green-700" : "text-red-500"}`}
                        >
                          {entry.price}
                        </td>
                        <td className="text-xs">{entry.quantity}</td>
                        <td>
                          <p
                            className={`capitalize text-xs w-15 mx-auto px-1 rounded ${entry.order_type === "buy" ? "bg-green-200 border-green-400 border-2 text-green-600" : "bg-red-100 border-2 border-red-300 text-red-500"}`}
                          >
                            {entry.order_type}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end px-6 bg-teal-700 h-10 w-full">
        <button
          className="bg-red-400 px-6 rounded text-red-800 hover:scale-105 cursor-pointer font-bold"
          onClick={handleCloseViewModal}
        >
          Close
        </button>
      </div>
    </article>
  );
}
