export default function getChangedFields(
  original: Record<string, any>,
  formData: Record<string, any>,
) {
  const changed = {};

  for (const key in formData) {
    if (formData[key] !== original[key]) {
      changed[key] = formData[key];
    }
  }
  return changed;
}
