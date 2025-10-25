import { useContext, useEffect } from "react";
import "./tradestable.css";
import { GlobalContext } from "../../context/Context";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatDateTime from "../../utils/formatDateTime";

export default function TradesTable({ currentTrades, indexOfFirstTrade }) {
  const {
    setTrades,
    setCurrentViewTrade,
    setViewModal,
    setCurrentEditId,
    setFormData,
    setAddModal,
  } = useContext(GlobalContext);

  function orderColor(order) {
    if (order === "BUY") return "#03c988";
    if (order === "SELL") return "#ff7779ff";
    return "#fff";
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
        buyPrice: trade.formData.buyPrice,
        sellPrice: trade.formData.sellPrice,
        marketType: trade.formData.marketType,
        quantity: trade.formData.quantity,
        risk: trade.formData.risk,
        position: trade.formData.position,
        entryTime: trade.formData.entryTime,
        exitTime: trade.formData.exitTime,
        rating: trade.formData.rating,
        description: trade.formData.description,
      });
    } else {
      setCurrentEditId(null);
      setFormData({
        symbol: "",
        order: "",
        status: "",
        buyPrice: "",
        sellPrice: "",
        marketType: "",
        quantity: "",
        risk: "",
        position: "",
        orderTime: "",
        exitTime: "",
        rating: "",
        description: "",
      });
    }

    setAddModal(true);
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>symbol</th>
            <th>order</th>
            <th>status</th>
            <th>market-type</th>
            <th>quantity</th>
            <th>position</th>
            <th>entry Time</th>
            <th>risk/trade</th>
            <th>P&L (₹)</th>
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
                  <td>{indexOfFirstTrade + index + 1}</td>
                  <td id="symbol">{trade.formData.symbol}</td>
                  <td style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                    <p
                      style={{
                        border: `1px solid ${orderColor(trade.formData.order)}`,
                        color: orderColor(trade.formData.order),
                        borderRadius: "3px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                      }}
                    >
                      {trade.formData.order}
                    </p>
                  </td>
                  <td>{trade.formData.status}</td>
                  <td>{trade.formData.marketType}</td>
                  <td>{trade.formData.quantity}</td>

                  <td>
                    <p id="position">{trade.formData.position}</p>
                  </td>
                  <td style={{ color: "rgba(153, 0, 255, 1)" }}>
                    {formatDateTime(trade.formData.entryTime)}
                  </td>
                  <td>{trade.formData.risk}</td>
                  <td
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: trade.pnl >= 0 ? "green" : "red",
                    }}
                  >
                    {" "}
                    {trade.pnl > 0 && "+"}
                    {trade.formData.status === "Open" ? "-" : trade.pnl}
                    {trade.formData.status === "Open" ? "-" : "/-"}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {trade.formData.status === "Open" ? "-" : trade.rrRatio}
                    {trade.formData.status === "Open" ? "-" : "X"}
                  </td>
                  <td>{trade.formData.rating}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewEditTradeModal("edit", trade);
                      }}
                      className="edit-delete-btn"
                    >
                      <FaEdit className="edit-trade" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrade(trade.id);
                      }}
                      style={{
                        paddingLeft: "0.5rem",
                      }}
                      className="edit-delete-btn"
                    >
                      <FaTrash className="delete-trade" />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {currentTrades.length === 0 && (
        <div className="empty-msg">
          <h1>Nothing To Show! Please Add Trades</h1>
        </div>
      )}
    </div>
  );
}
