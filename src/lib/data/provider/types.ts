import type { CareerSearchOptions, CareerSearchResult } from "../careerSearch";
import type { Specialty } from "../types";
import type { BacSeriesOption } from "../types";
import type { SpecialtyDetail, TranslateFn } from "../specialtyDetail";

/** Canonical async data contract — implement for mock, Sheets, or API. */
export interface SpecialtyProvider {
  readonly id: string;
  getSpecialties(): Promise<Specialty[]>;
  getSpecialtyById(id: number): Promise<Specialty | undefined>;
  getSpecialtiesByIds(ids: number[]): Promise<Specialty[]>;
  getSpecialtyDetail(specialty: Specialty, t: TranslateFn): Promise<SpecialtyDetail>;
  getBacSeries(): Promise<BacSeriesOption[]>;
  findSameNameCollisions(): Promise<Map<string, Specialty[]>>;
  hasNameCollision(nameOrGroup: string): Promise<boolean>;
  searchCareers(t: TranslateFn, options?: CareerSearchOptions): Promise<CareerSearchResult[]>;
  getCareerSearchSuggestions(t: TranslateFn, query: string, limit?: number): Promise<string[]>;
}
