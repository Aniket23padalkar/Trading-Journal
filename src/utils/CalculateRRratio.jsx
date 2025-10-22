import calculatePnL from "./CalculatePnl";

export default function CalculateRRratio(formData) {
  const rrRatio =
    calculatePnL(formData.buyPrice, formData.sellPrice, formData.quantity) /
    formData.risk;
  return rrRatio.toFixed(2);
}
