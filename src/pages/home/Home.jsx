import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import "./home.css";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

export default function Home() {
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

  function formatPnl(value) {
    if (value >= 10000000 || value <= -10000000) {
      return (value / 10000000).toFixed(2) + "Cr";
    } else if (value >= 100000 || value <= -100000) {
      return (value / 100000).toFixed(2) + "L";
    } else if (value >= 1000 || value <= -1000) {
      return (value / 1000).toFixed(2) + "K";
    } else {
      return value.toFixed(2);
    }
  }

  return (
    <main className="home-page">
      <div className="overall-stats">
        <div className="overall-pnl overall">
          <h4>Overall PnL</h4>
          <span style={{ color: calculateOverallPnl() >= 0 ? "green" : "red" }}>
            {calculateOverallPnl() >= 0 ? (
              <FaArrowTrendUp className="arrow-trend" />
            ) : (
              <FaArrowTrendDown className="arrow-trend" />
            )}{" "}
            <h3 style={{ color: calculateOverallPnl() >= 0 ? "green" : "red" }}>
              {formatPnl(calculateOverallPnl())}
            </h3>
          </span>
        </div>
        <div className="max-profit overall">
          <h4>Biggest Profit</h4>
          <h3 style={{ color: calculateMaxProfit() >= 0 ? "green" : "red" }}>
            {calculateMaxProfit() >= 0 ? "+" : "-"}
            {formatPnl(calculateMaxProfit())}
          </h3>
        </div>
        <div className="max-loss overall">
          <h4>Biggest Loss</h4>
          <h3 style={{ color: calculateMaxLoss() >= 0 ? "green" : "red" }}>
            {formatPnl(calculateMaxLoss())}
          </h3>
        </div>
      </div>
    </main>
  );
}
