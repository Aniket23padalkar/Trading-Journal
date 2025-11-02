import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

export default function Pagination({ totalPages, currentTrades }) {
  const { currentPage, setCurrentPage } = useContext(GlobalContext);

  const maxVisible = 3;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center h-10 p-0.5 px-2 rounded-xl bg-white">
      <button
        className={`flex items-center ${
          currentPage === 1 || currentTrades.length === 0
            ? " text-gray-500 "
            : "text-black hover:scale-110 cursor-pointer"
        }`}
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1 || currentTrades.length === 0}
      >
        <FaChevronLeft />
        <p>Prev</p>
      </button>
      <div className="flex items-center justify-center gap-2 min-w-[300px]">
        {start > 1 && (
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center justify-center text-black h-5 w-5 cursor-pointer hover:scale-105 rounded text-sm font-medium"
          >
            1
          </button>
        )}
        {start > 2 && <span>....</span>}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`flex items-center justify-center text-black h-5 w-5 cursor-pointer rounded text-sm font-medium ${
              currentPage === page
                ? "bg-black text-white scale-120 border border-black"
                : "hover:scale-105"
            }`}
          >
            {page}
          </button>
        ))}
        {end < totalPages - 1 && <span>....</span>}
        {end < totalPages && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="flex items-center justify-center text-black h-5 w-5 cursor-pointer hover:scale-105 rounded text-sm font-medium"
          >
            {totalPages}
          </button>
        )}
      </div>
      <button
        className={`flex items-center ${
          currentPage === totalPages || currentTrades.length === 0
            ? " text-gray-500 "
            : "text-black hover:scale-110 cursor-pointer"
        }`}
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages || currentTrades.length === 0}
      >
        <p>Next</p>
        <FaChevronRight />
      </button>
    </div>
  );
}
