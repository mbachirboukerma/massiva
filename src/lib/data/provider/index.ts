export type { SpecialtyProvider } from "./types";
export type { SyncSpecialtyDelegate } from "./syncDelegate";
export {
  registerSpecialtyProvider,
  getActiveSpecialtyProvider,
  getActiveSyncDelegate,
  requireSyncDelegate,
} from "./registry";
