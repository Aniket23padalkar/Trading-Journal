import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Context";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatDateTime from "../../utils/formatDateTime";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

export default function TradesTable({ currentTrades, indexOfFirstTrade }) {
  const {
    setTrades,
    setCurrentViewTrade,
    setViewModal,
    setCurrentEditId,
    setFormData,
    setAddModal,
    setEntries,
    setFilterValue,
    filterValue,
  } = useContext(GlobalContext);

  function orderColor(order) {
    if (order === "BUY") return "#03c988";
    if (order === "SELL") return "#ff7779ff";
    return "#fff";
  }

  function handleFilterChange() {
    setFilterValue((prev) => ({
      ...prev,
      pnlSort:
        prev.pnlSort === "Desc"
          ? "Asc"
          : prev.pnlSort === "Asc"
          ? "Desc"
          : "Desc",
      dateTimeSort: "",
    }));
  }

  function handleDateTimeSort() {
    setFilterValue((prev) => ({
      ...prev,
      dateTimeSort:
        prev.dateTimeSort === "Desc"
          ? "Asc"
          : prev.dateTimeSort === "Asc"
          ? "Desc"
          : "Desc",
      pnlSort: "",
    }));
  }

  function handleViewModal(trade) {
    setCurrentViewTrade(trade);
    setViewModal(true);
  }

  function handleDeleteTrade(id) {
    setTrades((prevTrade) => prevTrade.filter((trade) => trade.id !== id));
  }

  function viewEditTradeModal(mode, trade) {
    if (mode === "edit") {
      setCurrentEditId(trade.id);
      setFormData({
        symbol: trade.formData.symbol,
        order: trade.formData.order,
        status: trade.formData.status,
        marketType: trade.formData.marketType,
        position: trade.formData.position,
        rating: trade.formData.rating,
        description: trade.formData.description,
      });
      setEntries({
        addedEntries: trade.entries.addedEntries,
        initialBuy: trade.entries.initialBuy,
        initialSell: trade.entries.initialSell,
        initialQty: trade.entries.initialQty,
        initialRisk: trade.entries.initialRisk,
        initialEntryTime: trade.entries.initialEntryTime,
        initialExitTime: trade.entries.initialExitTime,
      });
    } else {
      setCurrentEditId(null);
      setFormData({
        symbol: "",
        order: "",
        status: "",
        marketType: "",
        position: "",
        rating: "",
        description: "",
      });

      setEntries({
        addedEntries: [],
        initialBuy: "",
        initialSell: "",
        initialQty: "",
        initialRisk: "",
        initialEntryTime: "",
        initialExitTime: "",
      });
    }

    setAddModal(true);
  }

  return (
    <div className="flex h-full w-full items-center bg-transparent relative">
      <div className="w-full min-h-102 h shadow-md shadow-gray-400 dark:shadow-none overflow-x-auto scrollbar-thin-x">
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
                {filterValue.dateTimeSort === "Desc" ? (
                  <FaArrowDown />
                ) : filterValue.dateTimeSort === "Asc" ? (
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
                {filterValue.pnlSort === "Desc" ? (
                  <FaArrowDown />
                ) : filterValue.pnlSort === "Asc" ? (
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
            {currentTrades.length > 0 &&
              currentTrades.map((trade, index) => {
                return (
                  <tr key={trade.id} onClick={() => handleViewModal(trade)}>
                    <td className="bg-gray-200 dark:bg-gray-900">
                      {indexOfFirstTrade + index + 1}
                    </td>
                    <td className="text-left whitespace-nowrap w-30 font-medium text-base capitalize px-1 bg-gray-100 dark:bg-gray-800">
                      {trade.formData.symbol}
                    </td>
                    <td>
                      <p
                        className="text-xs px-1"
                        style={{
                          border: `1px solid ${orderColor(
                            trade.formData.order
                          )}`,
                          color: orderColor(trade.formData.order),
                          borderRadius: "3px",

                          fontWeight: 500,
                        }}
                      >
                        {trade.formData.order}
                      </p>
                    </td>
                    <td className="text-xs dark:text-gray-300">
                      {trade.formData.status}
                    </td>
                    <td className="dark:text-gray-300">
                      {trade.formData.marketType}
                    </td>
                    <td>{trade.stats.totalQty}</td>

                    <td>
                      <p className="text-xs bg-blue-100 dark:text-black dark:bg-blue-400 rounded">
                        {trade.formData.position}
                      </p>
                    </td>
                    <td className="text-xs text-blue-700 dark:text-sky-500 whitespace-nowrap">
                      {formatDateTime(trade.entries.initialEntryTime)}
                    </td>
                    <td>{trade.stats.avgRisk}</td>
                    <td
                      className={`text-sm font-bold ${
                        trade.stats.pnl >= 0
                          ? "text-green-600 dark:text-green-500"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {" "}
                      {trade.stats.pnl > 0 && "+"}
                      {trade.formData.status === "Open"
                        ? "-"
                        : Number(trade.stats.pnl).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      {trade.formData.status === "Open" ? "-" : "/-"}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {trade.formData.status === "Open"
                        ? "-"
                        : Number(trade.stats.avgRR).toFixed(1)}
                      {trade.formData.status === "Open" ? "-" : "X"}
                    </td>
                    <td>{trade.formData.rating}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewEditTradeModal("edit", trade);
                        }}
                        className="cursor-pointer bg-transparent"
                      >
                        <FaEdit className="text-blue-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrade(trade.id);
                        }}
                        className="cursor-pointer bg-transparent xl:pl-2"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {currentTrades.length === 0 && (
        <div className="flex items-center justify-center top-0 left-0 absolute h-full w-full">
          <h1>Nothing To Show! Please Add Trades</h1>
        </div>
      )}
    </div>
  );
}
