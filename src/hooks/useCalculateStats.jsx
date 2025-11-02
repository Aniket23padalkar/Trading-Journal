import { useMemo } from "react";

export default function useCalculateStats(entries, formData) {
  const { avgBuy, avgSell, totalQty, avgRisk } = useMemo(() => {
    const qty = Number(entries.initialQty) || 0;
    const risk = Number(entries.initialRisk) || 0;
    let totalBuy = 0;
    let totalSell = 0;

    const validEntry = entries.addedEntries.filter(
      (entry) =>
        entry.buyPrice !== "" &&
        entry.sellPrice !== "" &&
        entry.quantity !== "" &&
        entry.risk !== "" &&
        entry.entryTime !== ""
    );

    const totalCount = validEntry.length + 1;

    if (formData.status === "Open") {
      if (formData.order === "BUY") {
        totalBuy =
          (Number(entries.initialBuy) || 0) +
          entries.addedEntries.reduce(
            (acc, entry) => acc + (Number(entry.buyPrice) || 0),
            0
          );
      } else if (formData.order === "SELL") {
        totalSell =
          (Number(entries.initialSell) || 0) +
          entries.addedEntries.reduce(
            (acc, entry) => acc + (Number(entry.sellPrice) || 0),
            0
          );
      }
    } else {
      totalBuy =
        (Number(entries.initialBuy) || 0) +
        entries.addedEntries.reduce(
          (acc, entry) => acc + (Number(entry.buyPrice) || 0),
          0
        );
      totalSell =
        (Number(entries.initialSell) || 0) +
        entries.addedEntries.reduce(
          (acc, entry) => acc + (Number(entry.sellPrice) || 0),
          0
        );
    }

    const totalQty =
      qty +
      entries.addedEntries.reduce(
        (acc, entry) => acc + (Number(entry.quantity) || 0),
        0
      );

    const totalRisk =
      risk +
      entries.addedEntries.reduce(
        (acc, entry) => acc + Number(entry.risk) || 0,
        0
      );

    const avgBuy = totalCount > 0 ? totalBuy / totalCount : 0;
    const avgSell = totalCount > 0 ? totalSell / totalCount : 0;
    const avgRisk = totalCount > 0 ? totalRisk / totalCount : 0;

    return { avgBuy, avgSell, totalQty, avgRisk };
  }, [entries, formData.order, formData.status]);

  return { avgBuy, avgSell, totalQty, avgRisk };
}
