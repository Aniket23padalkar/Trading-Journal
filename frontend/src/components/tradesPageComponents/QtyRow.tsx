import React from "react";
import { FaTrash } from "react-icons/fa6";
import formatDateTimeLocal from "../../utils/formatDateTimeLocal.js";
import type {
  ExecutionsUIType,
  HandleExecutionEntries,
} from "../../types/trades.types.js";

interface QtyRowParams {
  index: number;
  execution: ExecutionsUIType;
  order_status: "open" | "closed" | "";
  direction: "long" | "short" | "";
  onDelete: (index: number) => void;
  handleExecutionEntries: ({
    index,
    field,
    value,
  }: HandleExecutionEntries<keyof ExecutionsUIType>) => void;
}

function QtyRow({
  index,
  execution,
  onDelete,
  handleExecutionEntries,
  order_status,
  direction,
}: QtyRowParams) {
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
          value={execution.price}
          type="number"
          name="price"
          className="add-modal-select h-6 placeholder:text-green-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          placeholder="Price"
          onChange={(e) =>
            handleExecutionEntries({
              index: index,
              field: "price",
              value: Number(e.target.value),
            })
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
            handleExecutionEntries({
              index: index,
              field: "quantity",
              value: Number(e.target.value),
            })
          }
        />
        <select
          name="order_type"
          className="add-modal-select h-6 text-sm pt-0 pl-1"
          id="order_type"
          value={execution.order_type}
          onChange={(e) =>
            handleExecutionEntries({
              index: index,
              field: "order_type",
              value: e.target.value as ExecutionsUIType["order_type"],
            })
          }
        >
          <option value="">Order-Type</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex items-center gap-2">
          <label className=" text-gray-600 text-sm dark:text-gray-400">
            Executed_at:-
          </label>
          <input
            value={formatDateTimeLocal(execution.executed_at)}
            name="executed_at"
            type="datetime-local"
            className="add-modal-select h-7 w-28 pl-1 uppercase text-xs"
            onChange={(e) =>
              handleExecutionEntries({
                index: index,
                field: "executed_at",
                value: new Date(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(QtyRow);
