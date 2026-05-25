import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Search, X, Plus, Check, Clock, Lightbulb, Filter, TrendingUp, ArrowRight, Scale,
} from "lucide-react";
import { getSpecialties, getSpecialtyById, type BacSerie, type Specialty } from "@/lib/data";
import { CAREER_ICONS } from "@/lib/careerIcons";
import { useT } from "@/i18n/I18nProvider";
import { getRecentCompares } from "@/lib/compareStorage";
import { getSuggestedComparisonSets } from "@/lib/recommendation";
import type { StudentProfile } from "@/lib/recommendation";
import { CompareSelectionTray } from "./CompareSelectionTray";
import { cn } from "@/lib/utils";

interface Props {
  initialCompareIds?: number[];
  studentNote?: number;
  detailSearch?: Record<string, unknown>;
  profile?: StudentProfile | null;
  onCompareChange?: (ids: number[]) => void;
  onLaunchCompare: (ids: number[]) => void;
}

export function SpecialtiesExplorer({
  initialCompareIds = [],
  studentNote,
  detailSearch = {},
  profile = null,
  onCompareChange,
  onLaunchCompare,
}: Props) {
  const t = useT();
  const [compareIds, setCompareIds] = useState<number[]>(initialCompareIds.slice(0, 3));
  const [query, setQuery] = useState("");
  const [diplomaFilter, setDiplomaFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [serieFilter, setSerieFilter] = useState<BacSerie | null>(null);
  const recent = useMemo(() => getRecentCompares(), []);

  useEffect(() => {
    setCompareIds(initialCompareIds.slice(0, 3));
  }, [initialCompareIds.join(",")]);

  const syncCompare = (next: number[]) => {
    const capped = next.slice(0, 3);
    setCompareIds(capped);
    onCompareChange?.(capped);
  };

  const toggleCompare = (id: number) => {
    syncCompare(
      compareIds.includes(id)
        ? compareIds.filter((x) => x !== id)
        : compareIds.length >= 3
          ? compareIds
          : [...compareIds, id],
    );
  };

  const all = getSpecialties();
  const cities = useMemo(() => Array.from(new Set(all.map((s) => s.city))).sort(), [all]);
  const diplomas = useMemo(() => Array.from(new Set(all.map((s) => s.diplomaType))), [all]);
  const trending = useMemo(() => all.filter((s) => s.confidence === "Trending Up").slice(0, 6), [all]);

  const matchesQuery = (s: Specialty, q: string) => {
    const hay = [
      t(s.nameKey),
      t(s.fullTitleKey),
      t(s.universityKey),
      t(s.cityKey),
      t(`diploma.${s.diplomaType}`),
      s.name,
      s.fullTitle,
      ...s.careers.map((c) => (c.nameKey ? t(c.nameKey) : c.name)),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      if (diplomaFilter && s.diplomaType !== diplomaFilter) return false;
      if (cityFilter && s.city !== cityFilter) return false;
      if (serieFilter && !s.series.includes(serieFilter)) return false;
      if (q && !matchesQuery(s, q)) return false;
      return true;
    });
  }, [all, query, diplomaFilter, cityFilter, serieFilter, t]);

  const autocomplete = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [] as Specialty[];
    const seen = new Set<number>();
    const out: Specialty[] = [];
    for (const s of all) {
      if (!matchesQuery(s, q)) continue;
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
      if (out.length >= 5) break;
    }
    return out;
  }, [all, query, t]);

  const suggestedSets = useMemo(() => getSuggestedComparisonSets(profile), [profile]);
  const hasTray = compareIds.length > 0;

  return (
    <>
      <div className={cn("space-y-6", hasTray && "pb-28")}>
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("specialties.search.placeholder")}
            aria-label={t("specialties.search.placeholder")}
            className="w-full rounded-xl border bg-card py-3 ps-10 pe-10 text-sm shadow-soft outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("debouches.search.clear")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {autocomplete.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-xl border bg-popover shadow-lift">
              <li className="border-b px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("compare.explorer.autocomplete")}
              </li>
              {autocomplete.map((s) => (
                <li key={s.id} className="flex items-center gap-1 border-b border-border/40 last:border-0">
                  <Link
                    to="/specialite/$id"
                    params={{ id: String(s.id) }}
                    search={detailSearch}
                    onClick={() => setQuery("")}
                    className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent"
                  >
                    <span className="font-semibold text-foreground">{t(s.nameKey)}</span>
                    <span className="truncate text-xs text-muted-foreground">{t(`diploma.${s.diplomaType}`)}</span>
                  </Link>
                  {!compareIds.includes(s.id) && compareIds.length < 3 && (
                    <button
                      type="button"
                      onClick={() => toggleCompare(s.id)}
                      className="me-2 shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Scale className="inline h-3 w-3" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3 shadow-soft">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> {t("compare.explorer.filters")}
          </span>
          <FilterChip label={t("results.filter.all")} on={!diplomaFilter} onClick={() => setDiplomaFilter(null)} />
          {diplomas.map((d) => (
            <FilterChip
              key={d}
              label={t(`diploma.${d}`)}
              on={diplomaFilter === d}
              onClick={() => setDiplomaFilter(diplomaFilter === d ? null : d)}
            />
          ))}
          <span className="mx-1 hidden h-5 w-px bg-border sm:inline-block" />
          <select
            value={cityFilter ?? ""}
            onChange={(e) => setCityFilter(e.target.value || null)}
            className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            aria-label={t("results.filter.allCities")}
          >
            <option value="">{t("results.filter.allCities")}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {t(`city.${c}`)}
              </option>
            ))}
          </select>
          <select
            value={serieFilter ?? ""}
            onChange={(e) => setSerieFilter((e.target.value || null) as BacSerie | null)}
            className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
            aria-label={t("form.serie")}
          >
            <option value="">{t("form.serie")}</option>
            {(["SN", "LN", "SE", "TM"] as BacSerie[]).map((code) => (
              <option key={code} value={code}>
                {t(`serie.${code}.label`)}
              </option>
            ))}
          </select>
        </div>

        {!query && !diplomaFilter && !cityFilter && !serieFilter && (
          <>
            {trending.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> {t("compare.explorer.trending")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {trending.map((s) => (
                    <ExplorerCard
                      key={s.id}
                      specialty={s}
                      inCompare={compareIds.includes(s.id)}
                      compareDisabled={!compareIds.includes(s.id) && compareIds.length >= 3}
                      detailSearch={detailSearch}
                      onToggleCompare={() => toggleCompare(s.id)}
                    />
                  ))}
                </div>
              </section>
            )}
            {recent.length > 0 && (
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {t("compare.select.recent")}
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {recent.map((r, i) => (
                    <SuggestionCard
                      key={i}
                      ids={r.ids}
                      onPick={() => syncCompare(r.ids.slice(0, 3))}
                      pickLabel={t("compare.select.pick")}
                    />
                  ))}
                </div>
              </section>
            )}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" /> {t("specialties.suggestedComparisons")}
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedSets.map((ids, i) => (
                  <SuggestionCard
                    key={i}
                    ids={ids}
                    onPick={() => syncCompare(ids.slice(0, 3))}
                    pickLabel={t("compare.select.pick")}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-foreground">{t("compare.explorer.all")}</h2>
            <span className="text-xs text-muted-foreground">{t("compare.explorer.resultsCount", { n: filtered.length })}</span>
          </div>
          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
              {t("compare.select.empty")}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <ExplorerCard
                  key={s.id}
                  specialty={s}
                  inCompare={compareIds.includes(s.id)}
                  compareDisabled={!compareIds.includes(s.id) && compareIds.length >= 3}
                  detailSearch={detailSearch}
                  onToggleCompare={() => toggleCompare(s.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <CompareSelectionTray
        selectedIds={compareIds}
        onRemove={(id) => toggleCompare(id)}
        onClear={() => syncCompare([])}
        onCompare={() => onLaunchCompare(compareIds)}
      />
    </>
  );
}

function ExplorerCard({
  specialty: s,
  inCompare,
  compareDisabled,
  detailSearch,
  onToggleCompare,
}: {
  specialty: Specialty;
  inCompare: boolean;
  compareDisabled: boolean;
  detailSearch: { note?: number };
  onToggleCompare: () => void;
}) {
  const t = useT();
  const Icon = CAREER_ICONS[s.iconKey];

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition hover:shadow-lift",
        inCompare && "ring-2 ring-primary/25",
      )}
    >
      <div className="h-1 bg-[image:var(--grad-primary)]" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-foreground">{t(s.nameKey)}</h3>
            <p className="truncate text-xs text-muted-foreground">{t(s.fullTitleKey)}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-md border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {t(`diploma.${s.diplomaType}`)}
              </span>
              <span className="text-[10px] text-muted-foreground">{t(s.cityKey)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border bg-background/60 p-2.5 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("card.threshold")}</div>
            <div className="tnum text-lg font-bold text-foreground">{s.predicted2027.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("card.places")}</div>
            <div className="tnum text-lg font-bold text-foreground">{s.places}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/specialite/$id"
            params={{ id: String(s.id) }}
            search={detailSearch}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[image:var(--grad-primary)] px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
          >
            {t("card.details")}
            <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
          </Link>
          <button
            type="button"
            onClick={onToggleCompare}
            disabled={compareDisabled}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
              inCompare
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {inCompare ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {inCompare ? t("compare.select.added") : t("specialties.addCompare")}
          </button>
        </div>
      </div>
    </article>
  );
}

function FilterChip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        on ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function SuggestionCard({
  ids,
  onPick,
  pickLabel,
}: {
  ids: number[];
  onPick: () => void;
  pickLabel: string;
}) {
  const t = useT();
  const items = ids.map((id) => getSpecialtyById(id)).filter(Boolean) as Specialty[];
  if (items.length < 2) return null;
  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-3 text-start shadow-soft transition hover:border-primary/40"
    >
      <div className="min-w-0 text-xs">
        {items.map((s, i) => (
          <span key={s.id} className="font-semibold text-foreground">
            {t(s.nameKey)}
            {i < items.length - 1 ? " · " : ""}
          </span>
        ))}
      </div>
      <span className="shrink-0 text-xs font-semibold text-primary">{pickLabel}</span>
    </button>
  );
}
