import { useContext, useState } from "react";
import "./pnlchart.css";
import { GlobalContext } from "../../context/Context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from "recharts";
import getMonthlyPnl from "../../utils/getMonthlyPnl";

export default function PnlChart() {
  const { trades } = useContext(GlobalContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  let yearList = [];

  trades.forEach((trade) => {
    if (!trade.formData.exitTime) return;
    const date = new Date(trade.formData.exitTime);
    const year = date.getFullYear();

    yearList.push(year);
  });
  const data = getMonthlyPnl(trades, selectedYear);

  const uniqueYears = Array.from(new Set(yearList));

  uniqueYears.sort();

  const years = uniqueYears;

  return (
    <div className="pnl-chart-container">
      <div className="yearly-pnl">
        <h2>Yearly PnL {selectedYear}</h2>
        <div className="pnl-buttons">
          {years.map((year) => (
            <button
              className={selectedYear === year ? "pnl-btns active" : "pnl-btns"}
              key={year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="pnl">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.pnl > 0 ? "green" : "red"} />
            ))}
          </Bar>
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
