import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useTradesData(key, initialValue) {
  const oldTrades = useLocalStorage("trades", []);
  const [tradesV2, setTradesV2] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    if (tradesV2 !== initialValue) return;
    if (!Array.isArray(oldTrades) || oldTrades.length === 0) return;

    const needsUpdate = oldTrades.some((t) => !t.entries);

    if (!needsUpdate) return;

    const updated = oldTrades.map((t) => {
      if (t.entries) return t;

      return {
        id: t.id || "",
        version: 2,
        formData: {
          symbol: t.formData.symbol || "",
          order: t.formData.order || "",
          status: t.formData.status || "",
          marketType: t.formData.marketType || "",
          position: t.formData.position || "",
          rating: t.formData.rating || "",
          description: t.formData.description || "",
        },
        entries: {
          initialBuy: t.formData.buyPrice || 0,
          initialSell: t.formData.sellPrice || 0,
          initialQty: t.formData.quantity || 0,
          initialRisk: t.formData.risk || 0,
          initialEntryTime: t.formData.entryTime,
          initialExitTime: t.formData.exitTime,
          addedEntries: [],
        },
        stats: {
          totalQty: t.formData.quantity || 0,
          avgBuy: t.formData.buyPrice || 0,
          avgSell: t.formData.sellPrice || 0,
          pnl: t.pnl || 0,
          avgRisk: t.formData.risk || 0,
          avgRR: t.rrRatio || 0,
        },
        createdAt: t.createdAt || Date.now(),
        updatedAt: t.updatedAt || Date.now(),
      };
    });

    setTradesV2(updated);
  }, [oldTrades]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(tradesV2));
  }, [key, tradesV2]);

  return [tradesV2, setTradesV2];
}
