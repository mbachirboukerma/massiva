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
} from "./types";

export type { BacSeriesOption } from "./types";
export type { SpecialtyDetail, TranslateFn } from "./specialtyDetail";
export type { CareerSearchResult, CareerSearchOptions } from "./careerSearch";
export type { SpecialtyProvider, SyncSpecialtyDelegate } from "./provider";

export {
  registerSpecialtyProvider,
  getActiveSpecialtyProvider,
  getActiveSyncDelegate,
} from "./provider";

export {
  getSpecialties,
  getSpecialtyById,
  getSpecialtiesByIds,
  getSpecialtyDetail,
  getSpecialtyDetailById,
  getBacSeries,
  findSameNameCollisions,
  hasNameCollision,
  getCareerSuggestions,
  searchCareers,
  getCareerSearchSuggestions,
  getSpecialtiesAsync,
  getSpecialtyByIdAsync,
  getSpecialtiesByIdsAsync,
  getSpecialtyDetailAsync,
  getSpecialtyDetailByIdAsync,
  getBacSeriesAsync,
  findSameNameCollisionsAsync,
  hasNameCollisionAsync,
  searchCareersAsync,
  getCareerSearchSuggestionsAsync,
  getCareerSuggestionsAsync,
} from "./specialtyService";
