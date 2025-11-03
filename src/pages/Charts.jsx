import BarPnLChart from "../components/chartsPageComponents/BarPnLChart";
import ChartsHeader from "../components/chartsPageComponents/ChartsHeader";
import AreaChartFillValue from "../components/chartsPageComponents/AreaChartFillValue";

export default function Charts() {
  return (
    <div className="grid grid-cols-8 gap-6 h-full w-full p-6">
      <ChartsHeader />
      <BarPnLChart />
      <AreaChartFillValue />
    </div>
  );
}
