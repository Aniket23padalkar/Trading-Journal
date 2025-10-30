import { useContext, useMemo } from "react";
import { GlobalContext } from "../../context/Context";
import FormatPnL from "../../utils/FormatPnL";

export default function TableFooter() {
  const { filteredTrades } = useContext(GlobalContext);

  const { totalPnL, totalRRratio, winRate } = useMemo(() => {
    const totalPnL = filteredTrades.reduce(
      (acc, trade) => acc + Number(trade.pnl),
      0
    );
    const totalRRratio = filteredTrades
      .reduce((acc, trade) => acc + Number(trade.rrRatio), 0)
      .toFixed(2);

    const closedTrades = filteredTrades.filter(
      (trade) => trade.formData.status === "Closed"
    );
    const profitTrades = filteredTrades.filter((trade) => trade.pnl > 0);
    const winRate = ((profitTrades.length / closedTrades.length) * 100).toFixed(
      0
    );

    return { totalPnL, totalRRratio, winRate };
  });

  return (
    <div className="flex items-center justify-between w-full py-2 px-6 bg-white rounded-xl shadow shadow-gray-400">
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <p className="text-md text-shadow-lg font-medium">Trades Count :</p>
          <h1 className="font-medium text-blue-500">{filteredTrades.length}</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-md text-shadow-lg font-medium">Win Rate :</p>
          <h1 className="font-bold text-blue-500">{winRate} %</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <p className="text-md font-medium text-shadow-lg">Total PnL :</p>
          <h1
            className="font-bold text-xl"
            style={{ color: totalPnL >= 0 ? "green" : "red" }}
          >
            {totalPnL > 0 ? "+" : ""}
            {FormatPnL(totalPnL)}
          </h1>
        </div>
        <div className="flex items-center">
          <p className="text-md font-medium text-shadow-lg">Total RR :</p>
          <h1 className="font-bold text-xl">{totalRRratio}X</h1>
        </div>
      </div>
    </div>
  );
}
