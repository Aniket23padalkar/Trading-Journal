import React, { useCallback, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatDateTime from "../../utils/formatDateTime.js";
import type { TradesData } from "../../types/trades.types.js";
import { useTradesContext } from "../../hooks/useTradesContext.js";

interface TradeRowParams {
  trade: TradesData;
  index: number;
  handleSetEditTrade: (trade: TradesData) => void;
  handleDeleteTrade: (trade_id: string) => void;
  setCurrentViewTrade: React.Dispatch<React.SetStateAction<TradesData>>;
  handleSetViewModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function TradeRow({
  trade,
  index,
  handleSetEditTrade,
  handleDeleteTrade,
  setCurrentViewTrade,
  handleSetViewModal,
}: TradeRowParams) {
  const { pagination } = useTradesContext();
  const handleViewModal = useCallback(() => {
    setCurrentViewTrade(trade);
    handleSetViewModal((prev) => !prev);
  }, [[trade, setCurrentViewTrade, handleSetViewModal]]);

  console.log(pagination);

  const startIndex = (pagination.page - 1) * pagination.limit;
  return (
    <tr onClick={handleViewModal}>
      <td className="bg-gray-200 dark:bg-gray-900">{startIndex + index + 1}</td>
      <td className="text-left whitespace-nowrap w-30 font-medium text-base capitalize px-1 bg-gray-100 dark:bg-gray-800">
        {trade.trade.symbol}
      </td>
      <td>
        <p
          className={`text-xs px-1 border rounded font-medium ${
            trade.trade.direction === "long"
              ? "text-[#03c988] border-[#03c988]"
              : trade.trade.direction === "short"
                ? "text-[#ff7779ff] border-[#ff7779ff] "
                : "text-white"
          }`}
        >
          {trade.trade.direction}
        </p>
      </td>
      <td className="text-xs dark:text-gray-300">{trade.trade.order_status}</td>
      <td className="dark:text-gray-300">{trade.trade.market_type}</td>
      <td>{trade.stats.total_qty}</td>

      <td>
        <p className="text-xs bg-blue-100 dark:text-black dark:bg-blue-400 rounded">
          {trade.trade.position}
        </p>
      </td>
      <td className="text-xs text-blue-700 dark:text-sky-500 whitespace-nowrap">
        {formatDateTime(trade.trade.entry_time)}
      </td>
      <td>{trade.trade.risk}</td>
      <td
        className={`text-sm font-bold ${
          trade.stats.pnl >= 0
            ? "text-green-600 dark:text-green-500"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {" "}
        {trade.stats.pnl > 0 && "+"}
        {trade.trade.order_status === "open"
          ? "-"
          : Number(trade.stats.pnl).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        {trade.trade.order_status === "open" ? "-" : "/-"}
      </td>
      <td style={{ fontWeight: 600 }}>
        {trade.trade.order_status === "open"
          ? "-"
          : Number(trade.stats.rr_ratio).toFixed(1)}
        {trade.trade.order_status === "open" ? "-" : "X"}
      </td>
      <td>{trade.trade.trade_rating}</td>
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
            handleDeleteTrade(trade.trade.trade_id);
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
