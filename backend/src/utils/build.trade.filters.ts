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

  let conditions = [`t.user_id = $1`];
  let values: BuildFilterValues[] = [user_id];
  let index = 2;

  if (direction) {
    conditions.push(`t.direction = $${index++}`);
    values.push(direction);
  }

  if (order_status) {
    conditions.push(`t.order_status = $${index++}`);
    values.push(order_status);
  }

  if (market_type) {
    conditions.push(`t.market_type = $${index++}`);
    values.push(market_type);
  }

  if (position) {
    conditions.push(`t.position = $${index++}`);
    values.push(position);
  }

  if (fromDate && toDate) {
    conditions.push(`l.first_entry BETWEEN $${index++} AND $${index++}`);
    values.push(fromDate, toDate);
  }

  if (year) {
    conditions.push(`EXTRACT(YEAR FROM l.first_entry) = $${index++}`);
    values.push(year);
  }

  if (month) {
    conditions.push(`EXTRACT(MONTH FROM l.first_entry) = $${index++}`);
    values.push(month);
  }

  let orderByArr = [];

  if (pnlSort === "ASC") orderByArr.push("t.pnl ASC");
  if (pnlSort === "DESC") orderByArr.push("t.pnl DESC");

  if (dateTimeSort === "ASC") orderByArr.push("l.first_entry ASC");
  if (dateTimeSort === "DESC") orderByArr.push("l.first_entry DESC");

  if (orderByArr.length === 0) {
    orderByArr.push("l.first_entry ASC");
  }

  const orderBy = orderByArr.join(", ");

  return {
    whereClause: conditions.join(" AND "),
    values,
    index,
    orderBy,
  };
}
