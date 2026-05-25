import type { BacSerie, Specialty } from "@/lib/data";

/** Form picker ids — must match InterestsPicker / CareerGoalsPicker. */
export type InterestId =
  | "sciences"
  | "sante"
  | "tech"
  | "langues"
  | "art"
  | "business"
  | "ingenierie"
  | "social"
  | "lettres"
  | "international";

export type GoalId = "salary" | "stability" | "abroad" | "passion";

export type SectorTag =
  | "health"
  | "tech"
  | "engineering"
  | "business"
  | "languages"
  | "design";

export interface StudentProfile {
  serie: BacSerie;
  note: number;
  interests: InterestId[];
  goals: GoalId[];
}

export interface ScoreBreakdown {
  accessibility: number;
  interests: number;
  goals: number;
  serieBonus: number;
  total: number;
  /** Primary i18n key explaining the personalization boost */
  explainKey: string | null;
  explainVars?: Record<string, string | number>;
}

export interface ScoredSpecialty {
  specialty: Specialty;
  breakdown: ScoreBreakdown;
  probabilityMatchPct: number;
}
