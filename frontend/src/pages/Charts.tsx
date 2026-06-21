import BarPnLChart from "../components/chartsPageComponents/BarPnLChart.js";
import ChartsHeader from "../components/chartsPageComponents/ChartsHeader.jsx";
import AreaChartFillValue from "../components/chartsPageComponents/AreaChartFillValue.js";
import { useEffect, useState } from "react";
import { getMonthlyPnl } from "../api/statsApi.js";
import type { MonthlyPnlDataType } from "../types/stats.types.js";

export default function Charts() {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [monthlyPnl, setMonthlyPnl] = useState<MonthlyPnlDataType[]>([]);

  useEffect(() => {
    async function fetchMonthlyPnl() {
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
    }
    fetchMonthlyPnl();
  }, [selectedYear]);

  return (
    <section className="grid grid-cols-8 gap-6 h-full w-full p-6">
      <ChartsHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        monthlyPnl={monthlyPnl}
      />
      <BarPnLChart selectedYear={selectedYear} monthlyPnl={monthlyPnl} />
      <AreaChartFillValue selectedYear={selectedYear} monthlyPnl={monthlyPnl} />
    </section>
  );
}
