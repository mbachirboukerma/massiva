import type { Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { WEIGHTS } from "./weights";
import {
  primaryGoalMatch,
  primaryInterestMatch,
  scoreGoals,
  scoreInterests,
  serieMatches,
} from "./matchers";
import type { ScoreBreakdown, ScoredSpecialty, StudentProfile } from "./types";

function pickExplainKey(
  profile: StudentProfile,
  specialty: Specialty,
  interestScore: number,
  goalScore: number,
): Pick<ScoreBreakdown, "explainKey" | "explainVars"> {
  const interest = primaryInterestMatch(profile, specialty);
  const goal = primaryGoalMatch(profile, specialty);

  if (interest && goal && interestScore >= 40 && goalScore >= 40) {
    return {
      explainKey: "reco.explain.both",
      explainVars: { interest: interest, goal: goal },
    };
  }
  if (interest && interestScore >= 35) {
    return { explainKey: "reco.explain.interest", explainVars: { tag: interest } };
  }
  if (goal && goalScore >= 35) {
    return { explainKey: "reco.explain.goal", explainVars: { tag: goal } };
  }
  if (serieMatches(profile, specialty) && profile.interests.length === 0 && profile.goals.length === 0) {
    return { explainKey: null };
  }
  return { explainKey: null };
}

export function scoreSpecialty(profile: StudentProfile, specialty: Specialty): ScoredSpecialty {
  const prob = computeProbability(profile.note, specialty.predicted2027);
  const accessibility = prob.matchPct;
  const interests = scoreInterests(profile, specialty);
  const goals = scoreGoals(profile, specialty);
  const serieBonus = serieMatches(profile, specialty) ? 100 : 0;

  const hasPersonalization = profile.interests.length > 0 || profile.goals.length > 0;

  let total: number;
  if (!hasPersonalization) {
    total = accessibility;
  } else {
    total = Math.round(
      accessibility * WEIGHTS.accessibility +
        interests * WEIGHTS.interests +
        goals * WEIGHTS.goals +
        serieBonus * WEIGHTS.serieBonus,
    );
  }

  const { explainKey, explainVars } = pickExplainKey(profile, specialty, interests, goals);

  const breakdown: ScoreBreakdown = {
    accessibility,
    interests,
    goals,
    serieBonus,
    total: Math.max(0, Math.min(100, total)),
    explainKey,
    explainVars,
  };

  return {
    specialty,
    breakdown,
    probabilityMatchPct: accessibility,
  };
}

export function scoreSpecialties(profile: StudentProfile, list: Specialty[]): ScoredSpecialty[] {
  return list.map((s) => scoreSpecialty(profile, s));
}
