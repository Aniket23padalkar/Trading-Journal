import React, { useContext } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { ScaleLoader } from "react-spinners";
import Swal from "sweetalert2";
import TradeRow from "./TradeRow";
import useTradesData from "../../hooks/useTradesData";
import { FilterContext } from "../../context/FilterContext";

function TradesTable({
  currentTrades,
  indexOfFirstTrade,
  handleSetViewModal,
  handleSetEditTrade,
  setCurrentViewTrade,
}) {
  const { setFilterValue, filterValue } = useContext(FilterContext);
  const { fetchLoading } = useTradesData();
  const { user } = useContext(AuthContext);

  function handleFilterChange() {
    setFilterValue((prev) => ({
      ...prev,
      pnlSort:
        prev.pnlSort === "Desc"
          ? "Asc"
          : prev.pnlSort === "Asc"
          ? "Desc"
          : "Desc",
      dateTimeSort: "",
    }));
  }

  function handleDateTimeSort() {
    setFilterValue((prev) => ({
      ...prev,
      dateTimeSort:
        prev.dateTimeSort === "Desc"
          ? "Asc"
          : prev.dateTimeSort === "Asc"
          ? "Desc"
          : "Desc",
      pnlSort: "",
    }));
  }

  async function handleDeleteTrade(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const tradesRef = doc(db, "users", user.uid, "trades", id);
        await deleteDoc(tradesRef);

        Swal.fire({
          title: "Deleted!",
          text: "Your Trade has been deleted.",
          icon: "success",
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: err.message,
          icon: "error",
        });
      }
    }
  }

  return (
    <section className="flex h-full w-full items-center bg-transparent relative">
      <div className="w-full min-h-102 h shadow-md shadow-gray-400 dark:shadow-none overflow-x-auto scrollbar-thin-x">
        {fetchLoading && (
          <div className="flex absolute left-0 top-0 items-center justify-center h-full w-full">
            <ScaleLoader color="#20dfbc" />
          </div>
        )}
        <table className="w-full border-collapse bg-white dark:bg-sky-950 dark:text-white ">
          <thead>
            <tr className="text-center whitespace-nowrap bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
              <th className="w-8 bg-gray-200 dark:bg-gray-950">#</th>
              <th className="text-left">symbol</th>
              <th>order</th>
              <th>status</th>
              <th>market-type</th>
              <th>quantity</th>
              <th>position</th>
              <th
                className="flex items-center gap-1 justify-center cursor-pointer select-none"
                onClick={handleDateTimeSort}
              >
                {filterValue.dateTimeSort === "Desc" ? (
                  <FaArrowDown />
                ) : filterValue.dateTimeSort === "Asc" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{" "}
                <p>Entry Time</p>
              </th>
              <th>risk/trade</th>
              <th
                className="flex items-center gap-3 justify-center cursor-pointer select-none"
                onClick={handleFilterChange}
              >
                {filterValue.pnlSort === "Desc" ? (
                  <FaArrowDown />
                ) : filterValue.pnlSort === "Asc" ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowDown />
                )}{" "}
                <p>P&L (₹)</p>
              </th>
              <th>R:R Ratio</th>
              <th>rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.length > 0 &&
              currentTrades.map((trade, index) => (
                <TradeRow
                  key={trade.id}
                  trade={trade}
                  index={index}
                  indexOfFirstTrade={indexOfFirstTrade}
                  handleSetEditTrade={handleSetEditTrade}
                  setCurrentViewTrade={setCurrentViewTrade}
                  handleSetViewModal={handleSetViewModal}
                  handleDeleteTrade={handleDeleteTrade}
                />
              ))}
          </tbody>
        </table>
      </div>
      {currentTrades.length === 0 && !fetchLoading && (
        <div className="flex items-center justify-center top-0 dark:text-white left-0 absolute h-full w-full">
          <h1>Nothing To Show! Please Add Trades</h1>
        </div>
      )}
    </section>
  );
}

export default React.memo(TradesTable);
