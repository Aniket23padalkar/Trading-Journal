import { useContext } from "react";
import "./stats.css";
import { GlobalContext } from "../../context/Context";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaArrowUpLong,
  FaArrowDownLong,
  FaSquare,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa6";
import FormatPnL from "../../utils/FormatPnL";

export default function Stats() {
  const { trades } = useContext(GlobalContext);

  function calculateOverallPnl() {
    return trades.reduce((acc, trade) => acc + Number(trade.pnl), 0);
  }

  function calculateMaxProfit() {
    return trades.reduce((acc, trade) => Math.max(acc, Number(trade.pnl)), 0);
  }

  function calculateMaxLoss() {
    return trades.reduce((acc, trade) => Math.min(acc, Number(trade.pnl)), 0);
  }

  function calculateTotalProfit() {
    const profitableTrades = trades.filter((trade) => Number(trade.pnl) > 0);

    if (profitableTrades.length === 0) return 0;

    const totalProfit = profitableTrades.reduce(
      (acc, trade) => acc + Number(trade.pnl),
      0
    );
    return totalProfit.toFixed(2);
  }

  function calculateTotalLoss() {
    const losingTrades = trades.filter((trade) => Number(trade.pnl) < 0);

    if (losingTrades.length === 0) return 0;

    const totalLoss = losingTrades.reduce(
      (acc, trade) => acc + Number(trade.pnl),
      0
    );
    return totalLoss.toFixed(2);
  }

  function calculateOverallRRratio() {
    return trades.reduce((acc, trade) => acc + Number(trade.rrRatio), 0);
  }

  function calculateAverageRiskPerTrade() {
    return (
      trades.reduce((acc, trade) => acc + Number(trade.formData.risk), 0) /
      trades.length
    ).toFixed(2);
  }

  function totalProfitTrades() {
    const profitTrades = trades.filter((trade) => Number(trade.pnl) > 0);

    if (profitTrades.length === 0) return 0;

    return profitTrades.length;
  }

  function totalLossTrades() {
    const lossTrades = trades.filter((trade) => Number(trade.pnl) < 0);

    if (lossTrades.length === 0) return 0;

    return lossTrades.length;
  }

  return (
    <main className="stats-container">
      <div className="stats">
        <div className="overall-pnl overall" style={{ gridColumn: "1 / 3" }}>
          <h4>Overall PnL</h4>
          <span style={{ color: calculateOverallPnl() >= 0 ? "green" : "red" }}>
            {calculateOverallPnl() >= 0 ? (
              <FaArrowTrendUp className="arrow-trend" />
            ) : (
              <FaArrowTrendDown className="arrow-trend" />
            )}{" "}
            <h3 style={{ color: calculateOverallPnl() >= 0 ? "green" : "red" }}>
              {FormatPnL(calculateOverallPnl())}
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
            {calculateMaxProfit() >= 0 ? "+" : "-"}
            {FormatPnL(calculateMaxProfit())}
          </h3>
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
            {FormatPnL(calculateMaxLoss())}
          </h3>
        </div>
      </div>

      <div className="stats" style={{ columnGap: "0.5rem" }}>
        <div className="overall">
          <h4>Overall RR</h4>
          <span>
            {calculateOverallRRratio() >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            <h3>{calculateOverallRRratio()}X</h3>
          </span>
        </div>

        <div className="average-risk-per-trade">
          <h4>Avg Risk/Trade</h4>
          <h3>{calculateAverageRiskPerTrade()}/-</h3>
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
            <h3>+{FormatPnL(calculateTotalProfit())}</h3>
          </span>
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
            <h3>{FormatPnL(calculateTotalLoss())}</h3>
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
            {totalProfitTrades()}
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
            {totalLossTrades()}
          </h3>
        </div>
      </div>
    </main>
  );
}
