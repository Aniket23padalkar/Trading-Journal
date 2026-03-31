import React, { useContext, useEffect, useMemo, useState } from "react";
import FormatPnL from "../../utils/FormatPnL";
import { TradeContext } from "../../context/TradesContext";
import { getFilterStats } from "../../services/tradesService";
import { ScaleLoader } from "react-spinners";

function TableFooter() {
  const { filterValue, trades } = useContext(TradeContext);
  const [filterStats, setFilterStats] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFilterStats() {
      try {
        setLoading(true);
        const res = await getFilterStats(filterValue);

        setFilterStats(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilterStats();
  }, [filterValue, trades]);

  return (
    <footer className="flex items-center justify-between h-10 lg:h-10 w-full py-2 px-2 lg:px-6 bg-white dark:bg-gray-950 dark:shadow-none rounded-xl shadow shadow-gray-400">
      {loading ? (
        <div className="flex w-full h-full items-center justify-center">
          <ScaleLoader height={20} width={10} />
        </div>
      ) : (
        <>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm text-shadow-lg font-medium dark:text-white">
                Trades Count :
              </p>
              <h1 className="font-medium text-blue-500 dark:text-blue-400">
                {filterStats?.trades_count}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm text-shadow-lg font-medium dark:text-white">
                Win Rate :
              </p>
              <h1 className="font-bold text-blue-500 dark:text-blue-400">
                {filterStats?.trades_win_rate} %
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm font-medium text-shadow-lg dark:text-white">
                Total PnL :
              </p>
              <h1
                className={`font-bold text-lg lg:text-xl ${
                  filterStats?.trades_pnl >= 0
                    ? "text-green-600 dark:text-green-500"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {filterStats?.trades_pnl > 0 ? "+" : ""}
                {FormatPnL(filterStats?.trades_pnl)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm font-medium text-shadow-lg dark:text-white">
                Total RR :
              </p>
              <h1 className="font-bold text-md lg:text-lg text-blue-500 dark:text-blue-400">
                {filterStats?.trade_rr}X
              </h1>
            </div>
          </div>
        </>
      )}
    </footer>
  );
}

export default React.memo(TableFooter);
