import { createContext, useEffect, useState } from "react";
import type {
  ContextProviderProps,
  StatsContextType,
} from "../types/context.types.js";
import type { GetOverallStatsData } from "../types/stats.types.js";
import { GetOverallStats } from "../api/statsApi.js";

export const StatsContext = createContext<StatsContextType | null>(null);

export default function StatsProvider({ children }: ContextProviderProps) {
  const [overallStats, setOverallStats] = useState<GetOverallStatsData>({
    total_pnl: 0,
    max_profit: 0,
    max_loss: 0,
    total_profit: 0,
    total_loss: 0,
    overall_rr: 0,
    average_risk_per_trade: 0,
    total_profit_trades: 0,
    total_loss_trades: 0,
    ctc_trades: 0,
    closed_trades: 0,
    win_rate: 0,
  });
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
