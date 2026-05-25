const KEY = "massiva:recentCompares";

export interface RecentCompare {
  ids: number[];
  at: number;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getRecentCompares(): RecentCompare[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 5);
  } catch {
    return [];
  }
}

export function pushRecentCompare(ids: number[]) {
  if (!isBrowser() || ids.length < 2) return;
  const key = ids.slice().sort((a, b) => a - b).join(",");
  const current = getRecentCompares().filter(
    (r) => r.ids.slice().sort((a, b) => a - b).join(",") !== key,
  );
  const next = [{ ids, at: Date.now() }, ...current].slice(0, 5);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}
