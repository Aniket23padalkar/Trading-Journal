import { useContext, useMemo } from "react";
import { GlobalContext } from "../../context/Context";
import calculatePnL from "../../utils/CalculatePnl";
import CalculateRRratio from "../../utils/CalculateRRratio";
import useDrag from "../../hooks/useDrag";
import { FaTrash } from "react-icons/fa6";

export default function AddModal() {
  const { modalRef, handleMouseDown } = useDrag();
  const {
    trades,
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

  function handleInitialEntries(e) {
    const { name, value } = e.target;
    setEntries((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddQty() {
    setEntries((prev) => ({
      ...prev,
      addedEntries: [
        ...prev.addedEntries,
        {
          id: crypto.randomUUID(),
          buyPrice: "",
          sellPrice: "",
          quantity: "",
          risk: "",
          entryTime: "",
          exitTime: "",
        },
      ],
    }));
  }

  function handleAddEntries(id, field, value) {
    const updated = entries.addedEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries((prev) => ({
      ...prev,
      addedEntries: updated,
    }));
  }

  function handleDeleteAddQty(id) {
    const delAddQty = entries.addedEntries.filter((entry) => entry.id !== id);

    setEntries((prev) => ({
      ...prev,
      addedEntries: delAddQty,
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

  const { avgBuy, avgSell, totalQty, avgRisk } = useMemo(() => {
    const qty = Number(entries.initialQty) || 0;
    const risk = Number(entries.initialRisk) || 0;
    let totalBuy = 0;
    let totalSell = 0;

    const validEntry = entries.addedEntries.filter(
      (entry) =>
        entry.buyPrice !== "" &&
        entry.sellPrice !== "" &&
        entry.quantity !== "" &&
        entry.risk !== "" &&
        entry.entryTime !== ""
    );

    const totalCount = validEntry.length + 1;

    if (formData.status === "Open") {
      if (formData.order === "BUY") {
        totalBuy =
          (Number(entries.initialBuy) || 0) +
          entries.addedEntries.reduce(
            (acc, entry) => acc + (Number(entry.buyPrice) || 0),
            0
          );
      } else if (formData.order === "SELL") {
        totalSell =
          (Number(entries.initialSell) || 0) +
          entries.addedEntries.reduce(
            (acc, entry) => acc + (Number(entry.sellPrice) || 0),
            0
          );
      }
    } else {
      totalBuy =
        (Number(entries.initialBuy) || 0) +
        entries.addedEntries.reduce(
          (acc, entry) => acc + (Number(entry.buyPrice) || 0),
          0
        );
      totalSell =
        (Number(entries.initialSell) || 0) +
        entries.addedEntries.reduce(
          (acc, entry) => acc + (Number(entry.sellPrice) || 0),
          0
        );
    }

    const totalQty =
      qty +
      entries.addedEntries.reduce(
        (acc, entry) => acc + (Number(entry.quantity) || 0),
        0
      );

    const totalRisk =
      risk +
      entries.addedEntries.reduce(
        (acc, entry) => acc + Number(entry.risk) || 0,
        0
      );

    const avgBuy = totalCount > 0 ? totalBuy / totalCount : 0;
    const avgSell = totalCount > 0 ? totalSell / totalCount : 0;
    const avgRisk = totalCount > 0 ? totalRisk / totalCount : 0;

    return { avgBuy, avgSell, totalQty, avgRisk };
  }, [entries, formData.order, formData.status]);

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
      className="flex flex-col overflow-visible fixed inset-0 top-1/4 left-1/3 h-100 w-120 z-10 bg-white rounded-xl shadow shadow-gray-500"
      ref={modalRef}
    >
      <div
        className="w-full px-4 py-2 bg-teal-700 shadow select-none rounded-tl-2xl rounded-tr-2xl"
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
                value={entries.initialBuy}
                name="initialBuy"
                required
                disabled={
                  formData.status === "Open" && formData.order === "SELL"
                }
                className="add-modal-select w-30 text-black disabled:bg-gray-300"
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
                className="add-modal-select w-30 text-black disabled:bg-gray-300 "
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
              className="add-modal-select text-black"
              onChange={handleInitialEntries}
            />
            <button
              type="button"
              onClick={() => setAddQtyModal(true)}
              className="text-sm text-green-800 font-bold shadow shadow-gray-300 hover:bg-green-400 whitespace-nowrap bg-green-300 px-2 cursor-pointer rounded"
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
              className="add-modal-select text-black mt-4"
              onChange={handleInitialEntries}
            />
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                Entry Time:
              </label>
              <input
                value={entries.initialEntryTime}
                name="initialEntryTime"
                required
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36"
                onChange={handleInitialEntries}
              />
            </div>
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                Exit Time:
              </label>
              <input
                value={entries.initialExitTime}
                name="initialExitTime"
                required
                disabled={formData.status === "Open"}
                type="datetime-local"
                className="add-modal-select h-8 mt-4 w-36 disabled:bg-gray-300"
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

          <textarea
            value={formData.description}
            name="description"
            placeholder="Describe this Trade...."
            onChange={handleChange}
            className="flex-1 text-black bg-violet-50 p-2 outline-none text-xs rounded shadow shadow-gray-300"
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

      {addQtyModal && (
        <div className="flex flex-col rounded-2xl absolute overflow-hidden -right-90 z-10 h-full w-85 bg-white shadow shadow-gray-500">
          <div className="flex items-center px-4 justify-between h-10 bg-teal-700">
            <h1 className="text-white text-shadow-lg">Add Quantity</h1>
            <button
              onClick={handleAddQty}
              className="cursor-pointer hover:scale-105 bg-green-300 px-2 rounded text-sm font-bold text-teal-800"
            >
              + Add
            </button>
          </div>
          <div className="flex-1 w-full p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {entries.addedEntries.length > 0 &&
              entries.addedEntries.map((entry, index) => {
                return (
                  <div
                    key={entry.id}
                    className="flex flex-col h-28 gap-2 border-b border-gray-300"
                  >
                    <div className="flex justify-between items-center px-4 rounded bg-teal-800 w-full h-5">
                      <h1 className="text-white">{index + 1}</h1>
                      <button
                        onClick={() => handleDeleteAddQty(entry.id)}
                        className="cursor-pointer"
                      >
                        <FaTrash className="text-red-400 text-xs" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={entry.buyPrice}
                        disabled={
                          formData.status === "Open" &&
                          formData.order === "SELL"
                        }
                        type="number"
                        name="buyPrice"
                        className="add-modal-select h-6 placeholder:text-gray-400 disabled:bg-gray-300"
                        placeholder="Buy Price"
                        onChange={(e) =>
                          handleAddEntries(entry.id, "buyPrice", e.target.value)
                        }
                      />
                      <input
                        value={entry.sellPrice}
                        disabled={
                          formData.status === "Open" && formData.order === "BUY"
                        }
                        type="number"
                        name="sellPrice"
                        className="add-modal-select h-6 placeholder:text-gray-400 disabled:bg-gray-300"
                        placeholder="Sell Price"
                        onChange={(e) =>
                          handleAddEntries(
                            entry.id,
                            "sellPrice",
                            e.target.value
                          )
                        }
                      />
                      <input
                        required
                        value={entry.quantity}
                        type="number"
                        name="quantity"
                        className="add-modal-select h-6 placeholder:text-gray-400"
                        placeholder="Quantity"
                        onChange={(e) =>
                          handleAddEntries(entry.id, "quantity", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        required
                        value={entry.risk}
                        type="number"
                        name="risk"
                        className="add-modal-select mt-4 h-6 placeholder:text-gray-400"
                        placeholder="risk"
                        onChange={(e) =>
                          handleAddEntries(entry.id, "risk", e.target.value)
                        }
                      />
                      <div className="flex relative">
                        <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                          Entry Time:
                        </label>
                        <input
                          value={entry.entryTime}
                          name="entryTime"
                          type="datetime-local"
                          className="add-modal-select h-6 mt-4 w-28 pl-1 uppercase text-xs"
                          onChange={(e) =>
                            handleAddEntries(
                              entry.id,
                              "entryTime",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex relative">
                        <label className="absolute text-xs z-10 top-0 left-0 text-gray-600">
                          Exit Time:
                        </label>
                        <input
                          required
                          disabled={formData.status === "Open"}
                          value={entry.exitTime}
                          name="exitTime"
                          type="datetime-local"
                          className="add-modal-select h-6 mt-4 w-28 pl-1 text-xs uppercase disabled:bg-gray-300"
                          onChange={(e) =>
                            handleAddEntries(
                              entry.id,
                              "exitTime",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            {entries.addedEntries.length === 0 && (
              <div className="flex items-center justify-center flex-1">
                <h1>No added Qty!</h1>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center h-12">
            <button
              onClick={() => setAddQtyModal(false)}
              className="px-8  bg-red-300 text-red-600 hover:bg-red-200 font-bold rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
