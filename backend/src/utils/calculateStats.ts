import type { ExecutionsData } from "../schemas/trade.schema.js";

interface CalculateStatsParams {
  executions: ExecutionsData[];
  order_status: "open" | "closed" | null;
}

export default function calculateStats({
  executions,
  order_status,
}: CalculateStatsParams): { pnl: number | null } {
  if (order_status !== "closed") {
    return { pnl: null };
  }
  let totalBuyValue: number = 0;
  let totalSellValue: number = 0;

  for (const exe of executions) {
    const price = Number(exe.price);
    const qty = Number(exe.quantity);

    if (exe.order_type === "buy") {
      totalBuyValue += price * qty;
    }

    if (exe.order_type === "sell") {
      totalSellValue += price * qty;
    }
  }

  return {
    pnl: totalSellValue - totalBuyValue,
  };
}
