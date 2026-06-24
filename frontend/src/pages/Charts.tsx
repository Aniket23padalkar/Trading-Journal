import BarPnLChart from "../components/chartsPageComponents/BarPnLChart.js";
import ChartsHeader from "../components/chartsPageComponents/ChartsHeader.js";
import AreaChartFillValue from "../components/chartsPageComponents/AreaChartFillValue.js";
import { useEffect, useState } from "react";
import { getMonthlyPnl } from "../api/statsApi.js";
import type { MonthlyPnlDataType } from "../types/stats.types.js";
import { useTradesContext } from "../hooks/useTradesContext.js";
import { getErrorMessage } from "../utils/error.handler.js";
import { ScaleLoader } from "react-spinners";

export default function Charts() {
  const { trades } = useTradesContext();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [monthlyPnl, setMonthlyPnl] = useState<MonthlyPnlDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMonthlyPnl() {
      setLoading(true);
      try {
        const res = await getMonthlyPnl(selectedYear);

        const months = Array(12).fill(0);

        res.forEach((item) => {
          const index = item.month - 1;
          months[index] = Number(item.total_pnl);
        });

        const monthsName = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const formatted = monthsName.map((m, i) => ({
          month: m,
          total_pnl: Number(months[i]),
        }));

        setMonthlyPnl(formatted);
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        console.log(message);
      } finally {
        setLoading(false);
      }
    }
    fetchMonthlyPnl();
  }, [selectedYear, trades]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <ScaleLoader color="#20dfbc" />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-8 gap-6 h-full w-full p-6">
      <ChartsHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        monthlyPnl={monthlyPnl}
      />
      <BarPnLChart monthlyPnl={monthlyPnl} />
      <AreaChartFillValue monthlyPnl={monthlyPnl} />
    </section>
  );
}
