export function safeMerge<T>(existing: T, incoming: Partial<T>): T {
  const result = { ...existing };

  for (const key in incoming) {
    const value = incoming[key];

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
