import { useContext, useEffect } from "react";
import "./trades.css";
import { GlobalContext } from "../../context/Context";
import AddModal from "../../components/addmodal/AddModal";
import { FaEdit, FaFilter, FaTrash } from "react-icons/fa";
import ViewModal from "../../components/viewmodal/ViewModal";

import Filters from "../../components/filters/Filters";
import Pagination from "../../components/pagination/Pagination";

export default function Trades() {
  const {
    trades,
    addModal,
    setAddModal,
    setTrades,
    setCurrentEditId,
    setFormData,
    viewModal,
    setViewModal,
    setCurrentViewTrade,
    formatDateTime,
    calculatePnL,
    calculateRRratio,
    currentPage,
    viewFilters,
    setViewFilters,
    filteredTrades,
    setFilteredTrades,
    filterValue,
    setCurrentPage,
  } = useContext(GlobalContext);

  const tradesPerPage = 5;

  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;

  const currentTrades = filteredTrades.slice(
    indexOfFirstTrade,
    indexOfLastTrade
  );

  function orderColor(order) {
    if (order === "BUY") return "#ade494ff";
    if (order === "SELL") return "#ee8486ff";
    return "white";
  }

  useEffect(() => {
    let filtered = trades;

    if (filterValue.order !== "") {
      filtered = filtered.filter(
        (item) => item.formData.order === filterValue.order
      );
    }
    if (filterValue.status !== "") {
      filtered = filtered.filter(
        (item) => item.formData.status === filterValue.status
      );
    }
    if (filterValue.marketType !== "") {
      filtered = filtered.filter(
        (item) => item.formData.marketType === filterValue.marketType
      );
    }
    if (filterValue.position !== "") {
      filtered = filtered.filter(
        (item) => item.formData.position === filterValue.position
      );
    }
    if (filterValue.fromDate && filterValue.toDate) {
      const start = new Date(filterValue.fromDate);
      const end = new Date(filterValue.toDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const entry = new Date(item.formData.entryTime);

        return entry >= start && entry <= end;
      });
    }

    setCurrentPage(1);
    setFilteredTrades(filtered);
  }, [filterValue, trades]);

  function handleDeleteTrade(id) {
    setTrades((prevTrade) => prevTrade.filter((trade) => trade.id !== id));
  }

  function handleViewModal(trade) {
    setCurrentViewTrade(trade);
    setViewModal(true);
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
    <div className="trades-container">
      {addModal && <AddModal />}
      {viewModal && <ViewModal />}
      <div className="header">
        {viewFilters && <Filters />}
        <button id="filter-btn" onClick={() => setViewFilters(!viewFilters)}>
          <FaFilter size={12} /> <span>Filters</span>
        </button>

        <button onClick={() => setAddModal(true)} id="add-btn">
          + Add
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>symbol</th>
              <th>order</th>
              <th>status</th>
              <th>market-type</th>
              <th>quantity</th>
              <th>position</th>
              <th>entry/exit Time</th>
              <th>risk/trade</th>
              <th>P&L (₹)</th>
              <th>R:R Ratio</th>
              <th>rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.length > 0 &&
              currentTrades.map((trade) => {
                return (
                  <tr key={trade.id} onClick={() => handleViewModal(trade)}>
                    <td id="symbol">{trade.formData.symbol}</td>
                    <td
                      style={{
                        backgroundColor: orderColor(trade.formData.order),
                      }}
                    >
                      {trade.formData.order}
                    </td>
                    <td>{trade.formData.status}</td>
                    <td>{trade.formData.marketType}</td>
                    <td>{trade.formData.quantity}</td>

                    <td>{trade.formData.position}</td>
                    <td
                      style={{
                        color: "blue",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {formatDateTime(trade.formData.entryTime)}
                      <small style={{ fontSize: "0.8rem" }}>
                        {formatDateTime(trade.formData.exitTime)}
                      </small>
                    </td>
                    <td>{trade.formData.risk}</td>
                    <td
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: trade.pnl >= 0 ? "green" : "red",
                      }}
                    >
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
      <Pagination totalPages={totalPages} currentTrades={currentTrades} />
    </div>
  );
}
