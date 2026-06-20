export default function FormatNumbers(value: number) {
  if (value == null || isNaN(value)) return "-";

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
