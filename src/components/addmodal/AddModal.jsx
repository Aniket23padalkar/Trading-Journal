import { useContext } from "react";
import "./addmodal.css";
import { GlobalContext } from "../../context/Context";
import calculatePnL from "../../utils/CalculatePnl";
import CalculateRRratio from "../../utils/CalculateRRratio";

export default function AddModal() {
  const {
    setTrades,
    setAddModal,
    formData,
    setFormData,
    currentEditId,
    setCurrentEditId,
  } = useContext(GlobalContext);

  const orderSideColor = () => {
    if (formData.order === "BUY") return "#03c988";
    if (formData.order === "SELL") return "#ff7779ff";
    return "#fff";
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
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
      entryTime: "",
      exitTime: "",
      rating: "",
      description: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const pnl = calculatePnL(
      formData.buyPrice,
      formData.sellPrice,
      formData.quantity
    );

    const rrRatio = CalculateRRratio(formData);

    const newTrade = {
      formData: { ...formData },
      pnl,
      rrRatio,
      id: currentEditId ? currentEditId : Date.now(),
    };

    if (currentEditId) {
      setTrades((prev) =>
        prev.map((trade) => (trade.id === currentEditId ? newTrade : trade))
      );
    } else {
      setTrades((prev) => [...prev, newTrade]);
    }
    resetForm();
    setAddModal(false);
  }

  function handleCloseModal() {
    setAddModal(false);
    resetForm();
    setCurrentEditId(null);
  }

  return (
    <div className="add-modal-container">
      <div className="add-modal">
        <div className="add-modal-header">
          <h1>Input Trade Details</h1>
          <button onClick={handleCloseModal} id="close-add-modal">
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <div className="first-row">
            <input
              name="symbol"
              value={formData.symbol}
              required
              className="input"
              type="text"
              placeholder="Symbol"
              onChange={handleChange}
            />
            <div className="select-container">
              <select
                required
                value={formData.order}
                name="order"
                className="select"
                onChange={handleChange}
                style={{
                  backgroundColor: orderSideColor(),
                  color: formData.order && "#fff",
                }}
              >
                <option value="">Order</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              <select
                onChange={handleChange}
                value={formData.status}
                required
                name="status"
                className="select"
              >
                <option value="">Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="second-row">
            <div className="price">
              <input
                value={formData.buyPrice}
                name="buyPrice"
                required
                disabled={
                  formData.status === "Open" && formData.order === "SELL"
                }
                className="price-input"
                type="number"
                placeholder="Buy Price"
                onChange={handleChange}
              />
              <input
                value={formData.sellPrice}
                name="sellPrice"
                required
                disabled={
                  formData.status === "Open" && formData.order === "BUY"
                }
                className="price-input"
                type="number"
                placeholder="Sell Price"
                onChange={handleChange}
              />
            </div>
            <select
              value={formData.marketType}
              required
              name="marketType"
              className="select market-type"
              onChange={handleChange}
            >
              <option value="">Market-Type</option>
              <option value="Equity">Equity</option>
              <option value="Options">Options</option>
              <option value="Futures">Futures</option>
            </select>
          </div>

          <div className="third-row">
            <input
              required
              value={formData.quantity}
              name="quantity"
              type="number"
              placeholder="quantity"
              className="price-input"
              onChange={handleChange}
            />
            <input
              required
              value={formData.risk}
              name="risk"
              type="number"
              placeholder="Risk"
              className="price-input"
              onChange={handleChange}
            />
            <select
              required
              value={formData.position}
              name="position"
              onChange={handleChange}
              className="select market-type"
            >
              <option value="">Position</option>
              <option value="Intraday">Intraday</option>
              <option value="BTST">BTST</option>
              <option value="STBT">STBT</option>
              <option value="Swing">Swing</option>
              <option value="Positional">Positional</option>
              <option value="Long-Term">Long-Term</option>
            </select>
          </div>

          <div className="fourth-row">
            <div className="entry-time">
              <label>Entry Time:</label>
              <input
                value={formData.entryTime}
                name="entryTime"
                required
                type="datetime-local"
                className="price-input date-time"
                onChange={handleChange}
              />
            </div>

            <div className="exit-time">
              <label>Exit Time:</label>
              <input
                value={formData.exitTime}
                name="exitTime"
                required
                disabled={formData.status === "Open"}
                type="datetime-local"
                className="price-input date-time"
                onChange={handleChange}
              />
            </div>

            <select
              value={formData.rating}
              style={{ marginTop: "1rem" }}
              required
              name="rating"
              className="select market-type"
              onChange={handleChange}
            >
              <option value="">Trade-Rate</option>
              <option value="Worst">Worst</option>
              <option value="Poor">Poor</option>
              <option value="Average">Average</option>
              <option value="Good">Good</option>
              <option value="Best">Best</option>
            </select>
          </div>

          <textarea
            value={formData.description}
            name="description"
            id="description"
            placeholder="Describe this Trade...."
            onChange={handleChange}
          ></textarea>
          <button id="save-btn">Save</button>
        </form>
      </div>
    </div>
  );
}
