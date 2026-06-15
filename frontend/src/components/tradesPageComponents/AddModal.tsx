import { useContext, useEffect, useState } from "react";
import useDrag from "../../hooks/useDrag.jsx";
import { FaExclamation } from "react-icons/fa6";
import ExecutionRow from "./ExecutionRow.js";
import QtyRow from "./QtyRow.js";
import { insertTrade, updateTrade } from "../../api/tradesService.js";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useTradesContext } from "../../hooks/useTradesContext.js";
import { getErrorMessage } from "../../utils/error.handler.js";
import type {
  ExecutionsType,
  ExecutionsUIType,
  FormDataType,
  FormDataUIType,
  HandleExecutionEntries,
  TradesData,
} from "../../types/trades.types.js";
import formatDateTimeLocal from "../../utils/formatDateTimeLocal.js";

interface AddModalParams {
  editTrade: TradesData;
  setEditTrade: React.Dispatch<React.SetStateAction<TradesData | null>>;
  setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddModal({
  editTrade,
  setEditTrade,
  setAddModal,
}: AddModalParams) {
  const { modalRef, handleMouseDown } = useDrag();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataUIType>({
    symbol: "",
    order_status: "",
    market_type: "",
    risk: "",
    position: "",
    direction: "",
    trade_rating: "",
    description: "",
    entry_time: "",
    exit_time: "",
  });
  const [executions, setExecutions] = useState<ExecutionsUIType[]>([
    {
      order_type: "",
      price: "",
      quantity: "",
      executed_at: "",
    },
  ]);
  const [executionModal, setExecutionModal] = useState(false);
  const { fetchTrades } = useTradesContext();

  const formDataPayload: FormDataType = {
    symbol: formData.symbol,
    order_status: formData.order_status || null,
    market_type: formData.market_type || null,
    risk: Number(formData.risk),
    position: formData.position || null,
    direction: formData.direction || null,
    trade_rating: formData.trade_rating || null,
    description: formData.description,
    entry_time: new Date(formData.entry_time),
    exit_time: !formData.exit_time ? null : new Date(formData.exit_time),
  };
  console.log(formDataPayload);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const target = e.target;
    const name = target.name as keyof FormDataUIType;
    let value: FormDataUIType[typeof name];

    if (target instanceof HTMLInputElement && target.type === "number") {
      value = Number(target.value) as FormDataUIType[typeof name];
    } else if (target instanceof HTMLInputElement && target.type === "date") {
      value = new Date(target.value) as FormDataUIType[typeof name];
    } else {
      value = target.value as FormDataUIType[typeof name];
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleExecutionEntries<T extends keyof ExecutionsUIType>({
    index,
    field,
    value,
  }: HandleExecutionEntries<T>) {
    setExecutions((prev) =>
      prev.map((exe, i) => (i === index ? { ...exe, [field]: value } : exe)),
    );
  }

  function handleExecutionQtyModal() {
    setExecutions((prev) => [
      ...prev,
      {
        order_type: "",
        price: "",
        quantity: "",
        executed_at: "",
      },
    ]);
  }

  function resetForm() {
    setFormData({
      symbol: "",
      order_status: "",
      market_type: "",
      risk: "",
      position: "",
      direction: "",
      trade_rating: "",
      description: "",
      entry_time: "",
      exit_time: "",
    });

    setExecutions([
      {
        order_type: "",
        price: "",
        quantity: "",
        executed_at: "",
      },
    ]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (editTrade) {
      try {
        const res = await updateTrade({
          trade_id: editTrade.trade.trade_id,
          formData: formDataPayload,
          executions,
        });

        fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        setExecutionModal(false);
        toast.success("Trade Updated Successfully!");
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        toast.error(message);
        console.log(err);
      }
    } else {
      try {
        const res = await insertTrade({
          formData: formDataPayload,
          executions,
        });

        fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        setExecutionModal(false);
        setEditTrade(null);
        toast.success("Trade Added Successfullly");
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        toast.error(message);
        console.log(err);
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

  function onDelete(index: number) {
    setExecutions((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    if (editTrade) {
      setFormData({
        symbol: editTrade.trade.symbol,
        order_status: editTrade.trade.order_status,
        market_type: editTrade.trade.market_type || "",
        position: editTrade.trade.position || "",
        trade_rating: editTrade.trade.trade_rating || "",
        risk: editTrade.trade.risk || "",
        direction: editTrade.trade.direction || "",
        description: editTrade.trade_logs.description || "",
        entry_time: editTrade.trade.entry_time || "",
        exit_time: editTrade.trade.exit_time || "",
      });

      setExecutions(
        editTrade.executions?.length > 0
          ? editTrade.executions
          : [
              {
                order_type: "",
                price: "",
                quantity: "",
                executed_at: "",
              },
            ],
      );
    }
  }, [editTrade]);

  return (
    <div
      className="flex flex-col overflow-visible fixed inset-0 top-1/6 left-1/8 sm:top-1/5 sm:left-1/5 md:top-1/5 md:left-1/4 lg:top-1/6 lg:left-1/3 h-120 w-140 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
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
                value={formData.direction}
                name="direction"
                className={`add-modal-select w-25  dark:border dark:border-teal-900 ${
                  formData.direction === "long"
                    ? "bg-green-300 text-green-700 dark:bg-green-400"
                    : formData.direction === "short"
                      ? "bg-red-300 text-red-700 dark:bg-red-400"
                      : "bg-violet-50 dark:bg-gray-800"
                }`}
                onChange={handleChange}
              >
                <option value="">Direction</option>
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
              <select
                onChange={handleChange}
                value={formData.order_status}
                required
                name="order_status"
                className="add-modal-select w-32"
              >
                <option value="">Order_Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
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
              <option value="intraday">Intraday</option>
              <option value="btst">BTST</option>
              <option value="stbt">STBT</option>
              <option value="swing">Swing</option>
              <option value="positional">Positional</option>
              <option value="longterm">Long-Term</option>
            </select>

            <select
              value={formData.market_type}
              required
              name="market_type"
              className="add-modal-select"
              onChange={handleChange}
            >
              <option value="">Market-Type</option>
              <option value="equity">Equity</option>
              <option value="options">Options</option>
              <option value="futures">Futures</option>
            </select>

            <select
              value={formData.trade_rating}
              required
              name="trade_rating"
              className="add-modal-select"
              onChange={handleChange}
            >
              <option value="">Trade-Rate</option>
              <option value="worst">Worst</option>
              <option value="poor">Poor</option>
              <option value="average">Average</option>
              <option value="good">Good</option>
              <option value="best">Best</option>
            </select>
            <button
              type="button"
              onClick={() => setExecutionModal(true)}
              className="text-sm w-20 h-full self-end text-green-800 font-bold dark:shadow-none shadow shadow-gray-300 hover:bg-green-400 whitespace-nowrap bg-green-300 px-2 cursor-pointer rounded"
            >
              Add Qty
            </button>
          </div>
          <div className="flex w-full gap-2">
            <input
              required
              value={formData.risk}
              name="risk"
              type="number"
              placeholder="Risk"
              className="add-modal-select h-7 text-black mt-4 dark:text-white"
              onChange={handleChange}
            />
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                Entry_time
              </label>
              <input
                value={formatDateTimeLocal(formData.entry_time)}
                name="entry_time"
                required
                type="datetime-local"
                className="add-modal-select h-7 mt-4 w-36 uppercase"
                onChange={handleChange}
              />
            </div>
            <div className="flex relative">
              <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                Exit Time:
              </label>
              <input
                value={formatDateTimeLocal(formData.exit_time)}
                name="exit_time"
                required
                disabled={formData.order_status === "open"}
                type="datetime-local"
                className="add-modal-select h-7 mt-4 w-36 disabled:bg-gray-300 dark:disabled:bg-gray-500 uppercase"
                onChange={handleChange}
              />
            </div>
          </div>
          {executions.length > 0 &&
            executions.map((exe, i) => {
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
                {executions.length > 1 &&
                  executions.map((exe, i) => {
                    if (i === 0) return null;
                    return (
                      <QtyRow
                        key={i}
                        execution={exe}
                        order_status={formData.order_status}
                        direction={formData.direction}
                        index={i}
                        onDelete={onDelete}
                        handleExecutionEntries={handleExecutionEntries}
                      />
                    );
                  })}
                {executions.length === 1 && (
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
            {loading ? <ClipLoader size={15} color="#000000" /> : "Save"}
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
