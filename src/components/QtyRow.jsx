import React from "react";
import { FaTrash } from "react-icons/fa6";

function QtyRow({ index, entry, onDelete, onChange, status, order }) {
  return (
    <div className="flex flex-col h-28 gap-2 border-b border-gray-300 dark:border-none">
      <div className="flex justify-between items-center px-4 rounded bg-teal-800 w-full h-5">
        <h1 className="text-white">{index + 1}</h1>
        <button onClick={() => onDelete(entry.id)} className="cursor-pointer">
          <FaTrash className="text-red-400 text-xs" />
        </button>
      </div>
      <div className="flex gap-2">
        <input
          value={entry.buyPrice}
          disabled={status === "Open" && order === "SELL"}
          type="number"
          name="buyPrice"
          className="add-modal-select h-6 placeholder:text-green-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          placeholder="Buy Price"
          onChange={(e) => onChange(entry.id, "buyPrice", e.target.value)}
        />
        <input
          value={entry.sellPrice}
          disabled={status === "Open" && order === "BUY"}
          type="number"
          name="sellPrice"
          className="add-modal-select h-6 placeholder:text-red-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
          placeholder="Sell Price"
          onChange={(e) => onChange(entry.id, "sellPrice", e.target.value)}
        />
        <input
          required
          value={entry.quantity}
          type="number"
          name="quantity"
          className="add-modal-select h-6 placeholder:text-gray-400"
          placeholder="Quantity"
          onChange={(e) => onChange(entry.id, "quantity", e.target.value)}
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
          onChange={(e) => onChange(entry.id, "risk", e.target.value)}
        />
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Entry Time:
          </label>
          <input
            value={entry.entryTime}
            name="entryTime"
            type="datetime-local"
            className="add-modal-select h-6 mt-4 w-28 pl-1 uppercase text-xs"
            onChange={(e) => onChange(entry.id, "entryTime", e.target.value)}
          />
        </div>
        <div className="flex relative">
          <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
            Exit Time:
          </label>
          <input
            required
            disabled={status === "Open"}
            value={entry.exitTime}
            name="exitTime"
            type="datetime-local"
            className="add-modal-select h-6 mt-4 w-28 pl-1 text-xs uppercase disabled:bg-gray-300 dark:disabled:bg-gray-500"
            onChange={(e) => onChange(entry.id, "exitTime", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(QtyRow);
