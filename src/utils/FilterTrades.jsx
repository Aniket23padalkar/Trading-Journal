export default function FilterTrades(trades, filterValue) {
  let filtered = trades;

  if (filterValue.order !== "") {
    filtered = filtered.filter(
      (item) => item.formData.order === filterValue.order
    );
  }
  if (filterValue.status !== "") {
    filtered = filtered.filter(
      (item) => item.formData.status === filterValue.status
    );
  }
  if (filterValue.marketType !== "") {
    filtered = filtered.filter(
      (item) => item.formData.marketType === filterValue.marketType
    );
  }
  if (filterValue.position !== "") {
    filtered = filtered.filter(
      (item) => item.formData.position === filterValue.position
    );
  }
  if (filterValue.fromDate && filterValue.toDate) {
    const start = new Date(filterValue.fromDate);
    const end = new Date(filterValue.toDate);
    end.setHours(23, 59, 59, 999);

    filtered = filtered.filter((item) => {
      const entry = new Date(item.formData.entryTime);

      return entry >= start && entry <= end;
    });
  }
  if (filterValue.year !== "") {
    filtered = filtered.filter((trade) => {
      const tradesYear = new Date(trade.formData.entryTime).getFullYear();

      return tradesYear === new Date(filterValue.year).getFullYear();
    });
  }
  if (filterValue.month) {
    filtered = filtered.filter((item) => {
      let tradesMonth = new Date(item.formData.entryTime).toLocaleString(
        "en-IN",
        { month: "short" }
      );
      if (tradesMonth === "Sept") tradesMonth = "Sep";

      return tradesMonth === filterValue.month;
    });
  }

  return filtered;
}
