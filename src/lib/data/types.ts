/** Domain types for specialties and careers (stable across mock / API / Sheets). */
export type {
  BacSerie,
  DiplomaType,
  Confidence,
  CareerIconKey,
  Career,
  Specialty,
  InterestTag,
  GoalTag,
  SectorTag,
} from "@/data/specialties";

import { bacSeries } from "@/data/specialties";

export type BacSeriesOption = (typeof bacSeries)[number];
