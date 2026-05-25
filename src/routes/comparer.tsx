import { useEffect, useMemo } from "react";
import type { ComponentType, ReactNode } from "react";
import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, Coins, BarChart3, MapPin, Sparkles, Trophy, ShieldCheck, Globe2, KeyRound, Clock } from "lucide-react";
import { getSpecialtyById, getSpecialtyDetail, type Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { formatCompareIds, parseCompareIds } from "@/lib/compareSearch";
import { CAREER_ICONS } from "@/lib/careerIcons";
import { SectionHeading } from "@/components/massiva/shared/SectionHeading";
import { CompareAnalyzing } from "@/components/massiva/CompareAnalyzing";
import { CompareRadar } from "@/components/massiva/CompareRadar";
import { pushRecentCompare } from "@/lib/compareStorage";
import { useT } from "@/i18n/I18nProvider";

const searchSchema = z.object({
  ids: z.string().optional(),
  note: z.coerce.number().min(0).max(20).optional(),
  analyze: z.coerce.number().optional(),
  view: z.enum(["dashboard"]).optional(),
});

export const Route = createFileRoute("/comparer")({
  validateSearch: (raw) => searchSchema.safeParse(raw).data ?? {},
  head: () => ({
    meta: [
      { title: "Comparer mes spécialités — MASSIVA" },
      { name: "description", content: "Compare jusqu'à 3 spécialités côte à côte : seuils, salaires, opportunités, stabilité." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const t = useT();
  const navigate = useNavigate({ from: "/comparer" });
  const search = Route.useSearch();
  const { ids, note, analyze, view } = search;

  const selectedIds = useMemo(() => parseCompareIds(ids), [ids]);

  const items = useMemo(
    () => selectedIds.map((id) => getSpecialtyById(id)).filter(Boolean).slice(0, 3) as Specialty[],
    [selectedIds],
  );

  useEffect(() => {
    if (items.length >= 2 && view === "dashboard" && !analyze) {
      pushRecentCompare(items.map((s) => s.id));
    }
  }, [items, view, analyze]);

  if (!analyze && view !== "dashboard") {
    return (
      <Navigate
        to="/specialties"
        search={{
          compare: ids,
          ...(note != null ? { note } : {}),
        }}
        replace
      />
    );
  }

  if (analyze && items.length >= 2) {
    return (
      <CompareAnalyzing
        onDone={() =>
          navigate({
            search: (prev) => {
              const { analyze: _a, ...rest } = prev as Record<string, unknown>;
              return { ...rest, view: "dashboard" };
            },
            replace: true,
          })
        }
      />
    );
  }

  if (view === "dashboard" && items.length >= 2) {
    return <ComparisonDashboard items={items} note={note} idsParam={ids} t={t} />;
  }

  return (
    <Navigate
      to="/specialties"
      search={{
        compare: ids,
        ...(note != null ? { note } : {}),
      }}
      replace
    />
  );
}

function ComparisonDashboard({
  items,
  note,
  idsParam,
  t,
}: {
  items: Specialty[];
  note?: number;
  idsParam?: string;
  t: ReturnType<typeof useT>;
}) {
  const maxThresh = Math.max(...items.map((s) => Math.max(...Object.values(s.thresholds), s.predicted2027)));
  const maxSalary = Math.max(...items.map((s) => getSpecialtyDetail(s, t).salaryRange.max));

  const winners = useMemo(() => {
    const best = (cmp: (a: Specialty, b: Specialty) => number) => items.slice().sort(cmp)[0];
    return {
      salary: best((a, b) => b.estimatedSalary - a.estimatedSalary),
      stability: best((a, b) => b.stability - a.stability),
      opportunities: best((a, b) => b.internationalOpportunity - a.internationalOpportunity),
      access: best((a, b) => a.predicted2027 - b.predicted2027),
      duration: best((a, b) => a.duration - b.duration),
    };
  }, [items]);

  const winnerIds = new Set([winners.salary.id, winners.stability.id, winners.opportunities.id]);

  const summary = t("compare.ai.summary", {
    best: t(winners.opportunities.nameKey),
    bestSalary: t(winners.salary.nameKey),
    salary: winners.salary.estimatedSalary,
    bestStable: t(winners.stability.nameKey),
    bestAccess: t(winners.access.nameKey),
    thresh: winners.access.predicted2027.toFixed(2),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/specialties"
          search={{ compare: idsParam, ...(note != null ? { note } : {}) }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:scale-x-[-1]" /> {t("compare.dashboard.edit")}
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
          <Scale className="h-5 w-5" />
        </span>
        <SectionHeading title={t("compare.heading", { n: items.length })} />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-6 overflow-hidden rounded-2xl border bg-card p-6 shadow-soft"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" /> {t("compare.ai.title")}
        </div>
        <p className="mt-3 text-base leading-relaxed text-foreground">{summary}</p>
      </motion.section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <WinnerCard icon={Coins} label={t("compare.winner.salary")} value={`${winners.salary.estimatedSalary}k`} subject={t(winners.salary.nameKey)} tone="warning" />
        <WinnerCard icon={ShieldCheck} label={t("compare.winner.stability")} value={"★".repeat(winners.stability.stability)} subject={t(winners.stability.nameKey)} tone="success" />
        <WinnerCard icon={Globe2} label={t("compare.winner.opportunities")} value={"●".repeat(winners.opportunities.internationalOpportunity)} subject={t(winners.opportunities.nameKey)} tone="info" />
        <WinnerCard icon={KeyRound} label={t("compare.winner.access")} value={`${winners.access.predicted2027.toFixed(2)}/20`} subject={t(winners.access.nameKey)} tone="primary" />
      </section>

      <div className={`mt-8 grid gap-4 ${items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {items.map((s, i) => {
          const Icon = CAREER_ICONS[s.iconKey];
          const prob = note != null ? computeProbability(note, s.predicted2027) : null;
          const isWinner = winnerIds.has(s.id);
          return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
              {isWinner && (
                <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning">
                  <Trophy className="h-3 w-3" /> {t("compare.winner.badge")}
                </span>
              )}
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-foreground">{t(s.nameKey)}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t(`diploma.${s.diplomaType}`)} · {s.duration} {t("card.years")}
                  </div>
                </div>
              </div>
              {prob && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                  {t("compare.compat")}{" "}
                  <span className="tnum text-primary">{prob.matchPct}%</span>
                </div>
              )}
              <Link
                to="/specialite/$id"
                params={{ id: String(s.id) }}
                search={note != null ? { note } : {}}
                className="mt-3 block text-xs font-semibold text-primary hover:underline"
              >
                {t("compare.viewFull")}
              </Link>
            </motion.article>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" /> {t("compare.radar.title")}
        </h2>
        <div className="mt-5">
          <CompareRadar items={items} />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" /> {t("compare.section.evolution")}
        </h2>
        <div className="mt-5 space-y-5">
          {items.map((s) => {
            const years = Object.keys(s.thresholds).map(Number).sort();
            const all = [...years.map((y) => ({ y: String(y), v: s.thresholds[y] })), { y: "2027*", v: s.predicted2027 }];
            return (
              <div key={s.id}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{t(s.nameKey)}</span>
                  <span className="tnum text-muted-foreground">
                    {t("compare.predictedShort", { value: s.predicted2027.toFixed(2) })}
                  </span>
                </div>
                <div className="flex items-end gap-1.5">
                  {all.map((e, idx) => {
                    const h = Math.max(8, (e.v / maxThresh) * 90);
                    const isPred = e.y === "2027*";
                    return (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${isPred ? "border-2 border-dashed border-primary bg-primary/20" : "bg-[image:var(--grad-primary)]"}`}
                          style={{ height: `${h}px` }}
                        />
                        <span className="tnum text-[9px] text-muted-foreground">{e.y}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Coins className="h-4 w-4 text-primary" /> {t("compare.section.salaryRange")}
        </h2>
        <div className="mt-5 space-y-4">
          {items.map((s) => {
            const r = getSpecialtyDetail(s, t).salaryRange;
            return (
              <div key={s.id}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{t(s.nameKey)}</span>
                  <span className="tnum text-muted-foreground">
                    {r.min}k — {r.max}k
                  </span>
                </div>
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 rounded-full bg-[image:var(--grad-primary)] opacity-40"
                    style={{ left: `${(r.min / maxSalary) * 100}%`, right: `${100 - (r.max / maxSalary) * 100}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-7 w-1 -translate-y-1/2 bg-primary"
                    style={{ left: `${(r.med / maxSalary) * 100}%` }}
                    title={`${t("compare.salary.med")} ${r.med}k`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("compare.metric.satisfaction")}</h3>
          <ul className="mt-4 space-y-3">
            {items.map((s) => {
              const d = getSpecialtyDetail(s, t);
              const avg = Math.round(d.satisfaction.reduce((a, b) => a + b.value, 0) / d.satisfaction.length);
              return <CompareBar key={s.id} label={t(s.nameKey)} value={avg} />;
            })}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("detail.stat.employment")}</h3>
          <ul className="mt-4 space-y-3">
            {items.map((s) => {
              const d = getSpecialtyDetail(s, t);
              return <CompareBar key={s.id} label={t(s.nameKey)} value={d.employment.employed} tone="success" />;
            })}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("compare.metric.workload")}</h3>
          <ul className="mt-4 space-y-3">
            {items.map((s) => {
              const d = getSpecialtyDetail(s, t);
              const wk = d.difficulty.find((x) => /workload|charge|عبء/i.test(x.label))?.value ?? d.difficulty[0]?.value ?? 50;
              return <CompareBar key={s.id} label={t(s.nameKey)} value={wk} tone="warning" />;
            })}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" /> {t("compare.duration")}
          </h3>
          <ul className="mt-4 space-y-3">
            {items.map((s) => (
              <CompareBar
                key={s.id}
                label={t(s.nameKey)}
                value={Math.min(100, (s.duration / 7) * 100)}
                display={`${s.duration} ${t("card.years")}`}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("compare.section.detailedTable")}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs text-muted-foreground">
                <th className="py-2 text-start font-medium">{t("compare.criterion")}</th>
                {items.map((s) => (
                  <th key={s.id} className="py-2 text-end font-semibold text-foreground">
                    {t(s.nameKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tnum">
              <CompareTableRow label={t("compare.threshold25")} cells={items.map((s) => `${(s.thresholds[2025] ?? 0).toFixed(2)}/20`)} />
              <CompareTableRow label={t("compare.predicted27")} cells={items.map((s) => `${s.predicted2027.toFixed(2)}/20`)} />
              <CompareTableRow label={t("compare.salary.med")} cells={items.map((s) => `${s.estimatedSalary}k DZD`)} />
              <CompareTableRow
                label={t("compare.stability")}
                cells={items.map((s) => "★".repeat(s.stability) + "☆".repeat(5 - s.stability))}
              />
              <CompareTableRow
                label={t("compare.competition")}
                cells={items.map((s) => "●".repeat(s.competition) + "○".repeat(5 - s.competition))}
              />
              <CompareTableRow
                label={t("compare.intl")}
                cells={items.map((s) => "●".repeat(s.internationalOpportunity) + "○".repeat(5 - s.internationalOpportunity))}
              />
              <CompareTableRow label={t("compare.university")} cells={items.map((s) => t(s.universityKey))} />
              <CompareTableRow
                label={t("compare.city")}
                cells={items.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {t(s.cityKey)}
                  </span>
                ))}
              />
              <CompareTableRow label={t("compare.places")} cells={items.map((s) => `${s.places}`)} />
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function WinnerCard({
  icon: Icon,
  label,
  value,
  subject,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subject: string;
  tone: "warning" | "success" | "info" | "primary";
}) {
  const toneClass =
    tone === "warning"
      ? "text-warning bg-warning/10"
      : tone === "success"
        ? "text-success bg-success/10"
        : tone === "info"
          ? "text-info bg-info/10"
          : "text-primary bg-primary/10";
  return (
    <article className="relative overflow-hidden rounded-2xl border bg-card p-4 shadow-soft">
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="tnum mt-1 text-lg font-bold text-foreground">{value}</div>
      <div className="mt-0.5 truncate text-xs text-muted-foreground">{subject}</div>
    </article>
  );
}

function CompareBar({
  label,
  value,
  display,
  tone = "primary",
}: {
  label: string;
  value: number;
  display?: string;
  tone?: "primary" | "success" | "warning";
}) {
  const color =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-[image:var(--grad-primary)]";
  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="truncate text-foreground">{label}</span>
        <span className="tnum font-semibold text-muted-foreground">{display ?? `${Math.round(value)}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, value)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </li>
  );
}

function CompareTableRow({ label, cells }: { label: string; cells: ReactNode[] }) {
  return (
    <tr className="border-b border-border/40 last:border-0">
      <td className="py-2.5 text-xs text-muted-foreground">{label}</td>
      {cells.map((c, i) => (
        <td key={i} className="py-2.5 text-end text-foreground">
          {c}
        </td>
      ))}
    </tr>
  );
}