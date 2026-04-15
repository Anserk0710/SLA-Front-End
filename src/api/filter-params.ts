type FilterParam = string | number | undefined;

export function resolveOptionalFilterParam(...values: FilterParam[]) {
  for (const value of values) {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized) {
        return normalized;
      }
    }
  }

  return undefined;
}
