import { useContext } from "react";
import { StatsContext } from "../context/StatsContext.js";
import type { StatsContextType } from "../types/context.types.js";

export function useStatsContext(): StatsContextType {
  const context = useContext(StatsContext);

  if (!context) {
    throw new Error("useStatsContext must be used within a StatsProvider");
  }

  return context;
}
