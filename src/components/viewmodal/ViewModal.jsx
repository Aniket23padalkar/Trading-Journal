import { useContext } from "react";
import "./viewmodal.css";
import { GlobalContext } from "../../context/Context";
import formatDateTime from "../../utils/formatDateTime";

export default function ViewModal() {
  const { setViewModal, currentViewTrade } = useContext(GlobalContext);

  function handleViewOrderColor() {
    if (currentViewTrade.formData.order === "BUY") return "#44ca80ff";
    if (currentViewTrade.formData.order === "SELL") return "#ff7779ff";
    return "white";
  }

  function handleRatingColor() {
    if (currentViewTrade.formData.rating === "Worst") return "red";
    if (currentViewTrade.formData.rating === "Poor") return "#ff787aff";
    if (currentViewTrade.formData.rating === "Average") return "#000000ff";
    if (currentViewTrade.formData.rating === "Good") return "#66c43bff";
    if (currentViewTrade.formData.rating === "Best") return "green";
    return "black";
  }

  return (
    <div className="view-modal-container">
      <div className="view-modal">
        <div className="view-modal-header">
          <h1>{currentViewTrade.formData.symbol}</h1>
          <span
            style={{ backgroundColor: handleViewOrderColor(), color: "white" }}
          >
            {currentViewTrade.formData.order}
          </span>
        </div>
        <div className="view-modal-content">
          <div className="view-content-container">
            <div className="section">
              <span>Buy-Price</span>
              <h1>{currentViewTrade.formData.buyPrice}</h1>
            </div>
            <div className="section">
              <span>Sell-Price</span>
              <h1>{currentViewTrade.formData.sellPrice}</h1>
            </div>
            <div className="section">
              <span>Status</span>
              <h1>{currentViewTrade.formData.status}</h1>
            </div>
            <div className="section">
              <span>Market-Type</span>
              <h1>{currentViewTrade.formData.marketType}</h1>
            </div>
          </div>

          <div className="view-content-container">
            <div className="section">
              <span>Quantity</span>
              <h1>{currentViewTrade.formData.quantity}</h1>
            </div>
            <div className="section">
              <span>Risk</span>
              <h1>{currentViewTrade.formData.risk}/-</h1>
            </div>
            <div className="section">
              <span>Position</span>
              <h1>{currentViewTrade.formData.position}</h1>
            </div>
            <div className="section">
              <span>Trade-Rating</span>
              <h1 style={{ color: handleRatingColor() }}>
                {currentViewTrade.formData.rating}
              </h1>
            </div>
          </div>

          <div className="view-content-container">
            <div className="section">
              <span>Entry-Time</span>
              <h1 style={{ color: "blue" }}>
                {formatDateTime(currentViewTrade.formData.entryTime)}
              </h1>
            </div>
            <div className="section">
              <span>PnL</span>
              <h1
                style={{
                  color: currentViewTrade.pnl >= 0 ? "green" : "red",
                  fontSize: "1rem",
                }}
              >
                {currentViewTrade.pnl}
              </h1>
            </div>
            <div className="section">
              <span>R:R Ratio</span>
              <h1>{currentViewTrade.rrRatio}X</h1>
            </div>
            <div className="section">
              <span>Exit-Time</span>
              <h1 style={{ color: "blue" }}>
                {formatDateTime(currentViewTrade.formData.exitTime)}
              </h1>
            </div>
          </div>
          <div className="trade-details">
            <span>
              <h1>Trade-Details : </h1>
              {currentViewTrade.formData.description}
            </span>
          </div>
        </div>
        <div className="close-view-modal">
          <button onClick={() => setViewModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}
