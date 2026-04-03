import React, { useCallback, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatDateTime from "../../utils/formatDateTime";
import { TradeContext } from "../../context/TradesContext";

function TradeRow({
  t,
  index,
  handleSetEditTrade,
  handleDeleteTrade,
  setCurrentViewTrade,
  handleSetViewModal,
}) {
  const { pagination } = useContext(TradeContext);
  const handleViewModal = useCallback(() => {
    setCurrentViewTrade(t);
    handleSetViewModal(true);
  }, [[t, setCurrentViewTrade, handleSetViewModal]]);

  const startIndex = (pagination.page - 1) * pagination.limit;
  return (
    <tr onClick={handleViewModal}>
      <td className="bg-gray-200 dark:bg-gray-900">{startIndex + index + 1}</td>
      <td className="text-left whitespace-nowrap w-30 font-medium text-base capitalize px-1 bg-gray-100 dark:bg-gray-800">
        {t.trade.symbol}
      </td>
      <td>
        <p
          className={`text-xs px-1 border rounded font-medium ${
            t.trade.order_type === "BUY"
              ? "text-[#03c988] border-[#03c988]"
              : t.trade.order_type === "SELL"
                ? "text-[#ff7779ff] border-[#ff7779ff] "
                : "text-white"
          }`}
        >
          {t.trade.order_type}
        </p>
      </td>
      <td className="text-xs dark:text-gray-300">{t.trade.status}</td>
      <td className="dark:text-gray-300">{t.trade.market_type}</td>
      <td>{t.stats.totalQty}</td>

      <td>
        <p className="text-xs bg-blue-100 dark:text-black dark:bg-blue-400 rounded">
          {t.trade.position}
        </p>
      </td>
      <td className="text-xs text-blue-700 dark:text-sky-500 whitespace-nowrap">
        {formatDateTime(t.executions[0].entry_time)}
      </td>
      <td>{t.stats.avgRisk}</td>
      <td
        className={`text-sm font-bold ${
          t.stats.pnl >= 0
            ? "text-green-600 dark:text-green-500"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {" "}
        {t.stats.pnl > 0 && "+"}
        {t.trade.status === "Open"
          ? "-"
          : Number(t.stats.pnl).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        {t.trade.status === "Open" ? "-" : "/-"}
      </td>
      <td style={{ fontWeight: 600 }}>
        {t.trade.status === "Open" ? "-" : Number(t.stats.avgRR).toFixed(1)}
        {t.trade.status === "Open" ? "-" : "X"}
      </td>
      <td>{t.trade.rating}</td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSetEditTrade(t);
          }}
          className="cursor-pointer bg-transparent"
        >
          <FaEdit className="text-blue-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTrade(t.trade.trade_id);
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
