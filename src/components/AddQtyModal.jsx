import React, { useCallback } from "react";

import QtyRow from "./QtyRow";

function AddQtyModal({ onClose, addedEntries, setEntries, status, order }) {
  const handleDeleteAddQty = useCallback((id) => {
    const delAddQty = addedEntries.filter((entry) => entry.id !== id);

    setEntries((prev) => ({
      ...prev,
      addedEntries: delAddQty,
    }));
  });

  const handleAddEntries = useCallback((id, field, value) => {
    const updated = addedEntries.map((entry) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setEntries((prev) => ({
      ...prev,
      addedEntries: updated,
    }));
  });

  const handleAddQty = useCallback(() => {
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
  });

  return (
    <div className="flex flex-col rounded-2xl absolute overflow-hidden right-14 lg:-right-90 z-10 h-full w-85 bg-white dark:shadow-none dark:bg-gray-800 shadow shadow-gray-500">
      <div className="flex items-center px-4 justify-between h-10 bg-teal-700">
        <h1 className="text-white text-shadow-lg">Add Quantity</h1>
        <button
          onClick={handleAddQty}
          className="cursor-pointer hover:scale-105 bg-green-300 px-2 rounded text-sm font-bold text-teal-800"
        >
          + Add
        </button>
      </div>
      <div className="flex-1 relative w-full p-2 overflow-y-auto">
        {addedEntries.length > 0 &&
          addedEntries.map((entry, index) => (
            <QtyRow
              key={entry.id}
              index={index}
              entry={entry}
              onDelete={handleDeleteAddQty}
              onChange={handleAddEntries}
              status={status}
              order={order}
            />
          ))}
        {addedEntries.length === 0 && (
          <div className="flex items-center absolute justify-center h-full w-full left-0 top-0 text-xl text-blue-500 text-shadow-lg">
            <h1>No added Qty!</h1>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center h-12">
        <button
          onClick={() => onClose(false)}
          className="px-8  bg-red-300 text-red-600 hover:bg-red-200 font-bold rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default React.memo(AddQtyModal);
