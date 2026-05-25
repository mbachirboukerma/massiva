/**
 * @deprecated Import career types and functions from `@/lib/data` or `specialtyService` instead.
 * Re-exports preserve backward compatibility for existing import paths.
 */
export type { CareerSearchResult, CareerSearchOptions } from "./careerSearch";
export {
  searchCareers,
  getCareerSearchSuggestions,
  getCareerSuggestions,
} from "./specialtyService";
