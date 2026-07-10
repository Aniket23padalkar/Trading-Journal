export default function getChangedFields(
  original: Record<string, any>,
  formData: Record<string, any>,
): Record<string, any> {
  const changed: Record<string, any> = {};

  for (const key in formData) {
    const formValue = formData[key];
    const originalValue = original[key];

    if (formValue instanceof Date || originalValue instanceof Date) {
      const formTime = new Date(formValue).getTime();
      const originalTime = new Date(originalValue).getTime();

      if (formTime !== originalTime) {
        changed[key] = formValue;
      }
    } else {
      if (formValue !== originalValue) {
        changed[key] = formData[key];
      }
    }
  }
  return changed;
}
