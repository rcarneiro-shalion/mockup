/**
 * SQL-LIKE search matcher. `%` is a wildcard that matches any run of characters,
 * so "rmm%-lang" matches "rmms-brand-amz-lang". An empty query matches everything.
 * Case-insensitive; falls back to a plain substring test if the pattern can't
 * compile to a RegExp. Returns a predicate so callers can build it once per query.
 */
export function buildQueryMatch(query: string): (s: string) => boolean {
  const q = query.trim();
  if (!q) return () => true;
  const pattern = q
    .split("%")
    .map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  try {
    const re = new RegExp(pattern, "i");
    return (s) => re.test(s);
  } catch {
    const lower = q.toLowerCase();
    return (s) => s.toLowerCase().includes(lower);
  }
}
