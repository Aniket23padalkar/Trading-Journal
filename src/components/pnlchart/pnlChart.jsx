import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Context";
import "./pnlchart.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import GetMonthlyPnl from "../../utils/getMonthlyPnl";

export default function PnlChart() {
  const { trades } = useContext(GlobalContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  let yearsList = [];

  trades.forEach((trade) => {
    if (!trade.formData.exitTime) return;
    const date = new Date(trade.formData.exitTime);
    const years = date.getFullYear();

    yearsList.push(years);
  });

  const data = GetMonthlyPnl(trades, selectedYear);

  const uniqueYears = Array.from(new Set(yearsList));
  uniqueYears.sort();
  const years = uniqueYears;

  return (
    <div className="pnl-chart-container">
      <div className="yearly-pnl">
        <h2>Yearly PnL {selectedYear}</h2>
        <div className="year-btns-container">
          {years.map((year) => (
            <button
              className={
                selectedYear === year ? "year-btns active" : "year-btns"
              }
              key={year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#415effff", fontSize: "0.8rem" }}
            stroke="#000000ff"
          />
          <YAxis
            tick={{ fill: "#415effff", fontSize: 12 }}
            stroke="#000000ff"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffffff",
              border: "1px solid #000000ff",
              borderRadius: "8px",
              boxShadow: "0 2px 2px rgba(0,0,0,0.3)",
            }}
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
          />
          <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.pnl > 0 ? "#03c988" : "#ff5454ff"}
              />
            ))}
          </Bar>
          <ReferenceLine y={0} stroke="#000000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
