import type { ApiResponse, DeleteResponse } from "../types/api.response.js";
import type {
  Data,
  FormattedMonthsData,
  GetYearAndMonthData,
  GetYearAndMonthResponse,
} from "../types/trades.types.js";

const API = import.meta.env.VITE_API_URL;

export async function insertTrade({ formData, executions }) {
  try {
    const res = await fetch(`${API}/api/trades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, executions: executions }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

export async function getTradesData(
  params: Record<string, any>,
): Promise<Data> {
  const query = new URLSearchParams(params).toString();

  try {
    const res = await fetch(`${API}/api/trades?${query}`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<Data> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateTrade({ trade_id, formData, executions }) {
  try {
    const res = await fetch(`${API}/api/trades/${trade_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, executions: executions }),
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteTrade(trade_id: string): Promise<DeleteResponse> {
  try {
    const res = await fetch(`${API}/api/trades/${trade_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result: ApiResponse<{ trade_id: string }> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getYearAndMonth(): Promise<GetYearAndMonthResponse> {
  try {
    const res = await fetch(`${API}/api/trades/yearmonth`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<GetYearAndMonthData> = await res.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    console.log(result);

    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonths: FormattedMonthsData[] = result.data.months.map(
      (m) => ({
        label: monthOrder[m - 1],
        value: m,
      }),
    );

    return { years: result.data.years, months: formattedMonths };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMonthlyPnl(year: number) {
  try {
    const res = await fetch(`${API}/api/trades/monthly-pnl?year=${year}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getFilterStats(params) {
  const query = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API}/api/trades/stats?${query}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
