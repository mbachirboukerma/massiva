import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target, AlertCircle } from "lucide-react";
import type { Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import type { ScoredSpecialty, StudentProfile } from "@/lib/recommendation";
import { formatRecoExplanation } from "@/lib/recommendation";
import { hasPersonalization } from "@/lib/studentProfile";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  ranked: Specialty[];
  studentGrade: number;
  profile?: StudentProfile | null;
  topScored?: ScoredSpecialty | null;
}

export function ResultsSummaryBanner({ ranked, studentGrade, profile, topScored }: Props) {
  const t = useT();
  const buckets = { tp: 0, p: 0, d: 0, td: 0 };
  for (const s of ranked) {
    const lvl = computeProbability(studentGrade, s.predicted2027).level;
    if (lvl === "tres-probable") buckets.tp++;
    else if (lvl === "possible") buckets.p++;
    else if (lvl === "difficile") buckets.d++;
    else buckets.td++;
  }
  const total = Math.max(1, ranked.length);
  const top = ranked[0];

  const segs = [
    { value: buckets.tp, color: "var(--success)" },
    { value: buckets.p, color: "var(--warning)" },
    { value: buckets.d, color: "var(--danger)" },
    { value: buckets.td, color: "var(--critical)" },
  ];
  let offset = 0;
  const C = 2 * Math.PI * 32;

  const personalizedExplain =
    profile && hasPersonalization(profile) && topScored?.breakdown.explainKey
      ? formatRecoExplanation(t, topScored.breakdown)
      : null;

  const insight = personalizedExplain
    ? t("reco.banner.personalized", {
        total: ranked.length,
        accessible: buckets.tp + buckets.p,
        top: t(topScored!.specialty.nameKey),
        explain: personalizedExplain,
      })
    : top
      ? t("results.banner.insight", {
          total: ranked.length,
          accessible: buckets.tp + buckets.p,
          top: t(top.nameKey),
          pct: computeProbability(studentGrade, top.predicted2027).matchPct,
        })
      : t("results.banner.empty");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
        <div className="flex items-center justify-center">
          <svg width="84" height="84" className="-rotate-90">
            <circle cx="42" cy="42" r="32" fill="none" stroke="var(--muted)" strokeWidth="10" />
            {segs.map((s, i) => {
              if (s.value === 0) return null;
              const len = (s.value / total) * C;
              const el = (
                <circle
                  key={i}
                  cx="42" cy="42" r="32"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="10"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </svg>
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> {t("results.banner.eyebrow")}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground sm:text-base">{insight}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> {t("results.banner.veryProbable", { n: buckets.tp })}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> {t("results.banner.possible", { n: buckets.p })}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> {t("results.banner.difficult", { n: buckets.d })}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-critical" /> {t("results.banner.veryDifficult", { n: buckets.td })}</span>
          </div>
        </div>
        <div className="hidden flex-col gap-2 sm:flex">
          <Pill icon={Target} label={t("results.banner.matchMax")} value={top ? `${computeProbability(studentGrade, top.predicted2027).matchPct}%` : "—"} />
          <Pill icon={TrendingUp} label={t("results.banner.accessible")} value={`${buckets.tp + buckets.p}`} />
          <Pill icon={AlertCircle} label={t("results.banner.atRisk")} value={`${buckets.d + buckets.td}`} />
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="tnum text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
