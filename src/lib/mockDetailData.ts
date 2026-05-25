import type { Specialty } from "@/lib/data/types";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function rng(seed: number) {
  let x = seed || 1;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) % 10000) / 10000;
  };
}

export interface MockDetailRaw {
  employment: { employed: number; pursuing: number; searching: number };
  satisfactionKeys: { labelKey: string; value: number }[];
  abroad: { countryKey: string; flag: string; value: number }[];
  reviews: { nameKey: string; year: number; rating: number; reviewKey: string }[];
  salaryRange: { min: number; med: number; max: number };
  difficultyKeys: { labelKey: string; value: number }[];
  aiSummary: {
    nameKey: string;
    trendKey: string;
    threshold: string;
    selectivityKey: string;
    employed: number;
    salary: number;
    profileKey: string;
  };
}

type TFn = (key: string, vars?: Record<string, string | number>) => string;

export interface MockDetail {
  employment: { employed: number; pursuing: number; searching: number };
  satisfaction: { label: string; value: number }[];
  abroad: { country: string; flag: string; value: number }[];
  reviews: { name: string; year: string; rating: number; text: string }[];
  salaryRange: { min: number; med: number; max: number };
  difficulty: { label: string; value: number }[];
  aiSummary: string;
}

const SAT_KEYS = ["mock.sat.content", "mock.sat.teachers", "mock.sat.outcomes", "mock.sat.student", "mock.sat.infra"];
const DIFF_KEYS = ["mock.diff.workload", "mock.diff.math", "mock.diff.memo", "mock.diff.lab", "mock.diff.intern"];
const ABROAD_POOL = [
  { countryKey: "mock.country.fr", flag: "🇫🇷" },
  { countryKey: "mock.country.ca", flag: "🇨🇦" },
  { countryKey: "mock.country.de", flag: "🇩🇪" },
  { countryKey: "mock.country.ae", flag: "🇦🇪" },
  { countryKey: "mock.country.tr", flag: "🇹🇷" },
  { countryKey: "mock.country.be", flag: "🇧🇪" },
];
const REVIEW_KEYS = ["mock.review.1", "mock.review.2", "mock.review.3", "mock.review.4", "mock.review.5", "mock.review.6"];
const NAME_KEYS = Array.from({ length: 10 }, (_, i) => `mock.name.${i + 1}`);

function getRaw(s: Specialty): MockDetailRaw {
  const r = rng(hash(s.nameGroup + s.diplomaType));
  const employed = 45 + Math.floor(r() * 40);
  const pursuing = Math.floor((100 - employed) * (0.4 + r() * 0.4));
  const searching = 100 - employed - pursuing;

  const satisfactionKeys = SAT_KEYS.map((k, i) => ({
    labelKey: k,
    value: [55, 50, 50, 45, 40][i] + Math.floor(r() * [40, 45, 45, 50, 50][i]),
  }));

  const abroad = ABROAD_POOL
    .map((c) => ({ ...c, value: 20 + Math.floor(r() * 70) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const reviews = Array.from({ length: 3 }).map(() => ({
    nameKey: NAME_KEYS[Math.floor(r() * NAME_KEYS.length)],
    year: 2021 + Math.floor(r() * 4),
    rating: 3 + Math.floor(r() * 3),
    reviewKey: REVIEW_KEYS[Math.floor(r() * REVIEW_KEYS.length)],
  }));

  const med = s.estimatedSalary;
  const salaryRange = {
    min: Math.round(med * (0.55 + r() * 0.15)),
    med,
    max: Math.round(med * (1.6 + r() * 0.6)),
  };

  const difficultyKeys = [
    { labelKey: "mock.diff.workload", value: 50 + s.competition * 8 },
    { labelKey: "mock.diff.math", value: ["code", "zap", "ruler", "trending"].includes(s.iconKey) ? 75 : 45 },
    { labelKey: "mock.diff.memo", value: ["stethoscope", "pill", "tooth", "languages"].includes(s.iconKey) ? 85 : 55 },
    { labelKey: "mock.diff.lab", value: 50 + Math.floor(r() * 40) },
    { labelKey: "mock.diff.intern", value: 40 + Math.floor(r() * 50) },
  ];
  void DIFF_KEYS;

  const trendKey =
    s.confidence === "Trending Up" ? "mock.ai.trend.up" :
    s.confidence === "Stable" ? "mock.ai.trend.stable" : "mock.ai.trend.other";
  const selectivityKey = s.predicted2027 > 14 ? "mock.ai.selectivity.high" : "mock.ai.selectivity.low";
  const profileKey = ["stethoscope", "pill", "tooth"].includes(s.iconKey) ? "mock.ai.profile.health"
    : ["code", "zap"].includes(s.iconKey) ? "mock.ai.profile.tech"
    : ["languages", "globe"].includes(s.iconKey) ? "mock.ai.profile.intl"
    : "mock.ai.profile.versatile";

  return {
    employment: { employed, pursuing, searching },
    satisfactionKeys,
    abroad,
    reviews,
    salaryRange,
    difficultyKeys,
    aiSummary: {
      nameKey: s.nameKey,
      trendKey,
      threshold: s.predicted2027.toFixed(2),
      selectivityKey,
      employed,
      salary: med,
      profileKey,
    },
  };
}

export function getMockDetail(s: Specialty, t: TFn): MockDetail {
  const raw = getRaw(s);
  return {
    employment: raw.employment,
    satisfaction: raw.satisfactionKeys.map((x) => ({ label: t(x.labelKey), value: x.value })),
    abroad: raw.abroad.map((a) => ({ country: t(a.countryKey), flag: a.flag, value: a.value })),
    reviews: raw.reviews.map((rv) => ({
      name: t(rv.nameKey),
      year: t("mock.promo", { year: rv.year }),
      rating: rv.rating,
      text: t(rv.reviewKey),
    })),
    salaryRange: raw.salaryRange,
    difficulty: raw.difficultyKeys.map((x) => ({ label: t(x.labelKey), value: x.value })),
    aiSummary: t("mock.ai.summary", {
      name: t(raw.aiSummary.nameKey),
      trend: t(raw.aiSummary.trendKey),
      threshold: raw.aiSummary.threshold,
      selectivity: t(raw.aiSummary.selectivityKey),
      employed: raw.aiSummary.employed,
      salary: raw.aiSummary.salary,
      profile: t(raw.aiSummary.profileKey),
    }),
  };
}
