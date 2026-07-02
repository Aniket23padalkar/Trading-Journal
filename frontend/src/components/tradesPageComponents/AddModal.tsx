import { useEffect, useState } from "react";
import useDrag from "../../hooks/useDrag.js";
import ExecutionRow from "./ExecutionRow.js";
import { insertTrade, updateTrade } from "../../api/tradesService.js";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useTradesContext } from "../../hooks/useTradesContext.js";
import { getErrorMessage } from "../../utils/error.handler.js";
import type {
  EditTrade,
  Executions,
  ExecutionsUIType,
  FormDataUIType,
  HandleExecutionEntries,
} from "../../types/trades.types.js";
import formatDateTimeLocal from "../../utils/formatDateTimeLocal.js";
import getChangedFields from "../../utils/getChangedFields.js";
import Icon from "../../ui/Icon.js";

interface AddModalParams {
  editTrade: EditTrade | null;
  setEditTrade: React.Dispatch<React.SetStateAction<EditTrade | null>>;
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
  const [executions, setExecutions] = useState<
    ExecutionsUIType[] | Executions[]
  >([
    {
      order_type: "",
      price: "",
      quantity: "",
      executed_at: "",
    },
  ]);
  const { fetchTrades } = useTradesContext();

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
    } else if (
      target instanceof HTMLInputElement &&
      target.type === "datetime-local"
    ) {
      value = target.value
        ? (new Date(target.value) as FormDataUIType[typeof name])
        : null;
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
        const completeTrade = {
          ...formData,
          executions,
        };
        const changedFields = getChangedFields(editTrade, completeTrade);

        console.log(changedFields);

        const res = await updateTrade({
          trade_id: editTrade.trade_id,
          formData: changedFields,
        });

        fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        toast.success("Trade Updated Successfully!");
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        toast.error(message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await insertTrade({
          formData: {
            ...formData,
            exit_time: formData.exit_time ? formData.exit_time : null,
          },
          executions,
        });

        fetchTrades();

        console.log(res);
        resetForm();
        setAddModal(false);
        setEditTrade(null);
        toast.success("Trade Added Successfullly");
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        toast.error(message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleCloseModal() {
    setAddModal(false);
    resetForm();
    setEditTrade(null);
  }

  function onDelete(index: number) {
    setExecutions((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    if (editTrade) {
      setFormData({
        symbol: editTrade.symbol,
        order_status: editTrade.order_status,
        market_type: editTrade.market_type || "",
        position: editTrade.position || "",
        trade_rating: editTrade.trade_rating || "",
        risk: editTrade.risk || "",
        direction: editTrade.direction || "",
        description: editTrade.description || "",
        entry_time: editTrade.entry_time || "",
        exit_time: editTrade.exit_time || "",
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
      className="flex flex-col overflow-visible fixed inset-0 top-1/8 left-1/8 sm:top-1/5 sm:left-1/5 md:top-1/5 md:left-1/4 lg:top-1/8 lg:left-1/3 h-130 w-150 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
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
            <button
              type="button"
              onClick={handleExecutionQtyModal}
              className="text-sm w-20 h-7 self-end text-green-800 font-bold dark:shadow-none shadow shadow-gray-300 hover:bg-green-400 whitespace-nowrap bg-green-300 px-2 cursor-pointer rounded"
            >
              Add Qty
            </button>
          </div>
          <div className="overflow-y-auto max-h-35 pr-2 py-1">
            {executions.length > 0 &&
              executions.map((exe, i) => {
                return (
                  <ExecutionRow
                    key={i}
                    execution={exe}
                    formData={formData}
                    index={i}
                    onDelete={onDelete}
                    handleExecutionEntries={handleExecutionEntries}
                  />
                );
              })}
          </div>
          <div className=" flex-1 relative">
            <p className="flex items-center absolute right-0 text-xs font-medium text-gray-500">
              <Icon
                size={17}
                name="ExclamationIcon"
                stroke="currentColor"
                strokeWidth={0}
                className="text-red-500 text-sm"
              />
              Markup Supported
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
