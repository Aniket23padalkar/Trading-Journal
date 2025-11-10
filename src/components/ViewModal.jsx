import { useContext, useState } from "react";
import { GlobalContext } from "../context/Context";
import formatDateTime from "../utils/formatDateTime";
import useDrag from "../hooks/useDrag";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import calculatePnL from "../utils/CalculatePnl";
import FormatPnL from "../utils/FormatPnL";

export default function ViewModal({ setViewModal, currentViewTrade }) {
  const { theme } = useContext(GlobalContext);
  const [description, setDescription] = useState(false);

  const { modalRef, handleMouseDown } = useDrag();

  function handleViewOrderColor() {
    if (currentViewTrade.formData.order === "BUY") return "#44ca80ff";
    if (currentViewTrade.formData.order === "SELL") return "#ff7779ff";
    return "white";
  }

  function handleRatingColor() {
    if (currentViewTrade.formData.rating === "Worst") return "red";
    if (currentViewTrade.formData.rating === "Poor") return "#ff787aff";
    if (currentViewTrade.formData.rating === "Average")
      return theme === "dark" ? "gray" : "#000000";
    if (currentViewTrade.formData.rating === "Good") return "#66c43bff";
    if (currentViewTrade.formData.rating === "Best") return "green";
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
          {currentViewTrade.formData.symbol}
        </h1>
        <span
          className="px-2 rounded shadow-sm shadow-gray-700"
          style={{ backgroundColor: handleViewOrderColor(), color: "white" }}
        >
          {currentViewTrade.formData.order}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 relative p-2">
        <div className="flex w-full">
          <div className="view-modal-section border-none">
            <span className="view-modal-span">Avg-Buy-Price</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade.stats.avgBuy).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Avg-Sell-Price</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade.stats.avgSell).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Total-Quantity</span>
            <h1 className="view-modal-h1">
              {Number(currentViewTrade.stats.totalQty).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Avg-Risk</span>
            <h1 className="flex items-center justify-center view-modal-h1">
              <FaIndianRupeeSign />
              {Number(currentViewTrade.stats.avgRisk).toFixed(2)}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Status</span>
            <h1 className="view-modal-h1">
              {currentViewTrade.formData.status}
            </h1>
          </div>
          <div className="view-modal-section">
            <span className="view-modal-span">Market-Type</span>
            <h1 className="view-modal-h1">
              {currentViewTrade.formData.marketType}
            </h1>
          </div>
        </div>

        <div className="flex w-full">
          <div className="view-modal-section border-none">
            <span className="view-modal-span">Position</span>
            <h1 className="view-modal-h1">
              {currentViewTrade.formData.position}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Entry-Time</span>
            <h1 className="view-modal-h1 font-light text-sm pt-1 text-indigo-600 dark:text-blue-400">
              {formatDateTime(currentViewTrade.entries.initialEntryTime)}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Total PnL</span>
            <h1
              className={`view-modal-h1 flex items-center justify-center gap-1 ${
                currentViewTrade.stats.pnl > 0
                  ? "text-green-500"
                  : "text-red-400"
              }`}
            >
              <FaIndianRupeeSign />
              {Number(currentViewTrade.stats.pnl).toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">R:R Ratio</span>
            <h1 className="view-modal-h1 pt-1">
              {Number(currentViewTrade.stats.avgRR).toFixed(2)}X
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Exit-Time</span>
            <h1 className="view-modal-h1 font-light pt-1 text-indigo-600 dark:text-blue-400">
              {formatDateTime(currentViewTrade.entries.initialExitTime)}
            </h1>
          </div>

          <div className="view-modal-section">
            <span className="view-modal-span">Trade-Rating</span>
            <h1
              className="view-modal-h1 pt-1"
              style={{ color: handleRatingColor() }}
            >
              {currentViewTrade.formData.rating}
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 h-[255px] border-t pt-2 border-blue-300">
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
                {currentViewTrade.formData.description
                  ? currentViewTrade.formData.description
                  : "## No Description!"}
              </ReactMarkdown>
            </div>
          </div>
          <div className="flex items-center h-[254px] flex-col w-full lg:w-[610px] sm:border-t lg:border-t-0 lg:border-l border-blue-300 dark:border-blue-600 p-2">
            <div className="flex w-full">
              <h1 className="font-medium pb-2 pl-2">Added Qty Details :</h1>
            </div>
            <div className="overflow-y-auto w-full">
              <table className="shadow border-collapse w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <th className="font-bold text-xs">#</th>
                    <th className="font-bold text-xs">Buy</th>
                    <th className="font-bold text-xs">Sell</th>
                    <th className="font-bold text-xs">Qty</th>
                    <th className="font-bold text-xs">Risk</th>
                    <th className="font-bold text-xs">Enter</th>
                    <th className="font-bold text-xs">Exit</th>
                    <th className="font-bold text-xs">Label</th>
                    <th className="font-bold text-xs">Pnl</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="">
                    <td className="text-xs bg-gray-100 dark:bg-gray-900">1</td>
                    <td className="text-xs text-green-700">
                      {currentViewTrade.entries.initialBuy || "--"}
                    </td>
                    <td className="text-xs text-red-500">
                      {currentViewTrade.entries.initialSell || "--"}
                    </td>
                    <td className="text-xs">
                      {currentViewTrade.entries.initialQty || "--"}
                    </td>
                    <td className="text-xs">
                      {currentViewTrade.entries.initialRisk || "--"}
                    </td>
                    <td className="text-xs text-blue-700 dark:text-blue-400">
                      {formatDateTime(
                        currentViewTrade.entries.initialEntryTime
                      )}
                    </td>
                    <td className="text-xs text-blue-700 dark:text-blue-400">
                      {formatDateTime(currentViewTrade.entries.initialExitTime)}
                    </td>
                    <td>
                      <p className="bg-violet-300 px-2 text-violet-800 rounded">
                        Initial
                      </p>
                    </td>
                    <td
                      style={{
                        color:
                          calculatePnL(
                            currentViewTrade.entries.initialBuy,
                            currentViewTrade.entries.initialSell,
                            currentViewTrade.entries.initialQty
                          ) > 0
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {FormatPnL(
                        calculatePnL(
                          currentViewTrade.entries.initialBuy,
                          currentViewTrade.entries.initialSell,
                          currentViewTrade.entries.initialQty
                        )
                      )}
                    </td>
                  </tr>
                  {currentViewTrade?.entries?.addedEntries?.map(
                    (entry, index) => {
                      return (
                        <tr className="" key={entry.id}>
                          <td className="text-xs bg-gray-100 dark:bg-gray-900">
                            {index + 2}
                          </td>
                          <td className="text-xs text-green-700">
                            {entry.buyPrice}
                          </td>
                          <td className="text-xs text-red-500">
                            {entry.sellPrice}
                          </td>
                          <td className="text-xs">{entry.quantity}</td>
                          <td className="text-xs">{entry.risk}</td>
                          <td className="text-xs text-blue-700 dark:text-blue-400">
                            {formatDateTime(entry.entryTime)}
                          </td>
                          <td className="text-xs text-blue-700 dark:text-blue-400">
                            {formatDateTime(entry.exitTime)}
                          </td>
                          <td>
                            <p className="bg-violet-300 text-violet-800 px-1 rounded">
                              Added
                            </p>
                          </td>
                          <td
                            style={{
                              color:
                                calculatePnL(
                                  entry.buyPrice,
                                  entry.sellPrice,
                                  entry.quantity
                                ) > 0
                                  ? "green"
                                  : "red",
                              fontWeight: "bold",
                            }}
                          >
                            {FormatPnL(
                              calculatePnL(
                                entry.buyPrice,
                                entry.sellPrice,
                                entry.quantity
                              )
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end px-6 bg-teal-800 h-10 w-full">
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
