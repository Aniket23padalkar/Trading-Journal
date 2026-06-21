import React, { useEffect, useState } from "react";
import FormatPnL from "../../utils/FormatPnL.js";
import { ScaleLoader } from "react-spinners";
import { useTradesContext } from "../../hooks/useTradesContext.js";
import type { GetFilteredStatsData } from "../../types/stats.types.js";
import { cleanParams } from "../../utils/cleanParams.js";
import { getErrorMessage } from "../../utils/error.handler.js";
import { getFilteredStats } from "../../api/statsApi.js";

function TableFooter() {
  const { filterValues, trades, payload } = useTradesContext();
  const [filteredStats, setFilteredStats] =
    useState<GetFilteredStatsData | null>(null);
  const [loading, setLoading] = useState(false);

  const params = cleanParams(payload);

  async function fetchFilteredStats() {
    setLoading(true);
    try {
      const res = await getFilteredStats(params);

      setFilteredStats(res);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      console.log(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilteredStats();
  }, [filterValues, trades]);

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
                {filteredStats?.trades_count}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm text-shadow-lg font-medium dark:text-white">
                Win Rate :
              </p>
              <h1 className="font-bold text-blue-500 dark:text-blue-400">
                {filteredStats?.win_rate} %
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
                  filteredStats?.total_pnl
                    ? filteredStats?.total_pnl >= 0
                      ? "text-green-600 dark:text-green-500"
                      : "text-red-500 dark:text-red-400"
                    : null
                }`}
              >
                {filteredStats?.total_pnl
                  ? filteredStats?.total_pnl > 0
                    ? "+"
                    : ""
                  : null}
                {FormatPnL(filteredStats?.total_pnl)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="lg:text-md text-sm font-medium text-shadow-lg dark:text-white">
                Total RR :
              </p>
              <h1 className="font-bold text-md lg:text-lg text-blue-500 dark:text-blue-400">
                {filteredStats?.total_rr}X
              </h1>
            </div>
          </div>
        </>
      )}
    </footer>
  );
}

export default React.memo(TableFooter);
