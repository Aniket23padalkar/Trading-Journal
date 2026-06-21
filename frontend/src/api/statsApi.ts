import type { ApiResponse } from "../types/api.response.js";
import type {
  GetFilteredStatsData,
  GetMonthlyPnlData,
  GetOverallStatsData,
} from "../types/stats.types.js";

const API = import.meta.env.VITE_API_URL;

export const GetOverallStats = async (): Promise<GetOverallStatsData> => {
  try {
    const res = await fetch(`${API}/api/stats/overallstats`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<GetOverallStatsData> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err) {
    throw err;
  }
};

export async function getFilteredStats(
  params: Record<string, any>,
): Promise<GetFilteredStatsData> {
  const query = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API}/api/stats/filteredstats?${query}`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<GetFilteredStatsData> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMonthlyPnl(
  year: number,
): Promise<GetMonthlyPnlData[]> {
  try {
    const res = await fetch(`${API}/api/stats/monthlypnl?year=${year}`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<GetMonthlyPnlData[]> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
