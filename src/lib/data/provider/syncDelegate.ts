import type { CareerSearchOptions, CareerSearchResult } from "../careerSearch";
import type { Specialty } from "../types";
import type { BacSeriesOption } from "../types";
import type { SpecialtyDetail, TranslateFn } from "../specialtyDetail";

/**
 * Optional synchronous delegate for local providers (mock).
 * UI still uses sync service helpers; remote providers omit this and require async APIs.
 */
export interface SyncSpecialtyDelegate {
  readonly id: string;
  getSpecialties(): Specialty[];
  getSpecialtyById(id: number): Specialty | undefined;
  getSpecialtiesByIds(ids: number[]): Specialty[];
  getSpecialtyDetail(specialty: Specialty, t: TranslateFn): SpecialtyDetail;
  getBacSeries(): BacSeriesOption[];
  findSameNameCollisions(): Map<string, Specialty[]>;
  hasNameCollision(nameOrGroup: string): boolean;
  searchCareers(t: TranslateFn, options?: CareerSearchOptions): CareerSearchResult[];
  getCareerSearchSuggestions(t: TranslateFn, query: string, limit?: number): string[];
}
