export default function calculatePnL(buyPrice, sellPrice, quantity) {
  const b = Number(buyPrice);
  const s = Number(sellPrice);
  const q = Number(quantity);

  if (!b || !s) return 0;

  let pnl = (s - b) * q;

  return pnl.toFixed(2);
}
