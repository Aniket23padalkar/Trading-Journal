import type { ApiResponse } from "../types/api.response.js";
import type { GetOverallStatsData } from "../types/stats.types.js";

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
