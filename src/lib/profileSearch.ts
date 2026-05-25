import { profileToSearch, type StudentProfile } from "@/lib/studentProfile";

/** Merge student profile into route search objects for cross-page navigation. */
export function withProfileSearch<T extends Record<string, unknown>>(
  base: T,
  profile: StudentProfile | null,
): T & { serie?: string; note?: number; interests?: string; goals?: string } {
  if (!profile) return base;
  const p = profileToSearch(profile);
  return { ...base, ...p };
}
