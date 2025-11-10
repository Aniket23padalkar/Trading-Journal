import BarPnLChart from "../components/chartsPageComponents/BarPnLChart";
import ChartsHeader from "../components/chartsPageComponents/ChartsHeader";
import AreaChartFillValue from "../components/chartsPageComponents/AreaChartFillValue";
import { useState } from "react";

export default function Charts() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  return (
    <section className="grid grid-cols-8 gap-6 h-full w-full p-6">
      <ChartsHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <BarPnLChart selectedYear={selectedYear} />
      <AreaChartFillValue selectedYear={selectedYear} />
    </section>
  );
}
