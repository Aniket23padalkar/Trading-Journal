import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import candles from "../../assets/candles.png";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaArrowUp,
  FaArrowDown,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import { FaBullseye, FaChartLine, FaExclamation } from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi";
import useStatsCalculations from "../../hooks/useStatsCalculations";

export default function Stats() {
  const { trades } = useContext(GlobalContext);

  const {
    overallPnl,
    maxProfit,
    maxLoss,
    winRate,
    totalProfit,
    totalLoss,
    overallRR,
    averageRiskPerTrade,
    totalProfitTrades,
    totalLossTrades,
    openTrades,
  } = useStatsCalculations(trades);

  return (
    <>
      <article className="flex col-start-1 justify-between col-end-9 lg:col-end-5 h-50 lg:h-55 xl:h-65 rounded-2xl shadow shadow-gray-400 bg-teal-500 dark:bg-teal-600 dark:shadow-none p-8">
        <div className="flex flex-col gap-4 ">
          <div className="flex gap-4 h-15">
            <div className="flex items-center justify-center h-15 w-15 bg-white rounded-2xl">
              {overallPnl >= 0 ? (
                <FaArrowTrendUp className="text-2xl text-green-500 font-extralight" />
              ) : (
                <FaArrowTrendDown className="text-2xl text-red-500 font-extralight" />
              )}{" "}
            </div>
            <div className="flex items-center w-30">
              <h1 className="font-bold text-xl text-white">
                OverAll Profit-Loss
              </h1>
            </div>
          </div>
          <div className="flex-1 relative">
            <h1 className=" flex gap-2 items-center font-bold text-4xl absolute left-0 text-white bottom-3">
              <FaIndianRupeeSign className="text-3xl" />{" "}
              {Number(overallPnl).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h1>
          </div>
        </div>
        <div className="lg:flex-1  pl-8">
          <img
            className="h-full object-contain w-full"
            src={candles}
            alt="candles"
          />
        </div>
      </article>

      <article className="flex flex-col justify-between h-50 lg:h-55 xl:h-65 col-start-1 col-end-5 lg:col-start-5 lg:col-end-7 px-8 py-5 lg:py-6 lg:p-4 xl:p-8  rounded-2xl shadow shadow-gray-400 bg-white dark:bg-gray-950 dark:shadow-none">
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-green-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              Max-Profit
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold dark:text-white">
            <FaIndianRupeeSign />
            {Number(maxProfit).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-red-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              Max-Loss
            </h1>
          </div>
          <h1 className="flex mt-2 font-bold gap-2 items-center text-xl dark:text-white">
            <FaIndianRupeeSign />
            {Number(maxLoss).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </article>

      <article className="flex flex-col gap-4 items-center h-50 lg:h-55 xl:h-65 justify-center p-8 col-start-5 col-end-9 lg:col-start-7 lg:col-end-9 rounded-2xl shadow shadow-gray-400 dark:shadow-none bg-linear-to-b from-blue-300 to-blue-50 dark:from-blue-950 dark:to-blue-400">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 shadow">
          <FaChartLine className="text-white text-3xl" />
        </div>
        <p className="dark:text-gray-300">Win Rate</p>
        <h1 className="flex items-center gap-2 text-3xl font-medium dark:text-white">
          <FaArrowUp className="text-xl" />
          {winRate}%
        </h1>
      </article>

      <article className="flex flex-col justify-between px-8 py-5 lg:py-6 lg:p-4 xl:p-8 col-start-1 col-end-5 lg:col-start-1 lg:col-end-3 rounded-2xl shadow shadow-gray-400 dark:shadow-none h-50 lg:h-55 xl:h-60 bg-white dark:bg-gray-950">
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-green-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              Total-Profit
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold dark:text-white">
            <FaIndianRupeeSign />
            {Number(totalProfit).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-red-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              Total-Loss
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold dark:text-white">
            <FaIndianRupeeSign />
            {Number(totalLoss).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </article>

      <article className="flex flex-col justify-between h-50 lg:h-55 xl:h-60 col-start-5 col-end-9 lg:col-start-3 lg:col-end-5 px-8 py-5 lg:py-6 lg:p-4 xl:p-8 rounded-2xl shadow shadow-gray-400  bg-white dark:shadow-none dark:bg-gray-950">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md">
              <FaBullseye className="text-xl text-red-500" />
            </div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              OverAll RR
            </h1>
          </div>
          <h1 className="flex items-center gap-2 pl-2 text-xl font-bold dark:text-white">
            {overallRR > 0 ? (
              <FaArrowUp className="text-lg" />
            ) : (
              <FaArrowDown className="text-lg" />
            )}
            {overallRR} X
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 bg-emerald-200 shadow rounded-md">
              <FaExclamation className="text-xl text-emerald-600" />
            </div>
            <h1 className="font-medium pl-2 text-lg text-gray-600 dark:text-gray-400">
              Average Risk
            </h1>
          </div>
          <h1 className="flex items-center gap-2 pl-2 text-xl font-bold dark:text-white">
            <FaIndianRupeeSign />
            {averageRiskPerTrade}
          </h1>
        </div>
      </article>

      <article className="flex flex-col h-60 lg:h-55 xl:h-60 p-8 col-start-1 lg:col-start-5 col-end-9 rounded-2xl shadow shadow-gray-400  bg-linear-to-b from-violet-400 to-violet-50 dark:from-violet-950 dark:to-violet-400 dark:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-12 w-12 bg-violet-500 dark:bg-purple-600 rounded-xl">
              <BiBarChartAlt2 className="text-white text-2xl" />
            </div>
            <h1 className="text-xl font-medium dark:text-white  ">
              Total Trades
            </h1>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">
            +{trades.length}
          </h1>
        </div>
        <div className="flex flex-1 items-end text-center">
          <div className="flex-1">
            <p className="dark:text-white">Profit-Trades</p>
            <h1 className="text-2xl font-medium text-green-600 dark:text-green-400">
              {totalProfitTrades}
            </h1>
          </div>
          <div className="flex-1 border-l-gray-400 border-l">
            <p className="dark:text-white">Loss-Trades</p>
            <h1 className="text-2xl font-medium text-red-500 dark:text-red-600">
              {totalLossTrades}
            </h1>
          </div>
          <div className="flex-1 border-l-gray-400 border-l">
            <p className="dark:text-white">Open-Trades</p>
            <h1 className="text-2xl font-medium">{openTrades}</h1>
          </div>
        </div>
      </article>
    </>
  );
}
