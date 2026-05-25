import type { CareerSearchOptions, CareerSearchResult } from "./careerSearch";
import {
  getActiveSpecialtyProvider,
  requireSyncDelegate,
} from "./provider/registry";
import type { Specialty } from "./types";
import type { SpecialtyDetail, TranslateFn } from "./specialtyDetail";

export type { CareerSearchResult, CareerSearchOptions } from "./careerSearch";

// —— Sync API (current UI) — delegates to SyncSpecialtyDelegate when registered ——

export function getSpecialties(): Specialty[] {
  return requireSyncDelegate().getSpecialties();
}

export function getSpecialtyById(id: number): Specialty | undefined {
  return requireSyncDelegate().getSpecialtyById(id);
}

export function getSpecialtiesByIds(ids: number[]): Specialty[] {
  return requireSyncDelegate().getSpecialtiesByIds(ids);
}

export function getSpecialtyDetail(specialty: Specialty, t: TranslateFn): SpecialtyDetail {
  return requireSyncDelegate().getSpecialtyDetail(specialty, t);
}

export function getSpecialtyDetailById(id: number, t: TranslateFn): SpecialtyDetail | undefined {
  const specialty = getSpecialtyById(id);
  if (!specialty) return undefined;
  return getSpecialtyDetail(specialty, t);
}

export function getBacSeries() {
  return requireSyncDelegate().getBacSeries();
}

export function findSameNameCollisions() {
  return requireSyncDelegate().findSameNameCollisions();
}

export function hasNameCollision(nameOrGroup: string): boolean {
  return requireSyncDelegate().hasNameCollision(nameOrGroup);
}

export function searchCareers(t: TranslateFn, options: CareerSearchOptions = {}): CareerSearchResult[] {
  return requireSyncDelegate().searchCareers(t, options);
}

export function getCareerSearchSuggestions(t: TranslateFn, query: string, limit = 5): string[] {
  return requireSyncDelegate().getCareerSearchSuggestions(t, query, limit);
}

/** Alias for career search — debouches page and future recommendation hooks. */
export function getCareerSuggestions(t: TranslateFn, options?: CareerSearchOptions) {
  return searchCareers(t, options);
}

// —— Async API (Sheets / API / React Query) ——

export function getSpecialtiesAsync(): Promise<Specialty[]> {
  return getActiveSpecialtyProvider().getSpecialties();
}

export function getSpecialtyByIdAsync(id: number): Promise<Specialty | undefined> {
  return getActiveSpecialtyProvider().getSpecialtyById(id);
}

export function getSpecialtiesByIdsAsync(ids: number[]): Promise<Specialty[]> {
  return getActiveSpecialtyProvider().getSpecialtiesByIds(ids);
}

export function getSpecialtyDetailAsync(
  specialty: Specialty,
  t: TranslateFn,
): Promise<SpecialtyDetail> {
  return getActiveSpecialtyProvider().getSpecialtyDetail(specialty, t);
}

export async function getSpecialtyDetailByIdAsync(
  id: number,
  t: TranslateFn,
): Promise<SpecialtyDetail | undefined> {
  const specialty = await getSpecialtyByIdAsync(id);
  if (!specialty) return undefined;
  return getSpecialtyDetailAsync(specialty, t);
}

export function getBacSeriesAsync() {
  return getActiveSpecialtyProvider().getBacSeries();
}

export function findSameNameCollisionsAsync() {
  return getActiveSpecialtyProvider().findSameNameCollisions();
}

export function hasNameCollisionAsync(nameOrGroup: string): Promise<boolean> {
  return getActiveSpecialtyProvider().hasNameCollision(nameOrGroup);
}

export function searchCareersAsync(
  t: TranslateFn,
  options: CareerSearchOptions = {},
): Promise<CareerSearchResult[]> {
  return getActiveSpecialtyProvider().searchCareers(t, options);
}

export function getCareerSearchSuggestionsAsync(
  t: TranslateFn,
  query: string,
  limit = 5,
): Promise<string[]> {
  return getActiveSpecialtyProvider().getCareerSearchSuggestions(t, query, limit);
}

export function getCareerSuggestionsAsync(t: TranslateFn, options?: CareerSearchOptions) {
  return searchCareersAsync(t, options);
}
