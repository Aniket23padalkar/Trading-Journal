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
    <div className="stats-section">
      <div className="stats-container">
        <div
          className="stats"
          style={{
            gridColumn: "1 / 3",
            borderBottom: "1px solid black",
            alignItems: "center",
          }}
        >
          <p>Overall PnL</p>
          <span style={{ color: overallPnl >= 0 ? "green" : "red" }}>
            {overallPnl >= 0 ? (
              <FaArrowTrendUp className="arrow-trend" />
            ) : (
              <FaArrowTrendDown className="arrow-trend" />
            )}{" "}
            <h1
              style={{
                color: overallPnl >= 0 ? "green" : "red",
                fontSize: "1.4rem",
                paddingTop: "0",
              }}
            >
              {FormatPnL(overallPnl)}
            </h1>
          </span>
        </div>

        <div className="stats">
          <span>
            <FaSquare
              size={13}
              color="green"
              style={{ marginRight: "0.2rem" }}
            />
            <p style={{ marginTop: "0.05rem" }}>Biggest Profit</p>
          </span>
          <h1>
            {maxProfit > 0 ? "+" : ""}
            {FormatPnL(maxProfit)}
          </h1>
        </div>

        <div className="stats">
          <span>
            <FaSquare size={13} color="red" style={{ marginRight: "0.2rem" }} />
            <p style={{ marginTop: "0.05rem" }}>Biggest Loss</p>
          </span>
          <h1>{FormatPnL(maxLoss)}</h1>
        </div>
      </div>

      <div className="stats-container">
        <div className="stats" style={{ borderBottom: "1px solid black" }}>
          <p>Win Rate</p>
          <span>
            {winRate >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            <h1 style={{ fontSize: "1.3rem", paddingTop: "0.1rem" }}>
              {winRate}%
            </h1>
          </span>
        </div>

        <div
          className="stats"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <div className="arrow-up-square">
            {
              <FaArrowUpLong
                style={{ height: "2rem", width: "1.2rem", color: "white" }}
              />
            }
          </div>
          <span style={{ flexDirection: "column", marginLeft: "0.4rem" }}>
            <p>Total Profit</p>
            <h1>+{FormatPnL(totalProfit)}</h1>
          </span>
        </div>

        <div className="stats">
          <p style={{ paddingBottom: "0.2rem" }}>Avg Risk/Trade</p>
          <h1>
            <FaIndianRupeeSign />
            {averageRiskPerTrade}
          </h1>
        </div>

        <div
          className="stats"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <div className="arrow-down-square">
            {
              <FaArrowDownLong
                style={{ height: "2rem", width: "1.2rem", color: "white" }}
              />
            }
          </div>
          <span style={{ flexDirection: "column", marginLeft: "0.4rem" }}>
            <p>Total Loss</p>
            <h1>{FormatPnL(totalLoss)}</h1>
          </span>
        </div>
      </div>

      <div className="stats-container">
        <div className="stats" style={{ borderBottom: "1px solid black" }}>
          <p>Total-Trades</p>
          <h1>{trades.length.toFixed(0)}</h1>
        </div>

        <div className="stats" style={{ borderBottom: "1px solid black" }}>
          <p>Overall RR</p>
          <span>
            {overallRR >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            <h1>{overallRR}X</h1>
          </span>
        </div>

        <div className="stats">
          <span>
            <FaSquare
              size={13}
              color="green"
              style={{ marginRight: "0.2rem" }}
            />
            <p style={{ marginTop: "0.05rem" }}>Profit Trades</p>
          </span>
          <h1 style={{ fontSize: "1.3rem" }}>{totalProfitTrades.toFixed(0)}</h1>
        </div>

        <div className="stats">
          <span>
            <FaSquare size={13} color="red" style={{ marginRight: "0.2rem" }} />
            <p style={{ marginTop: "0.05rem" }}>Loss Trades</p>
          </span>
          <h1 style={{ fontSize: "1.3rem" }}>{totalLossTrades.toFixed(0)}</h1>
        </div>
      </div>
    </div>
  );
}
