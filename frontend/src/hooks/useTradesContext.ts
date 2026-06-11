import { useContext } from "react";
import { TradeContext } from "../context/TradesContext.js";
import type { TradesContextType } from "../types/context.types.js";

export function useTradesContext(): TradesContextType {
  const context = useContext(TradeContext);

  if (!context) {
    throw new Error("useTradesContext must be used within a TradesProvider");
  }

  return context;
}
