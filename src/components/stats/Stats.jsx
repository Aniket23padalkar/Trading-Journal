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
import FormatPnL from "../../utils/FormatPnL";
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

    const pnl = trades.map((trade) => Number(trade.pnl));
    const overallPnl = pnl.reduce((a, b) => a + b, 0);
    const maxProfit = Math.max(...pnl);
    const maxLoss = Math.min(...pnl);

    const overallRR = trades
      .reduce((a, b) => a + Number(b.rrRatio), 0)
      .toFixed(2);

    const averageRiskPerTrade = (
      trades.reduce((a, b) => a + Number(b.formData.risk), 0) / trades.length
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
    const winningTrades = closedTrades.filter((trade) => Number(trade.pnl) > 0);
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
      <div className="flex col-start-1 col-end-5 h-65 rounded-2xl shadow shadow-gray-400 bg-green-500 p-8">
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

      <div className="flex flex-col justify-between col-start-5 col-end-7 p-8  rounded-2xl shadow shadow-gray-400 bg-white">
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-green-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600">
              Max-Profit
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold">
            <FaIndianRupeeSign />
            {FormatPnL(maxProfit)}
          </h1>
        </div>
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-red-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600">Max-Loss</h1>
          </div>
          <h1 className="flex mt-2 font-bold gap-2 items-center text-xl">
            <FaIndianRupeeSign />
            {FormatPnL(maxLoss)}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center p-8 col-start-7 col-end-9 rounded-2xl shadow shadow-gray-400 bg-linear-to-b from-blue-200 to-blue-50 ">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 shadow">
          <FaChartLine className="text-white text-3xl" />
        </div>
        <p>Win Rate</p>
        <h1 className="flex items-center gap-2 text-3xl font-medium">
          <FaArrowUp className="text-xl" />
          {winRate}%
        </h1>
      </div>

      <div className="flex flex-col justify-between p-8 col-start-1 col-end-3 rounded-2xl shadow shadow-gray-400 h-60 bg-white">
        <div>
          <div className="flex items-center h-10">
            <div className="h-5 w-5 bg-green-500 rounded-xl"></div>
            <h1 className="font-medium pl-2 text-lg text-gray-600">
              Total-Profit
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold">
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
            <h1 className="font-medium pl-2 text-lg text-gray-600">
              Total-Loss
            </h1>
          </div>
          <h1 className="flex mt-2 gap-2 items-center text-xl font-bold">
            <FaIndianRupeeSign />
            {Number(totalLoss).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>

      <div className="flex flex-col justify-between col-start-3 col-end-5 p-8 rounded-2xl shadow shadow-gray-400 h-60 bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-md">
              <FaBullseye className="text-xl text-red-500" />
            </div>
            <h1 className="font-medium pl-2 text-lg text-gray-600">
              OverAll RR
            </h1>
          </div>
          <h1 className="flex items-center gap-2 pl-2 text-xl font-bold">
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
            <h1 className="font-medium pl-2 text-lg text-gray-600">
              Average Risk
            </h1>
          </div>
          <h1 className="flex items-center gap-2 pl-2 text-xl font-bold">
            <FaIndianRupeeSign />
            {averageRiskPerTrade}
          </h1>
        </div>
      </div>

      <div className="flex flex-col h-60 p-8 col-start-5 col-end-9 rounded-2xl shadow shadow-gray-400  bg-linear-to-b from-violet-300 to-violet-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-12 w-12 bg-violet-500 rounded-xl">
              <BiBarChartAlt2 className="text-white text-2xl" />
            </div>
            <h1 className="text-xl font-medium">Total Trades</h1>
          </div>
          <h1 className="text-2xl">+{trades.length}</h1>
        </div>
        <div className="flex flex-1 items-end text-center">
          <div className="flex-1">
            <p>Profit-Trades</p>
            <h1 className="text-2xl text-green-600 ">{totalProfitTrades}</h1>
          </div>
          <div className="flex-1 border-l-gray-400 border-l">
            <p>Loss-Trades</p>
            <h1 className="text-2xl text-red-500">{totalLossTrades}</h1>
          </div>
          <div className="flex-1 border-l-gray-400 border-l">
            <p>Open-Trades</p>
            <h1 className="text-2xl">{openTrades}</h1>
          </div>
        </div>
      </div>
    </>
    // <div className="stats-section">
    //   <div className="stats-container">
    //     <div
    //       className="stats"
    //       style={{
    //         gridColumn: "1 / 3",
    //         borderBottom: "1px solid black",
    //         alignItems: "center",
    //       }}
    //     >
    //       <p>Overall PnL</p>
    //       <span style={{ color: overallPnl >= 0 ? "green" : "red" }}>
    //         {overallPnl >= 0 ? (
    //           <FaArrowTrendUp className="arrow-trend" />
    //         ) : (
    //           <FaArrowTrendDown className="arrow-trend" />
    //         )}{" "}
    //         <h1
    //           style={{
    //             color: overallPnl >= 0 ? "green" : "red",
    //             fontSize: "1.4rem",
    //             paddingTop: "0",
    //           }}
    //         >
    //           {FormatPnL(overallPnl)}
    //         </h1>
    //       </span>
    //     </div>

    //     <div className="stats">
    //       <span>
    //         <FaSquare
    //           size={13}
    //           color="green"
    //           style={{ marginRight: "0.2rem" }}
    //         />
    //         <p style={{ marginTop: "0.05rem" }}>Biggest Profit</p>
    //       </span>
    //       <h1>
    //         {maxProfit > 0 ? "+" : ""}
    //         {FormatPnL(maxProfit)}
    //       </h1>
    //     </div>

    //     <div className="stats">
    //       <span>
    //         <FaSquare size={13} color="red" style={{ marginRight: "0.2rem" }} />
    //         <p style={{ marginTop: "0.05rem" }}>Biggest Loss</p>
    //       </span>
    //       <h1>{FormatPnL(maxLoss)}</h1>
    //     </div>
    //   </div>

    //   <div className="stats-container">
    //     <div className="stats" style={{ borderBottom: "1px solid black" }}>
    //       <p>Win Rate</p>
    //       <span>
    //         {winRate >= 0 ? <FaArrowUp /> : <FaArrowDown />}
    //         <h1 style={{ fontSize: "1.3rem", paddingTop: "0.1rem" }}>
    //           {winRate}%
    //         </h1>
    //       </span>
    //     </div>

    //     <div
    //       className="stats"
    //       style={{ flexDirection: "row", alignItems: "center" }}
    //     >
    //       <div className="arrow-up-square">
    //         {
    //           <FaArrowUpLong
    //             style={{ height: "2rem", width: "1.2rem", color: "white" }}
    //           />
    //         }
    //       </div>
    //       <span style={{ flexDirection: "column", marginLeft: "0.4rem" }}>
    //         <p>Total Profit</p>
    //         <h1>+{FormatPnL(totalProfit)}</h1>
    //       </span>
    //     </div>

    //     <div className="stats">
    //       <p style={{ paddingBottom: "0.2rem" }}>Avg Risk/Trade</p>
    //       <h1>
    //         <FaIndianRupeeSign />
    //         {averageRiskPerTrade}
    //       </h1>
    //     </div>

    //     <div
    //       className="stats"
    //       style={{ flexDirection: "row", alignItems: "center" }}
    //     >
    //       <div className="arrow-down-square">
    //         {
    //           <FaArrowDownLong
    //             style={{ height: "2rem", width: "1.2rem", color: "white" }}
    //           />
    //         }
    //       </div>
    //       <span style={{ flexDirection: "column", marginLeft: "0.4rem" }}>
    //         <p>Total Loss</p>
    //         <h1>{FormatPnL(totalLoss)}</h1>
    //       </span>
    //     </div>
    //   </div>

    //   <div className="stats-container">
    //     <div className="stats" style={{ borderBottom: "1px solid black" }}>
    //       <p>Total-Trades</p>
    //       <h1>{trades.length.toFixed(0)}</h1>
    //     </div>

    //     <div className="stats" style={{ borderBottom: "1px solid black" }}>
    //       <p>Overall RR</p>
    //       <span>
    //         {overallRR >= 0 ? <FaArrowUp /> : <FaArrowDown />}
    //         <h1>{overallRR}X</h1>
    //       </span>
    //     </div>

    //     <div className="stats">
    //       <span>
    //         <FaSquare
    //           size={13}
    //           color="green"
    //           style={{ marginRight: "0.2rem" }}
    //         />
    //         <p style={{ marginTop: "0.05rem" }}>Profit Trades</p>
    //       </span>
    //       <h1 style={{ fontSize: "1.3rem" }}>{totalProfitTrades.toFixed(0)}</h1>
    //     </div>

    //     <div className="stats">
    //       <span>
    //         <FaSquare size={13} color="red" style={{ marginRight: "0.2rem" }} />
    //         <p style={{ marginTop: "0.05rem" }}>Loss Trades</p>
    //       </span>
    //       <h1 style={{ fontSize: "1.3rem" }}>{totalLossTrades.toFixed(0)}</h1>
    //     </div>
    //   </div>
    // </div>
  );
}
