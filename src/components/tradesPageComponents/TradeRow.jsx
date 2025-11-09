import React, { useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatDateTime from "../../utils/formatDateTime";

function TradeRow({
  trade,
  index,
  indexOfFirstTrade,
  handleSetEditTrade,
  handleDeleteTrade,
  setCurrentViewTrade,
  handleSetViewModal,
}) {
  const handleViewModal = useCallback(() => {
    setCurrentViewTrade(trade);
    handleSetViewModal(true);
  }, [[trade, setCurrentViewTrade, handleSetViewModal]]);
  return (
    <tr onClick={handleViewModal}>
      <td className="bg-gray-200 dark:bg-gray-900">
        {indexOfFirstTrade + index + 1}
      </td>
      <td className="text-left whitespace-nowrap w-30 font-medium text-base capitalize px-1 bg-gray-100 dark:bg-gray-800">
        {trade.formData.symbol}
      </td>
      <td>
        <p
          className={`text-xs px-1 border rounded font-medium ${
            trade.formData.order === "BUY"
              ? "text-[#03c988] border-[#03c988]"
              : trade.formData.order === "SELL"
              ? "text-[#ff7779ff] border-[#ff7779ff] "
              : "text-white"
          }`}
        >
          {trade.formData.order}
        </p>
      </td>
      <td className="text-xs dark:text-gray-300">{trade.formData.status}</td>
      <td className="dark:text-gray-300">{trade.formData.marketType}</td>
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
            handleSetEditTrade(trade);
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
}
export default React.memo(TradeRow);
