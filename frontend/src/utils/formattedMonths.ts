import type {
  FormattedMonthsData,
  GetYearAndMonthData,
  YearMonthsData,
} from "../types/trades.types.js";

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

interface GetFormattedMonthsParams {
  data: GetYearAndMonthData[];
  selectedYear: number;
}

export const getFormattedMonths = ({
  data,
  selectedYear,
}: GetFormattedMonthsParams): FormattedMonthsData[] => {
  if (!selectedYear || isNaN(selectedYear)) {
    const allMonths: number[] = data.flatMap((item) => item.months);

    const uniqueMonths: number[] = [...new Set(allMonths)];

    uniqueMonths.sort((a, b) => a - b);

    return uniqueMonths.map((m: number) => ({
      label: monthOrder[m - 1],
      value: m,
    }));
  }
  const found = data.find((item) => item.year === selectedYear);

  if (!found) return [];

  return found.months.map((m) => ({
    label: monthOrder[m - 1],
    value: m,
  }));
};
