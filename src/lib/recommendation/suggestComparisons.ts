import { getSpecialties, type Specialty } from "@/lib/data";
import { scoreSpecialty } from "./scoreSpecialty";
import { sectorOverlap } from "./matchers";
import type { StudentProfile } from "./types";

/**
 * Suggest 2–3 specialties often compared with `anchor` (same sector, similar tags, close score).
 */
export function getSuggestedComparisons(
  anchor: Specialty,
  profile: StudentProfile | null,
  limit = 3,
): Specialty[] {
  const others = getSpecialties().filter((s) => s.id !== anchor.id);
  const scored = others.map((s) => {
    let pts = sectorOverlap(anchor, s) * 25;
    const sharedInterests = (anchor.interestTags ?? []).filter((t) => (s.interestTags ?? []).includes(t)).length;
    const sharedGoals = (anchor.goalTags ?? []).filter((t) => (s.goalTags ?? []).includes(t)).length;
    pts += sharedInterests * 12 + sharedGoals * 10;
    if (anchor.nameGroup === s.nameGroup && anchor.id !== s.id) pts += 8;
    if (profile) {
      pts += scoreSpecialty(profile, s).breakdown.total * 0.15;
    }
    return { s, pts };
  });

  scored.sort((a, b) => b.pts - a.pts);
  const out: Specialty[] = [];
  const seenGroups = new Set<string>([anchor.nameGroup]);
  for (const { s } of scored) {
    if (out.length >= limit) break;
    if (seenGroups.has(s.nameGroup) && out.some((x) => x.nameGroup === s.nameGroup)) continue;
    out.push(s);
    seenGroups.add(s.nameGroup);
  }
  return out;
}

/** Preset comparison triples biased by profile when possible */
export function getSuggestedComparisonSets(profile: StudentProfile | null): number[][] {
  if (!profile || (profile.interests.length === 0 && profile.goals.length === 0)) {
    return [
      [1, 2, 3],
      [4, 5],
      [4, 6, 12],
      [8, 9],
      [10, 11],
    ];
  }

  const all = getSpecialties().filter((s) => s.series.includes(profile.serie));
  const ranked = all
    .map((s) => ({ id: s.id, total: scoreSpecialty(profile, s).breakdown.total }))
    .sort((a, b) => b.total - a.total);

  const topIds = ranked.slice(0, 3).map((x) => x.id);
  if (topIds.length >= 2) {
    return [topIds, [1, 2, 3], [4, 12, 6], [8, 9], [10, 11]];
  }
  return [[1, 2, 3], [4, 5], [8, 9]];
}
