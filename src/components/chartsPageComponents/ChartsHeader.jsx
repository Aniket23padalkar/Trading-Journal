import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import GetMonthlyPnl from "../../utils/getMonthlyPnl";
import { BiTrendingDown, BiTrendingUp } from "react-icons/bi";

export default function ChartsHeader() {
  const { trades, selectedYear, setSelectedYear } = useContext(GlobalContext);
  const data = GetMonthlyPnl(trades, selectedYear);
  const yearlyPnl = data.reduce((acc, data) => acc + Number(data.pnl), 0);

  let yearsList = [];

  trades.forEach((trade) => {
    if (!trade.entries.initialExitTime) return;
    const date = new Date(trade.entries.initialExitTime);
    const years = date.getFullYear();

    yearsList.push(years);
  });

  const uniqueYears = Array.from(new Set(yearsList));
  uniqueYears.sort();
  const years = uniqueYears;
  return (
    <div className="flex items-center justify-between p-4 px-6 gap-4 col-start-1 col-end-9 bg-white h-16 rounded-2xl shadow shadow-gray-400">
      <div className="flex items-center gap-4">
        <h2 className="text-shadow-lg font-medium">
          Yearly PnL {selectedYear}
        </h2>
        <div className="flex items-center gap-2">
          {years.map((year) => (
            <button
              className={`border-2 px-2 rounded ${
                selectedYear === year
                  ? "bg-blue-200 text-blue-800 border-blue-600 "
                  : "bg-blue-100 text-blue-700 border-transparent"
              }`}
              key={year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1
          className={`text-xl font-bold ${
            yearlyPnl > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {yearlyPnl > 0 ? "+" : ""}
          {yearlyPnl.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </h1>
      </div>
    </div>
  );
}
