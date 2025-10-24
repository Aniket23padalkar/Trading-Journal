import { useContext } from "react";
import "./tablefooter.css";
import { GlobalContext } from "../../context/Context";
import FormatPnL from "../../utils/FormatPnL";

export default function TableFooter() {
  const { filteredTrades } = useContext(GlobalContext);

  function totalPnL() {
    return filteredTrades.reduce((acc, trade) => acc + Number(trade.pnl), 0);
  }

  function totalRRratio() {
    return filteredTrades
      .reduce((acc, trade) => acc + Number(trade.rrRatio), 0)
      .toFixed(2);
  }

  return (
    <div className="table-footer">
      <div className="table-footer-left">
        <div className="trades-count">
          <p>Trades Count :</p>
          <h1>{filteredTrades.length}</h1>
        </div>
      </div>
      <div className="table-footer-right">
        <div className="total-pnl">
          <p>Total PnL :</p>
          <h1 style={{ color: totalPnL() >= 0 ? "green" : "red" }}>
            {totalPnL() > 0 ? "+" : ""}
            {FormatPnL(totalPnL())}
          </h1>
        </div>
        <div className="total-rr">
          <p>Total RR :</p>
          <h1>{totalRRratio()}X</h1>
        </div>
      </div>
    </div>
  );
}
