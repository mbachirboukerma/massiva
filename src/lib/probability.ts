import type { Specialty } from "@/lib/data";

export type ProbabilityLevel = "tres-probable" | "possible" | "difficile" | "tres-difficile";

export interface ProbabilityInfo {
  level: ProbabilityLevel;
  labelKey: string; // i18n key
  gap: number;
  tokenClass: string;
  colorVar: string; // for ring
  matchPct: number; // 0-100 for ring
}

export function computeProbability(grade: number, predicted: number): ProbabilityInfo {
  const gap = +(grade - predicted).toFixed(2);
  // map gap [-3..+3] -> match 5..95
  const matchPct = Math.max(5, Math.min(95, Math.round(50 + gap * 18)));
  if (gap > 0.5) {
    return { level: "tres-probable", labelKey: "prob.tres-probable", gap, tokenClass: "bg-success text-success-foreground", colorVar: "--success", matchPct };
  }
  if (gap >= -0.5) {
    return { level: "possible", labelKey: "prob.possible", gap, tokenClass: "bg-warning text-warning-foreground", colorVar: "--warning", matchPct };
  }
  if (gap >= -1.5) {
    return { level: "difficile", labelKey: "prob.difficile", gap, tokenClass: "bg-danger text-danger-foreground", colorVar: "--danger", matchPct };
  }
  return { level: "tres-difficile", labelKey: "prob.tres-difficile", gap, tokenClass: "bg-critical text-critical-foreground", colorVar: "--critical", matchPct };
}

export function rankSpecialties(list: Specialty[], grade: number): Specialty[] {
  return [...list].sort(
    (a, b) =>
      computeProbability(grade, b.predicted2027).gap -
      computeProbability(grade, a.predicted2027).gap,
  );
}

export function trendDirection(thresholds: Record<number, number>): "up" | "down" | "flat" {
  const years = Object.keys(thresholds).map(Number).sort((a, b) => a - b);
  if (years.length < 2) return "flat";
  const first = thresholds[years[0]];
  const last = thresholds[years[years.length - 1]];
  const delta = last - first;
  if (delta > 0.3) return "up";
  if (delta < -0.3) return "down";
  return "flat";
}
