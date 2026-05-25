/** Tunable weights for the local recommendation engine (no ML). */
export const WEIGHTS = {
  accessibility: 0.45,
  interests: 0.3,
  goals: 0.2,
  serieBonus: 0.05,
} as const;

/** Minimum tag overlap ratio to count as a strong match */
export const STRONG_TAG_MATCH = 0.5;
