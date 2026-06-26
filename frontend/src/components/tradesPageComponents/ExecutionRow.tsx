import type {
  ExecutionsUIType,
  FormDataUIType,
  HandleExecutionEntries,
} from "../../types/trades.types.js";
import formatDateTimeLocal from "../../utils/formatDateTimeLocal.js";
import TrashIcon from "../../icons/TrashIcon.svg?react";

interface ExecutionRowParams {
  execution: ExecutionsUIType;
  formData: FormDataUIType;
  index: number;
  onDelete: (index: number) => void;
  handleExecutionEntries: ({
    index,
    field,
    value,
  }: HandleExecutionEntries<keyof ExecutionsUIType>) => void;
}

export default function ExecutionRow({
  execution,
  formData,
  handleExecutionEntries,
  index,
  onDelete,
}: ExecutionRowParams) {
  return (
    <>
      <div className="flex w-full gap-2 items-baseline">
        <span>{index + 1}</span>
        <input
          value={execution.price ?? ""}
          name="price"
          required
          className="add-modal-select w-30 disabled:bg-gray-300 dark:disabled:bg-gray-500 placeholder:text-purple-500"
          type="number"
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
          name="quantity"
          type="number"
          placeholder="Quantity"
          className="add-modal-select w-30 text-black dark:text-white"
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
          required
          className="add-modal-select"
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
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Executed_at
          </label>
          <input
            value={formatDateTimeLocal(execution.executed_at)}
            name="executed_at"
            required
            type="datetime-local"
            className="add-modal-select h-7 mt-4 w-34 uppercase"
            onChange={(e) =>
              handleExecutionEntries({
                index: index,
                field: "executed_at",
                value: new Date(e.target.value),
              })
            }
          />
        </div>

        {index > 0 && (
          <div className="flex items-center justify-center h-9">
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="cursor-pointer"
            >
              <TrashIcon
                height={17}
                width={17}
                className="text-red-400 text-xs"
              />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
