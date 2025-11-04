import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { FaChartArea } from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GetMonthlyPnl from "../../utils/getMonthlyPnl";

export default function AreaChartFillValue() {
  const { trades, selectedYear } = useContext(GlobalContext);

  const data = GetMonthlyPnl(trades, selectedYear);

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((d) => d.pnl));
    const dataMin = Math.min(...data.map((d) => d.pnl));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="col-start-5 col-end-9 bg-white h-110 p-4 rounded-2xl bg-linear-to-b from-blue-300 to-blue-0 shadow shadow-gray-400">
      <div className="flex w-full justify-between items-center h-10 mb-4">
        <div className="flex items-center  gap-2">
          <div className="flex items-center justify-center h-10 w-10 bg-blue-500 rounded-xl shadow shadow-gray-400">
            <FaChartArea className="text-white text-xl" />{" "}
          </div>
          <h1 className="font-medium text-shadow-lg text-lg">
            Area Fill by Value Chart
          </h1>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#415effff", fontSize: "0.8rem" }}
            stroke="#000000ff"
          />
          <YAxis
            width={50}
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
          <defs>
            <linearGradient id="splitcolor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="green" stopOpacity={1} />
              <stop offset={off} stopColor="green" stopOpacity={0.2} />
              <stop offset={off} stopColor="red" stopOpacity={0.2} />
              <stop offset="1" stopColor="red" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="blue"
            fill="url(#splitcolor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
