import type { ApiResponse } from "../types/api.response.js";
import type { GetMonthlyPnlData } from "../types/stats.types.js";

const API = import.meta.env.VITE_API_URL;

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
