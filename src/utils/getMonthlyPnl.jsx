export default function getMonthlyPnl(trades, selectedYear) {
  const months = Array(12).fill(0);

  trades.forEach((trade) => {
    if (!trade.formData.exitTime || isNaN(trade.pnl)) return;

    const date = new Date(trade.formData.exitTime);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (year === selectedYear) {
      months[month] += Number(trade.pnl);
    }
  });

  const monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthName.map((m, i) => ({
    month: m,
    pnl: months[i],
  }));
}
