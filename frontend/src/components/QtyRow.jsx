import React from "react";
import { FaTrash } from "react-icons/fa6";
import formatDateTimeLocal from "../utils/formatDateTimeLocal";

function QtyRow({
  index,
  execution,
  onDelete,
  handleExecutionEntries,
  status,
  order,
}) {
  return (
    <div className="flex flex-col h-28 gap-2 border-b border-gray-300 dark:border-none">
      <div className="flex justify-between items-center px-4 rounded bg-teal-800 w-full h-5">
        <h1 className="text-white">{index}</h1>
        <button onClick={() => onDelete(index)} className="cursor-pointer">
          <FaTrash className="text-red-400 text-xs" />
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={execution.buy_price}
          disabled={status === "Open" && order === "SELL"}
          type="number"
          name="buy_price"
          className="add-modal-select h-6 placeholder:text-green-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          placeholder="Buy Price"
          onChange={(e) =>
            handleExecutionEntries(index, "buy_price", e.target.value)
          }
        />
        <input
          value={execution.sell_price}
          disabled={status === "Open" && order === "BUY"}
          type="number"
          name="sell_price"
          className="add-modal-select h-6 placeholder:text-red-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          placeholder="Sell Price"
          onChange={(e) =>
            handleExecutionEntries(index, "sell_price", e.target.value)
          }
        />
        <input
          required
          value={execution.quantity}
          type="number"
          name="quantity"
          className="add-modal-select h-6 placeholder:text-gray-400"
          placeholder="Quantity"
          onChange={(e) =>
            handleExecutionEntries(index, "quantity", e.target.value)
          }
        />
      </div>
      <div className="flex gap-2">
        <input
          required
          value={execution.risk}
          type="number"
          name="risk"
          className="add-modal-select mt-4 h-6 placeholder:text-gray-400"
          placeholder="risk"
          onChange={(e) =>
            handleExecutionEntries(index, "risk", e.target.value)
          }
        />
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Entry Time:
          </label>
          <input
            value={formatDateTimeLocal(execution.entry_time)}
            name="entry_time"
            type="datetime-local"
            className="add-modal-select h-6 mt-4 w-28 pl-1 uppercase text-xs"
            onChange={(e) =>
              handleExecutionEntries(
                index,
                "entry_time",
                new Date(e.target.value).toISOString(),
              )
            }
          />
        </div>
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Exit Time:
          </label>
          <input
            required
            disabled={status === "Open"}
            value={formatDateTimeLocal(execution.exit_time)}
            name="exit_time"
            type="datetime-local"
            className="add-modal-select h-6 mt-4 w-28 pl-1 text-xs uppercase disabled:bg-gray-300 dark:disabled:bg-gray-500"
            onChange={(e) =>
              handleExecutionEntries(
                index,
                "exit_time",
                new Date(e.target.value).toISOString(),
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(QtyRow);
