import type { Specialty } from "@/lib/data";
import { scoreSpecialties } from "./scoreSpecialty";
import type { ScoredSpecialty, StudentProfile } from "./types";

export function rankSpecialtiesWithProfile(profile: StudentProfile, list: Specialty[]): ScoredSpecialty[] {
  const scored = scoreSpecialties(profile, list);
  return scored.sort((a, b) => {
    if (b.breakdown.total !== a.breakdown.total) return b.breakdown.total - a.breakdown.total;
    return b.probabilityMatchPct - a.probabilityMatchPct;
  });
}

export function getTopScored(scored: ScoredSpecialty[], n: number): ScoredSpecialty[] {
  return scored.slice(0, n);
}
