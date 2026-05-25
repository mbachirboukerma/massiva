import type { BacSerie } from "@/lib/data";

const HISTORY_KEY = "massiva:history";
const EMAIL_KEY = "massiva:email";

export interface HistoryEntry {
  serie: BacSerie;
  note: number;
  at: number;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 5);
  } catch {
    return [];
  }
}

export function pushHistory(entry: HistoryEntry) {
  if (!isBrowser()) return;
  const current = getHistory().filter(
    (e) => !(e.serie === entry.serie && Math.abs(e.note - entry.note) < 0.001),
  );
  const next = [entry, ...current].slice(0, 5);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function getSavedEmail(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(EMAIL_KEY);
}

export function saveEmail(email: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EMAIL_KEY, email);
}
