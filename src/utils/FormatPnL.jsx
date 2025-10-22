export default function FormatPnL(value) {
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
