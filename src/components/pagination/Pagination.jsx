import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./pagination.css";
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
    <div className="pages-container">
      <button
        className={
          currentPage === 1 || currentTrades.length === 0
            ? "prev-next-btn disabled"
            : "prev-next-btn"
        }
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1 || currentTrades.length === 0}
      >
        <FaChevronLeft />
      </button>
      <div className="page">
        {start > 1 && (
          <button onClick={() => setCurrentPage(1)} className="page-num">
            1
          </button>
        )}
        {start > 2 && <span>...</span>}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? "page-num active" : "page-num"}
          >
            {page}
          </button>
        ))}
        {end < totalPages - 1 && <span>...</span>}
        {end < totalPages && (
          <button
            onClick={() => setCurrentPage(totalPages)}
            className="page-num"
          >
            {totalPages}
          </button>
        )}
      </div>
      <button
        className={
          currentPage === totalPages || currentTrades.length === 0
            ? "prev-next-btn disabled"
            : "prev-next-btn"
        }
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages || currentTrades.length === 0}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
