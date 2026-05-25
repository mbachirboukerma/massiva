import type { Specialty } from "@/lib/data";
import type { GoalId, InterestId, StudentProfile } from "./types";

export function overlapRatio(selected: string[], tags: string[]): number {
  if (selected.length === 0 || tags.length === 0) return 0;
  const tagSet = new Set(tags);
  const hits = selected.filter((id) => tagSet.has(id)).length;
  return hits / selected.length;
}

export function scoreInterests(profile: StudentProfile, specialty: Specialty): number {
  if (profile.interests.length === 0) return 0;
  const tags = specialty.interestTags ?? [];
  return Math.round(overlapRatio(profile.interests, tags) * 100);
}

export function scoreGoals(profile: StudentProfile, specialty: Specialty): number {
  if (profile.goals.length === 0) return 0;
  const tags = specialty.goalTags ?? [];
  return Math.round(overlapRatio(profile.goals, tags) * 100);
}

export function serieMatches(profile: StudentProfile, specialty: Specialty): boolean {
  return specialty.series.includes(profile.serie);
}

/** First matching interest tag for explanation copy */
export function primaryInterestMatch(profile: StudentProfile, specialty: Specialty): InterestId | null {
  const tags = new Set(specialty.interestTags ?? []);
  return profile.interests.find((i) => tags.has(i)) ?? null;
}

export function primaryGoalMatch(profile: StudentProfile, specialty: Specialty): GoalId | null {
  const tags = new Set(specialty.goalTags ?? []);
  return profile.goals.find((g) => tags.has(g)) ?? null;
}

export function sectorOverlap(a: Specialty, b: Specialty): number {
  const sa = new Set(a.sectorTags ?? []);
  const sb = b.sectorTags ?? [];
  if (sa.size === 0 || sb.length === 0) return 0;
  return sb.filter((t) => sa.has(t)).length;
}
