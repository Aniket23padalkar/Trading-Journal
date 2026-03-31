export default function buildTradeFilters(query, userId) {
  const {
    order,
    status,
    marketType,
    position,
    fromDate,
    toDate,
    year,
    month,
    pnlSort,
    dateTimeSort,
  } = query;

  let conditions = [`t.user_id = $1`];
  let values = [userId];
  let index = 2;

  if (order) {
    conditions.push(`t.order_type = $${index++}`);
    values.push(order);
  }

  if (status) {
    conditions.push(`t.status = $${index++}`);
    values.push(status);
  }

  if (marketType) {
    conditions.push(`t.market_type = $${index++}`);
    values.push(marketType);
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
