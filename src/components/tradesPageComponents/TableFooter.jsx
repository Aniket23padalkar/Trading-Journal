import { useContext, useMemo } from "react";
import { GlobalContext } from "../../context/Context";
import FormatPnL from "../../utils/FormatPnL";

export default function TableFooter() {
  const { filteredTrades } = useContext(GlobalContext);

  const { totalPnL, totalRRratio, winRate } = useMemo(() => {
    if (!filteredTrades || filteredTrades.length === 0) {
      return {
        totalPnL: 0,
        totalRRratio: 0,
        winRate: 0,
      };
    }
    const totalPnL = filteredTrades.reduce(
      (acc, trade) => acc + Number(trade.stats.pnl),
      0
    );
    const totalRRratio = filteredTrades
      .reduce((acc, trade) => acc + Number(trade.stats.avgRR), 0)
      .toFixed(2);

    const closedTrades = filteredTrades.filter(
      (trade) => trade.formData.status === "Closed"
    );
    const profitTrades = filteredTrades.filter(
      (trade) => Number(trade.stats.pnl) > 0
    );
    const winRate =
      closedTrades.length > 0
        ? ((profitTrades.length / closedTrades.length) * 100).toFixed(0)
        : 0;

    return { totalPnL, totalRRratio, winRate };
  });

  return (
    <div className="flex items-center justify-between w-full py-2 px-2 lg:px-6 bg-white dark:bg-gray-950 dark:shadow-none rounded-xl shadow shadow-gray-400">
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="lg:text-md text-sm text-shadow-lg font-medium dark:text-white">
            Trades Count :
          </p>
          <h1 className="font-medium text-blue-500 dark:text-blue-400">
            {filteredTrades.length}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="lg:text-md text-sm text-shadow-lg font-medium dark:text-white">
            Win Rate :
          </p>
          <h1 className="font-bold text-blue-500 dark:text-blue-400">
            {winRate} %
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
              totalPnL >= 0
                ? "text-green-600 dark:text-green-500"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {totalPnL > 0 ? "+" : ""}
            {FormatPnL(totalPnL)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="lg:text-md text-sm font-medium text-shadow-lg dark:text-white">
            Total RR :
          </p>
          <h1 className="font-bold text-md lg:text-lg text-blue-500 dark:text-blue-400">
            {totalRRratio}X
          </h1>
        </div>
      </div>
    </div>
  );
}
