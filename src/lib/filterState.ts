type FilterResult =
  | { matched: false }
  | { matched: true; value: unknown };

/**
 * Recursively filters a value against a query string.
 *
 * Objects are treated as atomic: if any key name or value anywhere inside
 * an object matches, the whole object is returned (minus function-valued keys).
 * This preserves context — e.g. searching "alice" returns the full user record,
 * not just the one matching field.
 *
 * Arrays filter their items independently using the same rule.
 */
export function filterState(value: unknown, query: string): FilterResult {
  if (typeof value === 'function') return { matched: false };

  const q = query.toLowerCase();

  if (value === null || value === undefined || typeof value !== 'object') {
    return String(value).toLowerCase().includes(q)
      ? { matched: true, value }
      : { matched: false };
  }

  if (Array.isArray(value)) {
    const kept: unknown[] = [];
    for (const item of value) {
      const result = filterState(item, query);
      if (result.matched) kept.push(result.value);
    }
    return kept.length > 0 ? { matched: true, value: kept } : { matched: false };
  }

  // Object: if anything inside it matches, return the full object (without functions)
  const obj = value as Record<string, unknown>;
  const dataEntries = Object.entries(obj).filter(([, v]) => typeof v !== 'function');

  const hasMatch = dataEntries.some(([k, v]) =>
    k.toLowerCase().includes(q) || filterState(v, query).matched
  );

  return hasMatch
    ? { matched: true, value: Object.fromEntries(dataEntries) }
    : { matched: false };
}
