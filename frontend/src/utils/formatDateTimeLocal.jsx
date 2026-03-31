export default function formatDateTimeLocal(date) {
  if (!date) return "";

  return new Date(date).toISOString().slice(0, 16);
}
