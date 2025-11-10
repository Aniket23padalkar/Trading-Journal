import { useMemo } from "react";

export default function useStatsCalculations(trades) {
  return useMemo(() => {
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
        CTCTrades: 0,
        closedTrades: 0,
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

    const CTCTrades = closedTrades.filter(
      (trade) => Number(trade.stats.pnl) === 0
    ).length;

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
      CTCTrades,
      closedTrades,
    };
  }, [trades]);
}
