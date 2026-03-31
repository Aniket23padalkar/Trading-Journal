import { useEffect } from "react";
import { getYearAndMonth } from "../../services/tradesService";
import { useState } from "react";

export default function ChartsHeader({
  selectedYear,
  setSelectedYear,
  monthlyPnl,
}) {
  const [years, setYears] = useState();
  const yearlyPnl = monthlyPnl?.reduce(
    (acc, data) => acc + Number(data.pnl),
    0,
  );

  useEffect(() => {
    async function fetchYears() {
      const res = await getYearAndMonth();

      setYears(res.years);
    }
    fetchYears();
  }, []);

  return (
    <header className="flex items-center justify-between p-4 py-2 lg:p-4 lg:px-6 gap-4 col-start-1 col-end-9 bg-white h-12 lg:h-16 rounded-2xl shadow shadow-gray-400 dark:bg-gray-950 dark:text-white dark:shadow-none">
      <div className="flex items-center gap-4">
        <h2 className="text-shadow-lg font-medium text-md lg:text-lg">
          Yearly PnL {selectedYear}
        </h2>
        <div className="flex items-center gap-2">
          {years?.map((year) => (
            <button
              className={`border-2 dark:border-none dark:py-0.5 text-sm lg:text-lg px-2 dark:px-3 rounded ${
                selectedYear === year
                  ? "bg-blue-200 text-blue-800 border-blue-600 dark:bg-blue-700 dark:text-blue-200 dark:shadow-md dark:shadow-blue-500"
                  : "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-300"
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
          className={`text:md lg:text-xl font-bold ${
            yearlyPnl > 0
              ? "text-green-600 dark:text-green-500"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {yearlyPnl > 0 ? "+" : ""}
          {yearlyPnl.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </h1>
      </div>
    </header>
  );
}
