/** URL search helpers for compare selection (`compare` on /specialties, `ids` on /comparer). */

export interface CompareSearch {
  ids?: string;
  note?: number;
  analyze?: number;
  view?: "dashboard";
}

export function parseCompareIds(ids?: string): number[] {
  if (!ids) return [];
  return ids
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 3);
}

export function formatCompareIds(ids: number[]): string | undefined {
  const unique = [...new Set(ids)].slice(0, 3);
  return unique.length > 0 ? unique.join(",") : undefined;
}
