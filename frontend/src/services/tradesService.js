const API = "http://localhost:5000/api/trades";

export async function insertTrade(formData, execution) {
  try {
    const res = await fetch(`${API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, executions: execution }),
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

export async function getTradesData(params) {
  const query = new URLSearchParams(params).toString();

  try {
    const res = await fetch(`${API}?${query}`, {
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

export async function updateTrade(id, formData, execution) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, executions: execution }),
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

export async function deleteTrade(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
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

export async function getYearAndMonth() {
  try {
    const res = await fetch(`${API}/yearmonth`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

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

    const formattedMonths = data.months.map((m) => ({
      label: monthOrder[m - 1],
      value: m,
    }));

    return { years: data.years, months: formattedMonths };
  } catch (err) {
    console.log(err.message);
    throw err;
  }
}

export async function getMonthlyPnl(year) {
  try {
    const res = await fetch(`${API}/monthly-pnl?year=${year}`, {
      method: "GET",
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

export async function getFilterStats(params) {
  const query = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API}/stats?${query}`, {
      method: "GET",
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
