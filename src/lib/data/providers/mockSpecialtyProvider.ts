import {
  specialties,
  specialtyById,
  bacSeries,
  findSameNameCollisions,
  hasNameCollision,
} from "@/data/specialties";
import { getMockDetail } from "@/lib/mockDetailData";
import {
  getCareerSearchSuggestionsFromList,
  searchCareersInList,
} from "../careerSearch";
import type { SpecialtyProvider } from "../provider/types";
import type { SyncSpecialtyDelegate } from "../provider/syncDelegate";
import type { Specialty } from "../types";
import type { SpecialtyDetail, TranslateFn } from "../specialtyDetail";

/** Synchronous mock delegate — backs legacy sync service helpers. */
export const mockSpecialtySyncDelegate: SyncSpecialtyDelegate = {
  id: "mock",

  getSpecialties(): Specialty[] {
    return specialties;
  },

  getSpecialtyById(id: number): Specialty | undefined {
    return specialtyById(id);
  },

  getSpecialtiesByIds(ids: number[]): Specialty[] {
    return ids
      .map((id) => specialtyById(id))
      .filter((s): s is Specialty => s != null)
      .slice(0, 3);
  },

  getSpecialtyDetail(specialty: Specialty, t: TranslateFn): SpecialtyDetail {
    return getMockDetail(specialty, t);
  },

  getBacSeries() {
    return bacSeries;
  },

  findSameNameCollisions,
  hasNameCollision,

  searchCareers(t, options) {
    return searchCareersInList(specialties, t, options);
  },

  getCareerSearchSuggestions(t, query, limit) {
    return getCareerSearchSuggestionsFromList(specialties, t, query, limit);
  },
};

function resolve<T>(fn: () => T): Promise<T> {
  return Promise.resolve(fn());
}

/** Async mock provider — same data, Promise-based contract for Sheets/API parity. */
export const mockSpecialtyProvider: SpecialtyProvider = {
  id: "mock",

  getSpecialties: () => resolve(() => mockSpecialtySyncDelegate.getSpecialties()),
  getSpecialtyById: (id) => resolve(() => mockSpecialtySyncDelegate.getSpecialtyById(id)),
  getSpecialtiesByIds: (ids) => resolve(() => mockSpecialtySyncDelegate.getSpecialtiesByIds(ids)),
  getSpecialtyDetail: (specialty, t) =>
    resolve(() => mockSpecialtySyncDelegate.getSpecialtyDetail(specialty, t)),
  getBacSeries: () => resolve(() => mockSpecialtySyncDelegate.getBacSeries()),
  findSameNameCollisions: () => resolve(() => mockSpecialtySyncDelegate.findSameNameCollisions()),
  hasNameCollision: (nameOrGroup) => resolve(() => mockSpecialtySyncDelegate.hasNameCollision(nameOrGroup)),
  searchCareers: (t, options) => resolve(() => mockSpecialtySyncDelegate.searchCareers(t, options)),
  getCareerSearchSuggestions: (t, query, limit) =>
    resolve(() => mockSpecialtySyncDelegate.getCareerSearchSuggestions(t, query, limit)),
};
