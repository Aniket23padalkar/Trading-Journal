import formatDateTimeLocal from "../utils/formatDateTimeLocal";

export default function ExecutionRow({
  execution,
  formData,
  handleExecutionEntries,
  index,
}) {
  return (
    <>
      <div className="flex justify-between gap-2">
        <div className="flex w-full gap-2">
          <input
            value={execution.buy_price ?? ""}
            name="buy_price"
            required
            disabled={
              formData.status === "Open" && formData.order_type === "SELL"
            }
            className="add-modal-select w-30 disabled:bg-gray-300 dark:disabled:bg-gray-500 placeholder:text-green-500 placeholder:font-bold"
            type="number"
            placeholder="Buy Price"
            onChange={(e) =>
              handleExecutionEntries(index, "buy_price", e.target.value)
            }
          />
          <input
            value={execution.sell_price ?? ""}
            name="sell_price"
            required
            disabled={
              formData.status === "Open" && formData.order_type === "BUY"
            }
            className="add-modal-select w-30 disabled:bg-gray-300 placeholder:text-red-500 dark:disabled:bg-gray-500 placeholder:font-bold"
            type="number"
            placeholder="Sell Price"
            onChange={(e) =>
              handleExecutionEntries(index, "sell_price", e.target.value)
            }
          />
        </div>
        <input
          required
          value={execution.quantity ?? ""}
          name="quantity"
          type="number"
          placeholder="Quantity"
          className="add-modal-select text-black dark:text-white"
          onChange={(e) =>
            handleExecutionEntries(index, "quantity", e.target.value)
          }
        />
      </div>

      <div className="flex w-full gap-2">
        <input
          required
          value={execution.risk ?? ""}
          name="risk"
          type="number"
          placeholder="Risk"
          className="add-modal-select text-black mt-4 dark:text-white"
          onChange={(e) =>
            handleExecutionEntries(index, "risk", e.target.value)
          }
        />
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Entry Time:
          </label>
          <input
            value={formatDateTimeLocal(execution.entry_time) ?? ""}
            name="entry_time"
            required
            type="datetime-local"
            className="add-modal-select h-8 mt-4 w-36 uppercase"
            onChange={(e) =>
              handleExecutionEntries(index, "entry_time", e.target.value)
            }
          />
        </div>
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Exit Time:
          </label>
          <input
            value={formatDateTimeLocal(execution.exit_time) ?? ""}
            name="exit_time"
            required
            disabled={formData.status === "Open"}
            type="datetime-local"
            className="add-modal-select h-8 mt-4 w-36 disabled:bg-gray-300 dark:disabled:bg-gray-500 uppercase"
            onChange={(e) =>
              handleExecutionEntries(index, "exit_time", e.target.value)
            }
          />
        </div>
      </div>
    </>
  );
}
