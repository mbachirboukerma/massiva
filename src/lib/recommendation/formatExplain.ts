import type { ScoreBreakdown } from "./types";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

/** Resolve i18n vars for reco explanation keys (tag ids → human labels). */
export function formatRecoExplanation(t: TFn, breakdown: ScoreBreakdown): string | null {
  if (!breakdown.explainKey) return null;
  const vars = { ...breakdown.explainVars };
  if (vars.tag && typeof vars.tag === "string") {
    if (breakdown.explainKey.includes("goal")) {
      vars.tag = t(`form.goal.${vars.tag}.label`);
    } else {
      vars.tag = t(`form.interest.${vars.tag}`);
    }
  }
  if (vars.interest && typeof vars.interest === "string") {
    vars.interest = t(`form.interest.${vars.interest}`);
  }
  if (vars.goal && typeof vars.goal === "string") {
    vars.goal = t(`form.goal.${vars.goal}.label`);
  }
  return t(breakdown.explainKey, vars);
}
