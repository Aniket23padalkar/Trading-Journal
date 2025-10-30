import { useContext } from "react";
import "./addmodal.css";
import { GlobalContext } from "../../context/Context";
import calculatePnL from "../../utils/CalculatePnl";
import CalculateRRratio from "../../utils/CalculateRRratio";
import useDrag from "../../hooks/useDrag";

export default function AddModal() {
  const { modalRef, handleMouseDown } = useDrag();
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
    return "oklch(96.9% 0.016 293.756)";
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
    setCurrentEditId(null);
    resetForm();
    setAddModal(false);
  }

  function handleCloseModal() {
    setAddModal(false);
    resetForm();
    setCurrentEditId(null);
  }

  return (
    <div
      className="flex flex-col overflow-hidden fixed inset-0 top-1/4 left-1/3 h-100 w-120 z-10 bg-linear-to-b from-emerald-400 to-emerald-100 rounded-xl shadow shadow-gray-500"
      ref={modalRef}
    >
      <div
        className="w-full px-4 py-2 bg-teal-600 shadow select-none"
        onMouseDown={handleMouseDown}
      >
        <h1 className="text-white font-medium text-shadow-lg cursor-move">
          Input Trade Details
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-4 pb-0 gap-2">
          <div className="flex justify-between gap-2">
            <input
              name="symbol"
              value={formData.symbol}
              required
              className="add-modal-select flex-1 text-black"
              type="text"
              placeholder="Symbol"
              onChange={handleChange}
            />
            <div className="gap-2 flex">
              <select
                required
                value={formData.order}
                name="order"
                className="add-modal-select w-25"
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
                className="add-modal-select w-25"
              >
                <option value="">Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex w-full gap-2">
              <input
                value={formData.buyPrice}
                name="buyPrice"
                required
                disabled={
                  formData.status === "Open" && formData.order === "SELL"
                }
                className="add-modal-select w-36 text-black"
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
                className="add-modal-select w-36 text-black"
                type="number"
                placeholder="Sell Price"
                onChange={handleChange}
              />
            </div>
            <select
              value={formData.marketType}
              required
              name="marketType"
              className="add-modal-select"
              onChange={handleChange}
            >
              <option value="">Market-Type</option>
              <option value="Equity">Equity</option>
              <option value="Options">Options</option>
              <option value="Futures">Futures</option>
            </select>
          </div>

          <div className="flex w-full gap-2">
            <input
              required
              value={formData.quantity}
              name="quantity"
              type="number"
              placeholder="quantity"
              className="add-modal-select text-black"
              onChange={handleChange}
            />
            <input
              required
              value={formData.risk}
              name="risk"
              type="number"
              placeholder="Risk"
              className="add-modal-select text-black"
              onChange={handleChange}
            />
            <select
              required
              value={formData.position}
              name="position"
              onChange={handleChange}
              className="add-modal-select"
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

          <div className="w-full flex justify-between gap-2">
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                Entry Time:
              </label>
              <input
                value={formData.entryTime}
                name="entryTime"
                required
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36"
                onChange={handleChange}
              />
            </div>

            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                Exit Time:
              </label>
              <input
                value={formData.exitTime}
                name="exitTime"
                required
                disabled={formData.status === "Open"}
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36"
                onChange={handleChange}
              />
            </div>

            <select
              value={formData.rating}
              style={{ marginTop: "1rem" }}
              required
              name="rating"
              className="add-modal-select"
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
            placeholder="Describe this Trade...."
            onChange={handleChange}
            className="flex-1 text-black bg-violet-50 p-2 outline-none text-xs rounded shadow shadow-gray-500"
          ></textarea>
        </div>
        <div className="flex items-center justify-around gap-4 h-12 bg-transperant">
          <button
            type="submit"
            className="px-8 bg-teal-400 text-teal-800 hover:bg-teal-300 font-bold rounded"
          >
            Save
          </button>
          <button
            type="button"
            className="px-8  bg-red-300 text-red-600 hover:bg-red-200 font-bold rounded"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
