import type { BacSerie } from "@/lib/data";
import type { GoalId, InterestId, StudentProfile } from "@/lib/recommendation/types";

const PROFILE_KEY = "massiva:profile";

const INTEREST_IDS: InterestId[] = [
  "sciences", "sante", "tech", "langues", "art", "business", "ingenierie", "social", "lettres", "international",
];
const GOAL_IDS: GoalId[] = ["salary", "stability", "abroad", "passion"];
const SERIES: BacSerie[] = ["SN", "LN", "SE", "TM"];

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function parseList(raw: string | undefined, allowed: readonly string[]): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter((s) => allowed.includes(s));
}

export function parseProfileFromSearch(search: {
  serie?: string;
  note?: number;
  interests?: string;
  goals?: string;
}): StudentProfile | null {
  if (!search.serie || typeof search.note !== "number") return null;
  if (!SERIES.includes(search.serie as BacSerie)) return null;
  return {
    serie: search.serie as BacSerie,
    note: search.note,
    interests: parseList(search.interests, INTEREST_IDS) as InterestId[],
    goals: parseList(search.goals, GOAL_IDS) as GoalId[],
  };
}

export function profileToSearch(profile: StudentProfile): {
  serie: BacSerie;
  note: number;
  interests?: string;
  goals?: string;
} {
  return {
    serie: profile.serie,
    note: profile.note,
    ...(profile.interests.length > 0 ? { interests: profile.interests.join(",") } : {}),
    ...(profile.goals.length > 0 ? { goals: profile.goals.join(",") } : {}),
  };
}

export function saveStudentProfile(profile: StudentProfile) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function loadStudentProfile(): StudentProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StudentProfile;
    if (!SERIES.includes(p.serie) || typeof p.note !== "number") return null;
    return {
      serie: p.serie,
      note: p.note,
      interests: (p.interests ?? []).filter((i) => INTEREST_IDS.includes(i as InterestId)) as InterestId[],
      goals: (p.goals ?? []).filter((g) => GOAL_IDS.includes(g as GoalId)) as GoalId[],
    };
  } catch {
    return null;
  }
}

/** Merge URL search with persisted profile (URL wins for serie/note; union interests/goals). */
export function resolveStudentProfile(search: {
  serie?: string;
  note?: number;
  interests?: string;
  goals?: string;
}): StudentProfile | null {
  const fromUrl = parseProfileFromSearch(search);
  const stored = loadStudentProfile();
  if (fromUrl) {
    saveStudentProfile(fromUrl);
    return fromUrl;
  }
  return stored;
}

export function hasPersonalization(profile: StudentProfile | null): boolean {
  if (!profile) return false;
  return profile.interests.length > 0 || profile.goals.length > 0;
}
