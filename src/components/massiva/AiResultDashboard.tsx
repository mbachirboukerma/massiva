import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/I18nProvider";
import type { AiResult } from "@/lib/aiSimulator";
import { loadStudentProfile } from "@/lib/studentProfile";
import { withProfileSearch } from "@/lib/profileSearch";
import { RadarChart } from "./RadarChart";
import { CAREER_ICONS } from "@/lib/careerIcons";

interface Props {
  result: AiResult;
  onReset: () => void;
}

const RISK_STYLES: Record<AiResult["profile"]["riskLevel"], { tone: string; key: string }> = {
  low: { tone: "bg-success/15 text-success", key: "ai.result.risk.low" },
  medium: { tone: "bg-warning/15 text-warning", key: "ai.result.risk.medium" },
  high: { tone: "bg-danger/15 text-danger", key: "ai.result.risk.high" },
};

export function AiResultDashboard({ result, onReset }: Props) {
  const t = useT();
  const profile = loadStudentProfile();
  const risk = RISK_STYLES[result.profile.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-4 w-4" /> {t("ai.result.summary.title")}
          </div>
          <button
            onClick={onReset}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
          >
            {t("ai.reset")}
          </button>
        </div>
        <p className="mt-3 text-base leading-relaxed text-foreground">{result.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${risk.tone}`}>
            <AlertTriangle className="h-3.5 w-3.5" />
            {t("ai.result.risk")}: {t(risk.key)}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
            {t("brand.demo")}
          </span>
        </div>
      </div>

      {/* Recommendations */}
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
          <Target className="h-5 w-5 text-primary" /> {t("ai.result.reco.title")}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {result.recommendations.map((r, i) => {
            const Icon = CAREER_ICONS[r.specialty.iconKey];
            return (
              <motion.article
                key={r.specialty.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-base font-bold text-foreground">{t(r.specialty.nameKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(`diploma.${r.specialty.diplomaType}`)} · {r.specialty.duration} {t("card.years")}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="tnum text-2xl font-bold text-primary">{r.match}%</div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("ai.result.match")}</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.match}%` }}
                    transition={{ duration: 0.9, delay: 0.1 * i }}
                    className="h-full rounded-full bg-[image:var(--grad-primary)]"
                  />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.reason}</p>
                <Link
                  to="/resultats"
                  search={
                    profile
                      ? withProfileSearch({ serie: profile.serie, note: profile.note }, profile)
                      : { serie: result.inferredSerie, note: r.specialty.predicted2027 }
                  }
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {t("debouches.viewThreshold")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Profile + Careers */}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t("ai.result.profile.title")}
          </h3>
          <div className="aspect-square w-full max-w-sm mx-auto">
            <RadarChart axes={result.profile.axes} />
          </div>
          {result.profile.strengths.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {result.profile.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />{s}
                </li>
              ))}
              {result.profile.weaknesses.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />{s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("ai.result.careers.title")}
            </h3>
            <ul className="space-y-2">
              {result.recommendations.slice(0, 3).flatMap((r) =>
                r.specialty.careers.slice(0, 2).map((c, i) => (
                  <li key={`${r.specialty.id}-${i}`} className="flex items-start gap-3 rounded-lg border bg-background p-3 text-sm">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">{c.nameKey ? t(c.nameKey) : c.name}</div>
                      <div className="text-xs text-muted-foreground">{t(r.specialty.nameKey)} · {c.durationKey ? t(c.durationKey) : c.duration}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {t("ai.result.strategy.title")}
            </h3>
            <ol className="space-y-3">
              {result.strategy.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="tnum grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[image:var(--grad-primary)] text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">{t("ai.result.disclaimer")}</p>
    </motion.div>
  );
}
