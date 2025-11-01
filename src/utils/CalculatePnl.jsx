export default function calculatePnL(avgBuy, avgSell, totalQty) {
  const b = Number(avgBuy);
  const s = Number(avgSell);
  const q = Number(totalQty);

  if (!b || !s) return 0;

  let pnl = (s - b) * q;

  return pnl.toFixed(2);
}
