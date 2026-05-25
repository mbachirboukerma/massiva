import { getSpecialties, type Specialty, type BacSerie } from "@/lib/data";
import {
  rankSpecialtiesWithProfile,
  scoreSpecialty,
  formatRecoExplanation,
  type StudentProfile,
} from "@/lib/recommendation";

export interface AiProfile {
  axes: {
    science: number;
    lang: number;
    creativity: number;
    logic: number;
    social: number;
    endurance: number;
  };
  strengths: string[];
  weaknesses: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface AiRecommendation {
  specialty: Specialty;
  match: number;
  reason: string;
}

export interface AiResult {
  summary: string;
  profile: AiProfile;
  recommendations: AiRecommendation[];
  strategy: string[];
  inferredSerie: BacSerie;
}

type TFn = (key: string, vars?: Record<string, string | number>) => string;

function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h >>> 0);
}

function pseudoRandom(seed: number) {
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 1000) / 1000;
  };
}

const KEYWORDS: Array<{
  re: RegExp;
  axes: Partial<AiProfile["axes"]>;
  serie?: BacSerie;
  strengthKeys?: string[];
  weaknessKeys?: string[];
}> = [
  { re: /\b(bio|biolog|svt|médecine|medicine|sciences naturelles|nature|طب|أحياء|بيولوج)\b/i,
    axes: { science: 30, endurance: 20 }, serie: "SN",
    strengthKeys: ["ai.strength.bio"] },
  { re: /\b(math|maths|mathématiques|الرياضيات|mathematic)\b/i,
    axes: { logic: 30, science: 15 }, serie: "TM",
    strengthKeys: ["ai.strength.math"] },
  { re: /\b(faible|weak|nul|bad|pas bon|ضعيف).{0,15}(math|maths|الرياضيات)\b/i,
    axes: { logic: -25 }, weaknessKeys: ["ai.weakness.math"] },
  { re: /\b(langue|languag|english|français|arabe|traduction|لغات|ترجمة)\b/i,
    axes: { lang: 30, social: 10 }, serie: "LN",
    strengthKeys: ["ai.strength.lang"] },
  { re: /\b(étranger|abroad|international|à l['']étranger|الخارج|بالخارج|عالمي)\b/i,
    axes: { lang: 20, creativity: 10 },
    strengthKeys: ["ai.strength.intl"] },
  { re: /\b(stable|sécurité|secure|sûr|stab|مستقر|آمن|أمان)\b/i,
    axes: { endurance: 15 },
    strengthKeys: ["ai.strength.stable"] },
  { re: /\b(salaire|salary|argent|money|riche|راتب|مال)\b/i,
    axes: { logic: 10, endurance: 10 },
    strengthKeys: ["ai.strength.salary"] },
  { re: /\b(art|design|créati|creative|architect|إبداع|تصميم|فن)\b/i,
    axes: { creativity: 30 },
    strengthKeys: ["ai.strength.creative"] },
  { re: /\b(commerce|business|management|économie|economy|تجارة|أعمال|اقتصاد)\b/i,
    axes: { logic: 15, social: 20 }, serie: "SE",
    strengthKeys: ["ai.strength.business"] },
  { re: /\b(informatique|programmation|coding|développeur|tech|برمجة|معلوماتية|تقنية)\b/i,
    axes: { logic: 25, creativity: 15 }, serie: "TM",
    strengthKeys: ["ai.strength.tech"] },
  { re: /\b(rapide|quickly|vite|fast|بسرعة|سريع)\b/i,
    axes: { endurance: -10 },
    strengthKeys: ["ai.strength.fast"] },
  { re: /\b(aide|help|social|soigner|aider|مساعدة|اجتماعي)\b/i,
    axes: { social: 25 },
    strengthKeys: ["ai.strength.social"] },
];

const AXIS_KEYS: Record<keyof AiProfile["axes"], string> = {
  science: "ai.axis.science",
  lang: "ai.axis.lang",
  creativity: "ai.axis.creativity",
  logic: "ai.axis.logic",
  social: "ai.axis.social",
  endurance: "ai.axis.endurance",
};

const INTEREST_AXIS: Partial<Record<string, Partial<AiProfile["axes"]>>> = {
  sciences: { science: 20, logic: 10 },
  sante: { science: 25, social: 15, endurance: 10 },
  tech: { logic: 25, creativity: 10 },
  langues: { lang: 25 },
  art: { creativity: 25 },
  business: { logic: 10, social: 15 },
  ingenieurie: { logic: 20, science: 10 },
  ingénierie: { logic: 20, science: 10 },
  ingenierie: { logic: 20, science: 10 },
  social: { social: 25 },
  lettres: { lang: 15, creativity: 10 },
  international: { lang: 20, social: 10 },
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export interface AiInput {
  prompt: string;
  fileName?: string;
  studentProfile?: StudentProfile | null;
}

export function runAiSimulation(input: AiInput, t: TFn): AiResult {
  const raw = `${input.prompt} ${input.fileName ?? ""}`.trim() || "profile neutral";
  const seed = hashSeed(raw + JSON.stringify(input.studentProfile ?? {}));
  const rand = pseudoRandom(seed);
  const sp = input.studentProfile;

  const axes: AiProfile["axes"] = {
    science: 40 + Math.floor(rand() * 15),
    lang: 40 + Math.floor(rand() * 15),
    creativity: 40 + Math.floor(rand() * 15),
    logic: 40 + Math.floor(rand() * 15),
    social: 40 + Math.floor(rand() * 15),
    endurance: 50 + Math.floor(rand() * 15),
  };

  const strengthKeys: string[] = [];
  const weaknessKeys: string[] = [];
  let inferredSerie: BacSerie = sp?.serie ?? "SN";
  let serieScore = sp ? 1 : 0;

  if (sp) {
    for (const id of sp.interests) {
      const boost = INTEREST_AXIS[id];
      if (boost) {
        for (const [k, v] of Object.entries(boost)) {
          axes[k as keyof AiProfile["axes"]] = clamp(axes[k as keyof AiProfile["axes"]] + (v as number));
        }
      }
    }
    if (sp.goals.includes("salary")) strengthKeys.push("ai.strength.salary");
    if (sp.goals.includes("stability")) strengthKeys.push("ai.strength.stable");
    if (sp.goals.includes("abroad")) strengthKeys.push("ai.strength.intl");
    if (sp.goals.includes("passion")) strengthKeys.push("ai.strength.creative");
  }

  for (const kw of KEYWORDS) {
    if (kw.re.test(raw)) {
      for (const [k, v] of Object.entries(kw.axes)) {
        axes[k as keyof AiProfile["axes"]] = clamp(
          axes[k as keyof AiProfile["axes"]] + (v as number),
        );
      }
      if (kw.serie) {
        serieScore += 1;
        inferredSerie = kw.serie;
      }
      if (kw.strengthKeys) strengthKeys.push(...kw.strengthKeys);
      if (kw.weaknessKeys) weaknessKeys.push(...kw.weaknessKeys);
    }
  }

  if (strengthKeys.length === 0) strengthKeys.push("ai.strength.versatile");
  if (weaknessKeys.length === 0 && axes.logic < 45) weaknessKeys.push("ai.weakness.logic");

  const sortedAxes = (Object.entries(axes) as Array<[keyof AiProfile["axes"], number]>).sort(
    (a, b) => b[1] - a[1],
  );
  const topAxis = sortedAxes[0][0];
  const secondAxis = sortedAxes[1][0];
  const axisLabel = t(AXIS_KEYS[topAxis]);
  const secondaryLabel = t(AXIS_KEYS[secondAxis]);

  let recommendations: AiRecommendation[];

  if (sp && sp.note > 0) {
    const pool = getSpecialties().filter((s) => s.series.includes(sp.serie));
    const ranked = rankSpecialtiesWithProfile(sp, pool).slice(0, 4);
    recommendations = ranked.map(({ specialty, breakdown }) => {
      const match = breakdown.total;
      const explain = formatRecoExplanation(t, breakdown);
      const reason = explain
        ? t("ai.reason.profile", { m: match, explain })
        : match > 75
          ? t("ai.reason.high", { m: match, axis: axisLabel })
          : t("ai.reason.mid", { m: match, axis: axisLabel });
      return { specialty, match, reason };
    });
  } else {
    const scored = getSpecialties().map((s) => {
      let score = 50;
      if (s.series.includes(inferredSerie)) score += 15;
      if (topAxis === "science" && ["stethoscope", "pill", "tooth"].includes(s.iconKey)) score += 18;
      if (topAxis === "logic" && ["code", "zap", "ruler", "trending"].includes(s.iconKey)) score += 18;
      if (topAxis === "lang" && ["languages", "globe"].includes(s.iconKey)) score += 22;
      if (topAxis === "creativity" && ["ruler", "code"].includes(s.iconKey)) score += 14;
      if (topAxis === "social" && ["stethoscope", "languages", "briefcase"].includes(s.iconKey)) score += 12;
      if (axes.logic < 35 && s.series.includes("TM") && !s.series.includes(inferredSerie)) score -= 18;
      score += Math.floor((rand() - 0.5) * 8);
      score += Math.min(10, s.internationalOpportunity * 2 - 4);
      return { s, match: clamp(score, 25, 98) };
    });
    scored.sort((a, b) => b.match - a.match);
    recommendations = scored.slice(0, 4).map(({ s, match }) => ({
      specialty: s,
      match,
      reason:
        match > 80
          ? t("ai.reason.high", { m: match, axis: axisLabel })
          : match > 65
            ? t("ai.reason.mid", { m: match, axis: axisLabel })
            : t("ai.reason.low", { m: match, axis: axisLabel }),
    }));
  }

  const summaryIdx = (seed % 3) + 1;
  const summary = sp && (sp.interests.length > 0 || sp.goals.length > 0)
    ? t("ai.summary.profile", {
        axis: axisLabel,
        secondary: secondaryLabel,
        score: axes[topAxis],
        n: recommendations.length,
        note: sp.note.toFixed(2),
      })
    : t(`ai.summary.${summaryIdx}`, {
        axis: axisLabel,
        secondary: secondaryLabel,
        score: axes[topAxis],
        n: recommendations.length,
      });

  const strategyVariant = (seed % 2) + 1;
  const topName = recommendations[0] ? t(recommendations[0].specialty.nameKey) : "—";
  const altName = recommendations[2]
    ? t(recommendations[2].specialty.nameKey)
    : recommendations[1]
      ? t(recommendations[1].specialty.nameKey)
      : "—";

  const strategy = sp
    ? [1, 2, 3].map((i) =>
        t(`ai.strategy.profile.${i}`, {
          focus: axisLabel,
          top: topName,
          alt: altName,
          note: sp.note.toFixed(2),
        }),
      )
    : [1, 2, 3].map((i) =>
        t(`ai.strategy.${strategyVariant}.${i}`, {
          focus: axisLabel,
          top: topName,
          alt: altName,
          axis: axisLabel,
        }),
      );

  const avgMatch = recommendations.reduce((a, r) => a + r.match, 0) / Math.max(1, recommendations.length);
  const riskLevel: AiProfile["riskLevel"] = avgMatch > 75 ? "low" : avgMatch > 55 ? "medium" : "high";

  return {
    summary,
    profile: {
      axes,
      strengths: [...new Set(strengthKeys)].slice(0, 4).map((k) => t(k)),
      weaknesses: [...new Set(weaknessKeys)].slice(0, 3).map((k) => t(k)),
      riskLevel,
    },
    recommendations,
    strategy,
    inferredSerie: serieScore ? inferredSerie : sp?.serie ?? "SN",
  };
}

/** Score a single specialty for detail-page copy when profile is known. */
export function getProfileMatchForSpecialty(profile: StudentProfile, specialty: Specialty) {
  return scoreSpecialty(profile, specialty);
}
