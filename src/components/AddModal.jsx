import { useContext, useMemo } from "react";
import { GlobalContext } from "../context/Context";
import calculatePnL from "../utils/CalculatePnl";
import useDrag from "../hooks/useDrag";
import AddQtyModal from "./AddQtyModal";
import useCalculateStats from "../hooks/useCalculateStats";
import { FaExclamation } from "react-icons/fa6";

export default function AddModal() {
  const { modalRef, handleMouseDown } = useDrag();
  const {
    setTrades,
    setAddModal,
    formData,
    setFormData,
    currentEditId,
    setCurrentEditId,
    entries,
    setEntries,
    addQtyModal,
    setAddQtyModal,
  } = useContext(GlobalContext);
  const { avgBuy, avgSell, totalQty, avgRisk } = useCalculateStats(
    entries,
    formData
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleInitialEntries(e) {
    const { name, value } = e.target;
    setEntries((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
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

  function handleSubmit(e) {
    e.preventDefault();

    const invalidEntries =
      formData.status === "Closed"
        ? entries.addedEntries.some(
            (entry) =>
              !entry.buyPrice ||
              !entry.sellPrice ||
              !entry.quantity ||
              !entry.risk ||
              !entry.entryTime ||
              !entry.exitTime
          )
        : entries.addedEntries.some(
            (entry) => !entry.quantity || !entry.risk || !entry.entryTime
          );
    if (invalidEntries) {
      alert("Please fill all required Add Qty fields before saving");
      return;
    }

    const pnl = calculatePnL(avgBuy, avgSell, totalQty);

    const avgRR = avgRisk ? Number(pnl) / Number(avgRisk) : 0;

    const newTrade = {
      formData: { ...formData },
      entries: { ...entries },
      stats: {
        avgBuy: avgBuy,
        avgSell: avgSell,
        totalQty: totalQty,
        pnl: pnl,
        avgRisk: avgRisk,
        avgRR: avgRR,
      },
      id: currentEditId ? currentEditId : crypto.randomUUID(),
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
    setAddQtyModal(false);
  }

  function handleCloseModal() {
    setAddModal(false);
    resetForm();
    setCurrentEditId(null);
    setAddQtyModal(false);
  }

  return (
    <div
      className="flex flex-col overflow-visible fixed inset-0 top-1/6 left-1/6 lg:top-1/4 lg:left-1/3 h-110 w-120 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
      ref={modalRef}
    >
      <div
        className="w-full px-4 py-2 bg-teal-700 shadow select-none rounded-tl-xl rounded-tr-xl"
        onMouseDown={handleMouseDown}
      >
        <h1 className="text-white font-medium text-shadow-lg cursor-move">
          Input Trade Details
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col dark:border dark:border-gray-700 rounded-b-2xl "
      >
        <div className="flex flex-1 flex-col p-4 pb-0 gap-2">
          <div className="flex justify-between gap-2">
            <input
              name="symbol"
              value={formData.symbol}
              required
              className="add-modal-select flex-1 text-black dark:text-white"
              type="text"
              placeholder="Symbol"
              onChange={handleChange}
            />
            <div className="gap-2 flex">
              <select
                required
                value={formData.order}
                name="order"
                className={`add-modal-select w-25  dark:border dark:border-teal-900 ${
                  formData.order === "BUY"
                    ? "bg-green-400 text-white dark:bg-green-400"
                    : formData.order === "SELL"
                    ? "bg-red-400 text-white dark:bg-red-400"
                    : "bg-violet-50 dark:bg-gray-800"
                }`}
                onChange={handleChange}
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
                value={entries.initialBuy}
                name="initialBuy"
                required
                disabled={
                  formData.status === "Open" && formData.order === "SELL"
                }
                className="add-modal-select w-30 disabled:bg-gray-300 dark:disabled:bg-gray-500 placeholder:text-green-500 placeholder:font-bold"
                type="number"
                placeholder="Buy Price"
                onChange={handleInitialEntries}
              />
              <input
                value={entries.initialSell}
                name="initialSell"
                required
                disabled={
                  formData.status === "Open" && formData.order === "BUY"
                }
                className="add-modal-select w-30 disabled:bg-gray-300 placeholder:text-red-500 dark:disabled:bg-gray-500 placeholder:font-bold"
                type="number"
                placeholder="Sell Price"
                onChange={handleInitialEntries}
              />
            </div>
            <input
              required
              value={entries.initialQty}
              name="initialQty"
              type="number"
              placeholder="Quantity"
              className="add-modal-select text-black dark:text-white"
              onChange={handleInitialEntries}
            />
            <button
              type="button"
              onClick={() => setAddQtyModal(true)}
              className="text-sm text-green-800 font-bold dark:shadow-none shadow shadow-gray-300 hover:bg-green-400 whitespace-nowrap bg-green-300 px-2 cursor-pointer rounded"
            >
              Add Qty
            </button>
          </div>

          <div className="flex w-full gap-2">
            <input
              required
              value={entries.initialRisk}
              name="initialRisk"
              type="number"
              placeholder="Risk"
              className="add-modal-select text-black mt-4 dark:text-white"
              onChange={handleInitialEntries}
            />
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                Entry Time:
              </label>
              <input
                value={entries.initialEntryTime}
                name="initialEntryTime"
                required
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36 uppercase"
                onChange={handleInitialEntries}
              />
            </div>
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                Exit Time:
              </label>
              <input
                value={entries.initialExitTime}
                name="initialExitTime"
                required
                disabled={formData.status === "Open"}
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36 disabled:bg-gray-300 dark:disabled:bg-gray-500 uppercase"
                onChange={handleInitialEntries}
              />
            </div>
          </div>

          <div className="w-full flex justify-between gap-2">
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

            <select
              value={formData.rating}
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

          <div className=" flex-1 relative">
            <p className="flex items-center absolute right-0 text-xs font-medium text-gray-500">
              <FaExclamation className="text-red-500 text-sm" />
              To style use #, **Bold** - List item {">"} Quote
            </p>
            <textarea
              value={formData.description}
              name="description"
              placeholder="Describe this Trade...."
              onChange={handleChange}
              className="h-full w-full text-black pt-4  bg-violet-50 dark:bg-transparent dark:border dark:border-teal-900 dark:text-white dark:shadow-none p-2 outline-none text-sm rounded shadow shadow-gray-300"
            ></textarea>
          </div>
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
      {addQtyModal && <AddQtyModal />}
    </div>
  );
}
