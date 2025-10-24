import { useContext } from "react";
import "./stats.css";
import { GlobalContext } from "../../context/Context";
import { useMemo } from "react";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaArrowUpLong,
  FaArrowDownLong,
  FaSquare,
  FaArrowUp,
  FaArrowDown,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import FormatPnL from "../../utils/FormatPnL";

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
  } = useMemo(() => {
    if (trades.length === 0) {
      return { overallPnl: 0, maxProfit: 0, maxLoss: 0, winRate: 0 };
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
    };
  }, [trades]);

  return (
    <main className="stats-container">
      <div className="stats">
        <div className="overall-pnl overall">
          <h4>Overall PnL</h4>
          <span style={{ color: overallPnl >= 0 ? "green" : "red" }}>
            {overallPnl >= 0 ? (
              <FaArrowTrendUp className="arrow-trend" />
            ) : (
              <FaArrowTrendDown className="arrow-trend" />
            )}{" "}
            <h3 style={{ color: overallPnl >= 0 ? "green" : "red" }}>
              {FormatPnL(overallPnl)}
            </h3>
          </span>
        </div>

        <div className="max-profit overall">
          <span className="square-container">
            <FaSquare size={13} color="green" />
            <h4>Biggest Profit</h4>
          </span>
          <h3
            style={{
              fontSize: "1.2rem",
            }}
          >
            {maxProfit >= 0 ? "+" : "-"}
            {FormatPnL(maxProfit)}
          </h3>
        </div>

        <div className="win-rate rr-ratio">
          <h4>Win Rate</h4>
          <span>
            {winRate >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            <h3>{winRate}%</h3>
          </span>
        </div>

        <div className="max-loss overall">
          <span className="square-container">
            <FaSquare size={13} color="red" />
            <h4>Biggest Loss</h4>
          </span>
          <h3
            style={{
              fontSize: "1.2rem",
            }}
          >
            {FormatPnL(maxLoss)}
          </h3>
        </div>
      </div>

      <div className="stats" style={{ columnGap: "0.5rem" }}>
        <div className="rr-ratio">
          <h4>Overall RR</h4>
          <span>
            {overallRR >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            <h3>{overallRR}X</h3>
          </span>
        </div>

        <div className="average-profit">
          <div className="arrow-up-square">
            {
              <FaArrowUpLong
                style={{ height: "1.5rem", width: "1rem", color: "white" }}
              />
            }
          </div>
          <span>
            <h4>Total Profit</h4>
            <h3>+{FormatPnL(totalProfit)}</h3>
          </span>
        </div>

        <div className="average-risk-per-trade">
          <h4>Avg Risk/Trade</h4>
          <h3>
            <FaIndianRupeeSign />
            {averageRiskPerTrade}
          </h3>
        </div>

        <div className="average-loss">
          <div className="arrow-down-square">
            {
              <FaArrowDownLong
                style={{ height: "1.5rem", width: "1rem", color: "white" }}
              />
            }
          </div>
          <span>
            <h4>Total Loss</h4>
            <h3>{FormatPnL(totalLoss)}</h3>
          </span>
        </div>
      </div>

      <div className="stats">
        <div className="total-trades">
          <h4>Total-Trades</h4>
          <h3>{trades.length}</h3>
        </div>

        <div className="max-profit overall">
          <span className="square-container">
            <FaSquare size={13} color="green" />
            <h4>Profit Trades</h4>
          </span>
          <h3
            style={{
              fontSize: "1.2rem",
            }}
          >
            {totalProfitTrades}
          </h3>
        </div>

        <div className="max-loss overall">
          <span className="square-container">
            <FaSquare size={13} color="red" />
            <h4>Loss Trades</h4>
          </span>
          <h3
            style={{
              fontSize: "1.2rem",
            }}
          >
            {totalLossTrades}
          </h3>
        </div>
      </div>
    </main>
  );
}
