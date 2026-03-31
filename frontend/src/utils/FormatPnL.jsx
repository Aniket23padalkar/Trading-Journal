export default function FormatPnL(value = 0) {
  const num = Number(value);

  if (isNaN(num)) return "0.00";

  if (num >= 10000000 || num <= -10000000) {
    return (num / 10000000).toFixed(2) + "Cr";
  } else if (num >= 100000 || num <= -100000) {
    return (num / 100000).toFixed(2) + "L";
  } else if (num >= 1000 || num <= -1000) {
    return (num / 1000).toFixed(2) + "K";
  } else {
    return num.toFixed(2);
  }
}
