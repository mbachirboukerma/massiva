import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { getBacSeries, type BacSerie } from "@/lib/data";
import { getHistory, pushHistory, type HistoryEntry } from "@/lib/storage";
import { loadStudentProfile, saveStudentProfile } from "@/lib/studentProfile";
import type { GoalId, InterestId } from "@/lib/recommendation";
import { History, Sparkles, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";
import { InterestsPicker } from "./form/InterestsPicker";
import { CareerGoalsPicker } from "./form/CareerGoalsPicker";
import { cn } from "@/lib/utils";

interface Props {
  defaultSerie?: BacSerie;
  defaultNote?: number;
  variant?: "hero" | "compact";
}

const STEP_KEYS = ["form.step.1", "form.step.2", "form.step.3", "form.step.4"];

export function GradeForm({ defaultSerie, defaultNote, variant = "hero" }: Props) {
  const t = useT();
  const navigate = useNavigate();
  const bacSeries = getBacSeries();
  const [step, setStep] = useState(0);
  const [serie, setSerie] = useState<BacSerie>(defaultSerie ?? "SN");
  const [note, setNote] = useState<string>(defaultNote != null ? String(defaultNote) : "");
  const [interests, setInterests] = useState<InterestId[]>([]);
  const [goals, setGoals] = useState<GoalId[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => { setHistory(getHistory()); }, []);

  useEffect(() => {
    const stored = loadStudentProfile();
    if (stored) {
      if (!defaultSerie) setSerie(stored.serie);
      if (defaultNote == null && stored.note) setNote(String(stored.note));
      if (stored.interests.length) setInterests(stored.interests);
      if (stored.goals.length) setGoals(stored.goals);
    }
  }, [defaultSerie, defaultNote]);

  // Compact variant keeps the legacy single-row UX
  if (variant === "compact") {
    function submitCompact(e: React.FormEvent) {
      e.preventDefault();
      const parsed = Number.parseFloat(note.replace(",", "."));
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 20) { setError(t("form.error.note")); return; }
      setError(null);
      const noteVal = +parsed.toFixed(2);
      const stored = loadStudentProfile();
      const profile = {
        serie,
        note: noteVal,
        interests: stored?.interests ?? interests,
        goals: stored?.goals ?? goals,
      };
      pushHistory({ serie, note: noteVal, at: Date.now() });
      saveStudentProfile(profile);
      navigate({
        to: "/resultats",
        search: {
          serie,
          note: noteVal,
          ...(profile.interests.length ? { interests: profile.interests.join(",") } : {}),
          ...(profile.goals.length ? { goals: profile.goals.join(",") } : {}),
        },
      });
    }
    return (
      <form onSubmit={submitCompact} className="w-full rounded-xl border bg-card p-4" noValidate>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <label htmlFor="serie-c" className="mb-2 block text-sm font-medium text-foreground">{t("form.serie")}</label>
            <select id="serie-c" value={serie} onChange={(e) => setSerie(e.target.value as BacSerie)} className="h-12 w-full rounded-lg border bg-background px-3 text-base">
              {bacSeries.map((s) => <option key={s.code} value={s.code}>{t(s.labelKey)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="note-c" className="mb-2 block text-sm font-medium text-foreground">{t("form.note")}</label>
            <input id="note-c" type="number" inputMode="decimal" min={0} max={20} step="0.01" placeholder="14.50" value={note} onChange={(e) => setNote(e.target.value)} className="tnum h-12 w-full rounded-lg border bg-background px-3 text-base sm:w-36" required />
          </div>
          <button type="submit" className="h-12 rounded-lg bg-[image:var(--grad-primary)] px-6 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90">{t("form.submit")}</button>
        </div>
        <p aria-live="polite" className={`mt-2 min-h-[1.25rem] text-sm ${error ? "text-destructive" : "sr-only"}`}>{error}</p>
      </form>
    );
  }

  function nextStep() {
    if (step === 0) {
      const parsed = Number.parseFloat(note.replace(",", "."));
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 20) { setError(t("form.error.note")); return; }
      setError(null);
    }
    setStep((s) => Math.min(STEP_KEYS.length - 1, s + 1));
  }
  function prevStep() { setStep((s) => Math.max(0, s - 1)); }

  function finish() {
    const parsed = Number.parseFloat(note.replace(",", "."));
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 20) { setError(t("form.error.note")); setStep(0); return; }
    const noteVal = +parsed.toFixed(2);
    const profile = { serie, note: noteVal, interests, goals };
    pushHistory({ serie, note: noteVal, at: Date.now() });
    saveStudentProfile(profile);
    navigate({
      to: "/resultats",
      search: {
        serie,
        note: noteVal,
        ...(interests.length ? { interests: interests.join(",") } : {}),
        ...(goals.length ? { goals: goals.join(",") } : {}),
      },
    });
  }

  function useEntry(entry: HistoryEntry) {
    setSerie(entry.serie); setNote(String(entry.note));
    navigate({ to: "/resultats", search: { serie: entry.serie, note: entry.note } });
  }

  const progress = ((step + 1) / STEP_KEYS.length) * 100;

  return (
    <div className="w-full rounded-2xl border bg-card/95 p-6 shadow-lift backdrop-blur sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> {t("hero.feature.ai")}
        </div>
        <span className="tnum text-xs text-muted-foreground">{t("form.step.label", { n: step + 1, total: STEP_KEYS.length })}</span>
      </div>

      {/* progress */}
      <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-[image:var(--grad-primary)]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
          {step === 0 && (
            <div>
              <label htmlFor="note" className="mb-2 block text-sm font-semibold text-foreground">{t("form.note")}</label>
              <input
                id="note" type="number" inputMode="decimal" min={0} max={20} step="0.01" placeholder="14.50"
                value={note} onChange={(e) => { setNote(e.target.value); setError(null); }}
                className={cn(
                  "tnum h-14 w-full rounded-xl border bg-background px-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-ring",
                  error && "border-destructive ring-2 ring-destructive/30",
                )}
              />
              <p aria-live="polite" className={cn("mt-2 text-sm", error ? "text-destructive" : "text-muted-foreground")}>
                {error ?? t("form.note.hint")}
              </p>
            </div>
          )}
          {step === 1 && (
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">{t("form.serie")}</label>
              <div className="grid grid-cols-2 gap-2">
                {bacSeries.map((s) => (
                  <button
                    key={s.code} type="button" onClick={() => setSerie(s.code)}
                    className={cn(
                      "rounded-xl border p-3 text-start transition",
                      serie === s.code ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40",
                    )}
                  >
                    <div className="text-sm font-bold text-foreground">{s.code}</div>
                    <div className="text-xs text-muted-foreground">{t(s.nameKey)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">{t("form.interests.title")}</label>
              <p className="mb-3 text-xs text-muted-foreground">{t("form.interests.subtitle")}</p>
              <InterestsPicker value={interests} onChange={setInterests} />
            </div>
          )}
          {step === 3 && (
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">{t("form.goals.title")}</label>
              <p className="mb-3 text-xs text-muted-foreground">{t("form.goals.subtitle")}</p>
              <CareerGoalsPicker value={goals} onChange={setGoals} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button" onClick={prevStep} disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-lg border px-4 py-2.5 text-sm font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40 hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 rtl:scale-x-[-1]" /> {t("form.prev")}
        </button>
        {step < STEP_KEYS.length - 1 ? (
          <button type="button" onClick={nextStep} className="inline-flex items-center gap-1 rounded-lg bg-[image:var(--grad-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90">
            {t("form.next")} <ChevronRight className="h-4 w-4 rtl:scale-x-[-1]" />
          </button>
        ) : (
          <button type="button" onClick={finish} className="inline-flex items-center gap-1 rounded-lg bg-[image:var(--grad-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90">
            <Check className="h-4 w-4" /> {t("form.submit")}
          </button>
        )}
      </div>

      {history.length > 0 && step === 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <History className="h-3.5 w-3.5" aria-hidden /> {t("form.history")}
          </span>
          {history.map((h, i) => (
            <button key={i} type="button" onClick={() => useEntry(h)} className="tnum rounded-full border bg-background px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary">
              {h.serie} · {h.note.toFixed(2)}/20
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
