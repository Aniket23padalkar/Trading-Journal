import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { useMemo } from "react";
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
  } = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        overallPnl: 0,
        maxProfit: 0,
        maxLoss: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        overallRR: 0,
        averageRiskPerTrade: 0,
        totalProfitTrades: 0,
        totalLossTrades: 0,
        openTrades: 0,
      };
    }

    const pnl = trades.map((trade) => Number(trade.stats.pnl));
    const overallPnl = pnl.reduce((a, b) => a + b, 0);
    const maxProfit = Math.max(...pnl);
    const maxLoss = Math.min(...pnl);

    const overallRR = trades
      .reduce((a, b) => a + Number(b.stats.avgRR), 0)
      .toFixed(2);

    const averageRiskPerTrade = (
      trades.reduce((a, b) => a + Number(b.stats.avgRisk), 0) / trades.length
    ).toFixed(2);

    const profitTrades = pnl.filter((p) => Number(p) > 0);
    const totalProfit =
      profitTrades.length > 0 ? profitTrades.reduce((a, b) => a + b, 0) : 0;

    const totalProfitTrades = profitTrades.length > 0 ? profitTrades.length : 0;

    const losingTrades = pnl.filter((p) => Number(p) < 0);
    const totalLoss =
      losingTrades.length > 0 ? losingTrades.reduce((a, b) => a + b, 0) : 0;

    const totalLossTrades = losingTrades.length > 0 ? losingTrades.length : 0;

    const closedTrades = trades.filter(
      (trade) => trade.formData.status === "Closed"
    );
    const winningTrades = closedTrades.filter(
      (trade) => Number(trade.stats.pnl) > 0
    );
    const winRate =
      closedTrades.length > 0
        ? ((winningTrades.length / closedTrades.length) * 100).toFixed(0)
        : 0;

    const openTrades = trades
      .filter((trade) => trade.formData.status === "Open")
      .length.toFixed(0);

    return {
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
    };
  }, [trades]);

  return (
    <>
      <div className="flex col-start-1 col-end-5 h-65 rounded-2xl shadow shadow-gray-400 bg-green-500 dark:bg-teal-600 dark:shadow-none p-8">
        <div className="flex flex-col gap-4">
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
        <div className="flex-1  pl-8">
          <img
            className="h-full object-contain w-full"
            src={candles}
            alt="candles"
          />
        </div>
      </div>

      <div className="flex flex-col justify-between col-start-5 col-end-7 p-8  rounded-2xl shadow shadow-gray-400 bg-white dark:bg-gray-950 dark:shadow-none">
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
      </div>

      <div className="flex flex-col gap-4 items-center justify-center p-8 col-start-7 col-end-9 rounded-2xl shadow shadow-gray-400 dark:shadow-none bg-linear-to-b from-blue-300 to-blue-50 dark:from-blue-950 dark:to-blue-400">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 shadow">
          <FaChartLine className="text-white text-3xl" />
        </div>
        <p className="dark:text-gray-300">Win Rate</p>
        <h1 className="flex items-center gap-2 text-3xl font-medium dark:text-white">
          <FaArrowUp className="text-xl" />
          {winRate}%
        </h1>
      </div>

      <div className="flex flex-col justify-between p-8 col-start-1 col-end-3 rounded-2xl shadow shadow-gray-400 dark:shadow-none h-60 bg-white dark:bg-gray-950">
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
      </div>

      <div className="flex flex-col justify-between col-start-3 col-end-5 p-8 rounded-2xl shadow shadow-gray-400 h-60 bg-white dark:shadow-none dark:bg-gray-950">
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
      </div>

      <div className="flex flex-col h-60 p-8 col-start-5 col-end-9 rounded-2xl shadow shadow-gray-400  bg-linear-to-b from-violet-400 to-violet-50 dark:from-violet-950 dark:to-violet-400 dark:shadow-none">
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
      </div>
    </>
  );
}
