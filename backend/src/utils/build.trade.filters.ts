import type { GetTradeQueryData } from "../schemas/trade.schema.js";
import type { BuildFilterValues } from "../types/trade.types.js";

export default function buildTradeFilters(
  query: GetTradeQueryData,
  user_id: string,
) {
  const {
    direction,
    order_status,
    market_type,
    position,
    fromDate,
    toDate,
    year,
    month,
    pnlSort,
    dateTimeSort,
  } = query;

  let conditions: string[] = [`user_id = $1`];
  let values: BuildFilterValues[] = [user_id];
  let index = 2;

  if (direction) {
    conditions.push(`direction = $${index++}`);
    values.push(direction);
  }

  if (order_status) {
    conditions.push(`order_status = $${index++}`);
    values.push(order_status);
  }

  if (market_type) {
    conditions.push(`market_type = $${index++}`);
    values.push(market_type);
  }

  if (position) {
    conditions.push(`position = $${index++}`);
    values.push(position);
  }

  if (fromDate && toDate) {
    conditions.push(`entry_time BETWEEN $${index++} AND $${index++}`);
    values.push(fromDate, toDate);
  }

  if (year) {
    conditions.push(`EXTRACT(YEAR FROM entry_time) = $${index++}`);
    values.push(year);
  }

  if (month) {
    conditions.push(`EXTRACT(MONTH FROM entry_time) = $${index++}`);
    values.push(month);
  }

  let orderByArr = [];

  // if (pnlSort === "asc") orderByArr.push("t.pnl ASC");
  // if (pnlSort === "desc") orderByArr.push("t.pnl DESC");

  if (dateTimeSort === "asc") orderByArr.push("entry_time ASC");
  if (dateTimeSort === "desc") orderByArr.push("entry_time DESC");

  if (orderByArr.length === 0) {
    orderByArr.push("entry_time ASC");
  }

  const orderBy = orderByArr.join(", ");

  return {
    whereClause: conditions.join(" AND "),
    values,
    index,
    orderBy,
  };
}
