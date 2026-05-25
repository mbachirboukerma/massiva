import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight, Search, X, Sparkles } from "lucide-react";
import { getCareerSearchSuggestions, getCareerSuggestions } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";
import { CAREER_ICONS } from "@/lib/careerIcons";

export const Route = createFileRoute("/debouches")({
  head: () => ({
    meta: [
      { title: "Débouchés — MASSIVA" },
      { name: "description", content: "Parcours professionnels qui découlent de chaque spécialité universitaire algérienne." },
    ],
  }),
  component: Debouches,
});

function Debouches() {
  const t = useT();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => getCareerSuggestions(t, { query }), [query, t]);

  const suggestions = useMemo(() => getCareerSearchSuggestions(t, query), [query, t]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("debouches.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("debouches.subtitle")}</p>

      {/* Search */}
      <div className="relative mt-8 max-w-2xl">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("debouches.search.placeholder")}
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
        {suggestions.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border bg-popover shadow-lift">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setQuery(s)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm hover:bg-accent"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-foreground">{s}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{query ? t("debouches.search.results", { n: filtered.length }) : t("debouches.search.all")}</span>
      </div>

      <div className="mt-6 space-y-6">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-muted/40 p-10 text-center text-sm text-muted-foreground">
            {t("debouches.search.empty")}
          </p>
        ) : (
          filtered.map(({ specialty: s, matchedCareers }, idx) => {
            const Icon = CAREER_ICONS[s.iconKey];
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" aria-hidden />
                        <h2 className="text-lg font-bold text-foreground sm:text-xl">{t(s.nameKey)}</h2>
                        <span className="rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary">
                          {t(`diploma.${s.diplomaType}`)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t(s.fullTitleKey)}</p>
                    </div>
                  </div>
                  <Link
                    to="/resultats"
                    search={{ serie: s.series[0], note: s.predicted2027 }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {t("debouches.viewThreshold")} <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
                  </Link>
                </div>

                {matchedCareers.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">{t("debouches.career.match")}</span>
                    {matchedCareers.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <ol className="mt-5 grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                  {s.careers.map((c, i) => (
                    <li key={i} className="rounded-xl border bg-background p-3 transition hover:border-primary/40 hover:shadow-soft">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--grad-primary)] text-xs font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {c.nameKey ? t(c.nameKey) : c.name}
                        </span>
                      </div>
                      <p className="mt-1 ps-9 text-xs text-muted-foreground">
                        {c.durationKey ? t(c.durationKey) : c.duration}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="tnum mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span>
                    {t("card.threshold")}: <strong className="text-foreground">{s.predicted2027.toFixed(2)}/20</strong>
                  </span>
                  <span>{t(s.universityKey)}</span>
                  <span>{t(s.cityKey)}</span>
                </div>
              </motion.article>
            );
          })
        )}
      </div>
    </main>
  );
}
