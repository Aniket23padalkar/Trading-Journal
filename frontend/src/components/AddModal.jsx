import { useContext, useEffect, useState } from "react";
import useDrag from "../hooks/useDrag";
import { FaExclamation } from "react-icons/fa6";
import ExecutionRow from "./ExecutionRow";
import QtyRow from "./QtyRow";
import { insertTrade, updateTrade } from "../services/tradesService";
import { toast } from "react-toastify";
import { TradeContext } from "../context/TradesContext";
import { MoonLoader } from "react-spinners";

export default function AddModal({ editTrade, setEditTrade, setAddModal }) {
  const { modalRef, handleMouseDown } = useDrag();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    order: "",
    status: "",
    marketType: "",
    position: "",
    rating: "",
    description: "",
  });
  const [execution, setExecution] = useState([
    {
      buyPrice: "",
      sellPrice: "",
      quantity: "",
      risk: "",
      entryTime: "",
      exitTime: "",
    },
  ]);
  const [executionModal, setExecutionModal] = useState(false);
  const { fetchTrades } = useContext(TradeContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleExecutionEntries(index, field, value) {
    setExecution((prev) =>
      prev.map((exe, i) => (i === index ? { ...exe, [field]: value } : exe)),
    );
  }

  function handleExecutionQtyModal() {
    setExecution((prev) => [
      ...prev,
      {
        buyPrice: "",
        sellPrice: "",
        quantity: "",
        risk: "",
        entryTime: "",
        exitTime: "",
      },
    ]);
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

    setExecution([
      {
        buyPrice: "",
        sellPrice: "",
        quantity: "",
        risk: "",
        entryTime: "",
        exitTime: "",
      },
    ]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (editTrade) {
      try {
        const res = await updateTrade(
          editTrade.trade.trade_id,
          formData,
          execution,
        );

        await fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        setExecutionModal(false);
        toast.success("Trade Updated Successfully!");
      } catch (err) {
        console.log(err.message);
        toast.error(err.message);
      }
    } else {
      try {
        const res = await insertTrade(formData, execution);

        await fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        setExecutionModal(false);
        setEditTrade(null);
        toast.success("Trade Added Successfullly");
      } catch (err) {
        console.log(err.message);
        toast.error(err.message);
        setLoading(false);
      }
    }
  }

  function handleCloseModal() {
    setAddModal(false);
    resetForm();
    setEditTrade(null);
    setExecutionModal(false);
  }

  function onDelete(index) {
    setExecution((prev) => prev.filter((_, i) => i !== index));
  }

  console.log(editTrade);

  useEffect(() => {
    if (editTrade) {
      setFormData({
        symbol: editTrade.trade.symbol || "",
        order: editTrade.trade.orderType || "",
        status: editTrade.trade.status || "",
        marketType: editTrade.trade.marketType || "",
        position: editTrade.trade.position || "",
        rating: editTrade.trade.rating || "",
        description: editTrade.trade.description || "",
      });

      setExecution(
        editTrade.executions?.length > 0
          ? editTrade.executions
          : [
              {
                buy_price: "",
                sell_price: "",
                quantity: "",
                risk: "",
                entry_time: "",
                exit_time: "",
              },
            ],
      );
    }
  }, [editTrade]);

  return (
    <div
      className="flex flex-col overflow-visible fixed inset-0 top-1/5 left-1/8 sm:top-1/5 sm:left-1/5 md:top-1/5 md:left-1/4 lg:top-1/4 lg:left-1/3 h-110 w-120 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
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
            <button
              type="button"
              onClick={() => setExecutionModal(true)}
              className="text-sm w-20 h-full self-end text-green-800 font-bold dark:shadow-none shadow shadow-gray-300 hover:bg-green-400 whitespace-nowrap bg-green-300 px-2 cursor-pointer rounded"
            >
              Add Qty
            </button>
          </div>
          {execution.length > 0 &&
            execution.map((exe, i) => {
              return (
                i === 0 && (
                  <ExecutionRow
                    key={i}
                    execution={exe}
                    formData={formData}
                    index={i}
                    handleExecutionEntries={handleExecutionEntries}
                  />
                )
              );
            })}

          {executionModal && (
            <div className="flex flex-col rounded-2xl absolute overflow-hidden right-14 top-0 lg:-right-90 z-10 h-full w-85 bg-white dark:shadow-none dark:bg-gray-800 shadow shadow-gray-500">
              <div className="flex items-center px-4 justify-between h-10 bg-teal-700">
                <h1 className="text-white text-shadow-lg">Add Quantity</h1>
                <button
                  onClick={handleExecutionQtyModal}
                  className="cursor-pointer hover:scale-105 bg-green-300 px-2 rounded text-sm font-bold text-teal-800"
                >
                  + Add
                </button>
              </div>
              <div className="flex-1 relative w-full p-2 overflow-y-auto">
                {execution.length > 1 &&
                  execution.map((exe, i) => {
                    if (i === 0) return null;
                    return (
                      <QtyRow
                        key={i}
                        execution={exe}
                        status={formData.status}
                        order={formData.order}
                        index={i}
                        onDelete={onDelete}
                        handleExecutionEntries={handleExecutionEntries}
                      />
                    );
                  })}
                {execution.length === 1 && (
                  <div className="flex items-center absolute justify-center h-full w-full left-0 top-0 text-xl text-blue-500 text-shadow-lg">
                    <h1>No added Qty!</h1>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center h-12">
                <button
                  onClick={() => setExecutionModal(false)}
                  className="px-8  bg-red-300 text-red-600 hover:bg-red-200 font-bold rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
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
            disabled={loading}
            type="submit"
            className="px-8 bg-teal-400 text-teal-800 hover:bg-teal-300 font-bold rounded"
          >
            {loading ? <MoonLoader /> : "Save"}
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
