import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { motion } from "framer-motion";
import { getSpecialties, type BacSerie } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { rankSpecialtiesWithProfile } from "@/lib/recommendation";
import { SpecialtyCard } from "@/components/massiva/SpecialtyCard";
import { GradeForm } from "@/components/massiva/GradeForm";
import { ProfileChips } from "@/components/massiva/ProfileChips";
import { formatCompareIds } from "@/lib/compareSearch";
import { withProfileSearch } from "@/lib/profileSearch";
import { hasPersonalization, resolveStudentProfile } from "@/lib/studentProfile";
import { SameNameWarning } from "@/components/massiva/SameNameWarning";
import { ResultsSummaryBanner } from "@/components/massiva/results/ResultsSummaryBanner";
import { ResultsFilters, type SortKey } from "@/components/massiva/results/ResultsFilters";
import { Scale, X } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

const SeriesEnum = z.enum(["SN", "LN", "SE", "TM"]);
const searchSchema = z.object({
  serie: SeriesEnum.optional(),
  note: z.coerce.number().min(0).max(20).optional(),
  interests: z.string().optional(),
  goals: z.string().optional(),
});

export const Route = createFileRoute("/resultats")({
  validateSearch: (raw) => {
    const r = searchSchema.safeParse(raw);
    return r.success ? r.data : {};
  },
  head: () => ({
    meta: [
      { title: "Mes résultats — MASSIVA" },
      { name: "description", content: "Tes spécialités classées par probabilité d'admission selon ta note et ta série du Bac." },
    ],
  }),
  component: Results,
});

function Results() {
  const t = useT();
  const search = Route.useSearch();
  const { serie, note } = search;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const [diplomaFilter, setDiplomaFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const profile = useMemo(() => resolveStudentProfile(search), [search.serie, search.note, search.interests, search.goals]);
  const personalized = hasPersonalization(profile);
  const [sort, setSort] = useState<SortKey>("probability");

  useEffect(() => {
    if (personalized) setSort("personalized");
  }, [personalized]);

  const validInput = serie && typeof note === "number";

  const scoredRanked = useMemo(() => {
    if (!validInput || !profile) return [];
    const list = getSpecialties().filter((s) => s.series.includes(serie as BacSerie));
    return rankSpecialtiesWithProfile(profile, list);
  }, [serie, note, validInput, profile]);

  const breakdownById = useMemo(() => {
    const m = new Map<number, (typeof scoredRanked)[0]["breakdown"]>();
    for (const row of scoredRanked) m.set(row.specialty.id, row.breakdown);
    return m;
  }, [scoredRanked]);

  const baseRanked = useMemo(() => scoredRanked.map((r) => r.specialty), [scoredRanked]);

  const filtered = useMemo(() => {
    let list = [...baseRanked];
    if (diplomaFilter) list = list.filter((s) => s.diplomaType === diplomaFilter);
    if (cityFilter) list = list.filter((s) => s.city === cityFilter);
    if (sort === "personalized" && personalized) {
      list.sort((a, b) => (breakdownById.get(b.id)?.total ?? 0) - (breakdownById.get(a.id)?.total ?? 0));
    } else if (sort === "threshold") {
      list.sort((a, b) => a.predicted2027 - b.predicted2027);
    } else if (sort === "salary") {
      list.sort((a, b) => b.estimatedSalary - a.estimatedSalary);
    }
    return list;
  }, [baseRanked, diplomaFilter, cityFilter, sort, personalized, breakdownById]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? [prev[1], prev[2], id] : [...prev, id],
    );
  }

  if (!validInput) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">{t("results.start.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("results.start.subtitle")}</p>
        <div className="mt-6"><GradeForm /></div>
      </main>
    );
  }

  const topProb = filtered[0] ? computeProbability(note!, filtered[0].predicted2027) : null;
  const cities = Array.from(new Set(baseRanked.map((s) => s.city))).sort();
  const diplomas = Array.from(new Set(baseRanked.map((s) => s.diplomaType)));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">{t("results.modify")}</Link>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{t("results.title")}</h1>
          <p className="tnum mt-1 text-sm text-muted-foreground">
            {t("results.subtitle", { serie: serie as string, note: note!.toFixed(2), count: filtered.length })}
          </p>
          {profile && <ProfileChips profile={profile} />}
        </div>
        {topProb && (
          <div className="rounded-xl border bg-card px-4 py-3 text-sm">
            {t("results.best")} <strong className="text-primary">{t(filtered[0].nameKey)}</strong>{" "}
            <span className="tnum text-muted-foreground">({topProb.gap > 0 ? "+" : ""}{topProb.gap.toFixed(2)})</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <ResultsSummaryBanner ranked={baseRanked} studentGrade={note!} profile={profile} topScored={scoredRanked[0] ?? null} />
      </div>

      <div className="mt-6"><GradeForm defaultSerie={serie} defaultNote={note} variant="compact" /></div>

      <div className="mt-5">
        <ResultsFilters
          diplomaFilter={diplomaFilter} setDiplomaFilter={setDiplomaFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter}
          cities={cities} diplomas={diplomas}
          sort={sort} setSort={setSort}
          showPersonalizedSort={personalized}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed bg-card p-10 text-center">
          <p className="text-base font-semibold text-foreground">{t("results.empty.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("results.empty.subtitle")}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
            >
              <SpecialtyCard
                specialty={s}
                studentGrade={note!}
                selected={selectedIds.includes(s.id)}
                onToggleSelect={() => toggleSelect(s.id)}
                matchBreakdown={breakdownById.get(s.id) ?? null}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12"><SameNameWarning /></div>

      {selectedIds.length >= 2 && (
        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[95%] items-center gap-3 rounded-full border bg-card px-4 py-3 shadow-lift">
          <span className="text-sm font-medium text-foreground">{t("results.selected", { n: selectedIds.length })}</span>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/specialties",
                search: withProfileSearch({ compare: formatCompareIds(selectedIds), note: note! }, profile),
              })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--grad-primary)] px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Scale className="h-4 w-4" /> {t("results.compare")}
          </button>
          <button onClick={() => setSelectedIds([])} aria-label={t("results.compare.clear")} className="rounded-full p-1 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </main>
  );
}
