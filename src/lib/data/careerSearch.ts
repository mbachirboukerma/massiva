import type { Specialty } from "./types";
import type { TranslateFn } from "./specialtyDetail";

const FEATURED_GROUPS = new Set(["medicine", "cs", "architecture", "business", "pharmacy", "electrical"]);

export interface CareerSearchResult {
  specialty: Specialty;
  matchedCareers: string[];
}

export interface CareerSearchOptions {
  query?: string;
}

/** Pure career/specialty search over an in-memory list (provider-agnostic). */
export function searchCareersInList(
  specialties: Specialty[],
  t: TranslateFn,
  options: CareerSearchOptions = {},
): CareerSearchResult[] {
  const q = (options.query ?? "").trim().toLowerCase();
  const base = q
    ? specialties
    : specialties.filter((s) => FEATURED_GROUPS.has(s.nameGroup) && s.diplomaType !== "Licence");

  if (!q) {
    return base.map((specialty) => ({ specialty, matchedCareers: [] }));
  }

  return base
    .map((specialty) => {
      const nameHit = [t(specialty.nameKey), t(specialty.fullTitleKey), specialty.name, specialty.fullTitle].some(
        (x) => x.toLowerCase().includes(q),
      );
      const matchedCareers: string[] = [];
      for (const c of specialty.careers) {
        const display = c.nameKey ? t(c.nameKey) : c.name;
        if (display.toLowerCase().includes(q)) matchedCareers.push(display);
      }
      if (!nameHit && matchedCareers.length === 0) return null;
      return { specialty, matchedCareers };
    })
    .filter(Boolean) as CareerSearchResult[];
}

export function getCareerSearchSuggestionsFromList(
  specialties: Specialty[],
  t: TranslateFn,
  query: string,
  limit = 5,
): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const s of specialties) {
    for (const c of s.careers) {
      const label = c.nameKey ? t(c.nameKey) : c.name;
      const low = label.toLowerCase();
      if (low.includes(q) && !seen.has(low)) {
        seen.add(low);
        out.push(label);
        if (out.length >= limit) return out;
      }
    }
  }

  return out;
}
