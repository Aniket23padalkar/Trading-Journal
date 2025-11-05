import { useContext } from "react";
import { FaTrash } from "react-icons/fa6";
import { GlobalContext } from "../context/Context";

export default function AddQtyModal() {
  const { entries, setEntries, setAddQtyModal, formData } =
    useContext(GlobalContext);

  function handleDeleteAddQty(id) {
    const delAddQty = entries.addedEntries.filter((entry) => entry.id !== id);

    setEntries((prev) => ({
      ...prev,
      addedEntries: delAddQty,
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
        {entries.addedEntries.length > 0 &&
          entries.addedEntries.map((entry, index) => {
            return (
              <div
                key={entry.id}
                className="flex flex-col h-28 gap-2 border-b border-gray-300 dark:border-none"
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
                      formData.status === "Open" && formData.order === "SELL"
                    }
                    type="number"
                    name="buyPrice"
                    className="add-modal-select h-6 placeholder:text-green-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
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
                    className="add-modal-select h-6 placeholder:text-red-500 disabled:bg-gray-300 dark:disabled:bg-gray-500"
                    placeholder="Sell Price"
                    onChange={(e) =>
                      handleAddEntries(entry.id, "sellPrice", e.target.value)
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
                    <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                      Entry Time:
                    </label>
                    <input
                      value={entry.entryTime}
                      name="entryTime"
                      type="datetime-local"
                      className="add-modal-select h-6 mt-4 w-28 pl-1 uppercase text-xs"
                      onChange={(e) =>
                        handleAddEntries(entry.id, "entryTime", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex relative">
                    <label className="absolute text-xs z-10 top-0 left-0 text-gray-600 dark:text-gray-400">
                      Exit Time:
                    </label>
                    <input
                      required
                      disabled={formData.status === "Open"}
                      value={entry.exitTime}
                      name="exitTime"
                      type="datetime-local"
                      className="add-modal-select h-6 mt-4 w-28 pl-1 text-xs uppercase disabled:bg-gray-300 dark:disabled:bg-gray-500"
                      onChange={(e) =>
                        handleAddEntries(entry.id, "exitTime", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        {entries.addedEntries.length === 0 && (
          <div className="flex items-center absolute justify-center h-full w-full left-0 top-0 text-xl text-blue-500 text-shadow-lg">
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
  );
}
