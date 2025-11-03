import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Context";
import { BiBarChartAlt2, BiTrendingDown, BiTrendingUp } from "react-icons/bi";
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
import FormatPnL from "../../utils/FormatPnL";

export default function BarPnlChart() {
  const { trades, selectedYear } = useContext(GlobalContext);

  const data = GetMonthlyPnl(trades, selectedYear);

  return (
    <div className="col-start-1 col-end-5 h-110 p-4 pr-6 bg-linear-to-b from-cyan-300 rounded-2xl shadow shadow-gray-400 to-white">
      <div className="flex w-full justify-between items-center h-10 mb-4">
        <div className="flex items-center  gap-2">
          <div className="flex items-center justify-center h-10 w-10 bg-cyan-600 rounded-xl shadow shadow-gray-400">
            <BiBarChartAlt2 className="text-white text-xl" />{" "}
          </div>
          <h1 className="font-medium text-lg text-shadow-lg">Bar Chart</h1>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
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
