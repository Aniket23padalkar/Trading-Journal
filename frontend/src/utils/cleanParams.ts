export function cleanParams(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    if (value === "" || value === null || value === undefined) {
      continue;
    }

    if (value instanceof Date) {
      if (isNaN(value.getTime())) continue;
      result[key] = value.toISOString();
    } else {
      result[key] = value;
    }
  }

  return result;
}
