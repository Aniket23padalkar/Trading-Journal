import { createContext, useEffect, useState } from "react";
import type {
  ContextProviderProps,
  StatsContextType,
} from "../types/context.types.js";
import type { GetOverallStatsData } from "../types/stats.types.js";
import { GetOverallStats } from "../api/statsApi.js";

export const StatsContext = createContext<StatsContextType | null>(null);

export default function StatsProvider({ children }: ContextProviderProps) {
  const [overallStats, setOverallStats] = useState<GetOverallStatsData | null>(
    null,
  );
  const [overallStatsLoading, setOverallStatsLoading] = useState<boolean>(true);

  async function fetchOverallStats() {
    setOverallStatsLoading(true);
    try {
      const result = await GetOverallStats();

      setOverallStats(result);
    } catch (err) {
      console.error(err);
    } finally {
      setOverallStatsLoading(false);
    }
  }

  useEffect(() => {
    fetchOverallStats();
  }, []);

  return (
    <StatsContext.Provider value={{ overallStats, overallStatsLoading }}>
      {children}
    </StatsContext.Provider>
  );
}
