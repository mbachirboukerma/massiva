import { useMemo } from "react";
import { getSpecialtyDetail, type Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { getSuggestedComparisons, formatRecoExplanation } from "@/lib/recommendation";
import { getProfileMatchForSpecialty } from "@/lib/aiSimulator";
import type { StudentProfile } from "@/lib/recommendation";
import { useT, useI18n } from "@/i18n/I18nProvider";

export function useSpecialtyDetail(specialty: Specialty, studentGrade?: number, profile?: StudentProfile | null) {
  const t = useT();
  const { locale } = useI18n();

  const detail = useMemo(() => getSpecialtyDetail(specialty, t), [specialty, t, locale]);

  const prob =
    studentGrade != null ? computeProbability(studentGrade, specialty.predicted2027) : null;

  const scored = profile ? getProfileMatchForSpecialty(profile, specialty) : null;
  const profileExplain = scored ? formatRecoExplanation(t, scored.breakdown) : null;
  const aiSummaryText = profileExplain ?? detail.aiSummary;

  const suggestions = useMemo(
    () => getSuggestedComparisons(specialty, profile ?? null, 3),
    [specialty, profile],
  );

  const avgSat = Math.round(
    detail.satisfaction.reduce((a, b) => a + b.value, 0) / detail.satisfaction.length,
  );
  const avgDiff = Math.round(
    detail.difficulty.reduce((a, b) => a + b.value, 0) / detail.difficulty.length,
  );
  const recommendPct = Math.min(98, Math.max(35, Math.round(avgSat * 0.95 + (100 - avgDiff) * 0.05)));

  return {
    t,
    detail,
    prob,
    profileExplain,
    aiSummaryText,
    suggestions,
    avgSat,
    avgDiff,
    recommendPct,
  };
}
