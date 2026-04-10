export default function calculateStats(executions, status) {
  let pnl = 0;
  let totalQty = 0;
  let totalBuyValue = 0;
  let totalSellValue = 0;
  let totalRisk = 0;

  for (const exe of executions) {
    const buy = Number(exe.buy_price) ?? 0;
    const sell = Number(exe.sell_price) ?? 0;
    const quantity = Number(exe.quantity) ?? 0;
    const risk = Number(exe.risk) ?? 0;

    totalQty += quantity;

    totalBuyValue += buy * quantity;
    totalSellValue += sell * quantity;

    totalRisk += risk;

    if (status === "Closed") {
      pnl += (sell - buy) * quantity;
    }
  }

  const avgBuy = totalQty ? totalBuyValue / totalQty : 0;
  const avgSell = totalQty ? totalSellValue / totalQty : 0;
  const avgRisk = executions.length ? totalRisk / executions.length : 0;
  const avgRR = totalRisk ? pnl / totalRisk : 0;

  return {
    pnl,
    avgBuy,
    avgSell,
    avgRisk,
    avgRR,
    totalQty,
  };
}
