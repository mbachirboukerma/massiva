import type { SpecialtyProvider } from "./types";
import type { SyncSpecialtyDelegate } from "./syncDelegate";
import { mockSpecialtyProvider, mockSpecialtySyncDelegate } from "../providers/mockSpecialtyProvider";

let activeProvider: SpecialtyProvider = mockSpecialtyProvider;
let activeSyncDelegate: SyncSpecialtyDelegate | null = mockSpecialtySyncDelegate;

/** Swap the active provider (e.g. mock → sheets). Pass sync delegate only for local/sync sources. */
export function registerSpecialtyProvider(
  provider: SpecialtyProvider,
  syncDelegate?: SyncSpecialtyDelegate | null,
): void {
  activeProvider = provider;
  activeSyncDelegate = syncDelegate ?? null;
}

export function getActiveSpecialtyProvider(): SpecialtyProvider {
  return activeProvider;
}

export function getActiveSyncDelegate(): SyncSpecialtyDelegate | null {
  return activeSyncDelegate;
}

export function requireSyncDelegate(): SyncSpecialtyDelegate {
  if (!activeSyncDelegate) {
    throw new Error(
      `[MASSIVA] Sync data access is not available for provider "${activeProvider.id}". ` +
        "Use the async specialtyService APIs (e.g. getSpecialtiesAsync) instead.",
    );
  }
  return activeSyncDelegate;
}
