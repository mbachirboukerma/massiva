import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Bot, Scale, Sparkles } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { useT } from "@/i18n/I18nProvider";

type Tab = "results" | "ai" | "compare";

export function FeaturePreview() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("results");

  const TABS: { id: Tab; label: string; icon: typeof Bot }[] = [
    { id: "results", label: t("landing.fp.tab.results"), icon: BarChart3 },
    { id: "ai", label: t("landing.fp.tab.ai"), icon: Bot },
    { id: "compare", label: t("landing.fp.tab.compare"), icon: Scale },
  ];

  const sampleResults = [
    { nameKey: "spec.1.name", pct: 89, gap: "+0.6", tone: "success" },
    { nameKey: "spec.2.name", pct: 72, gap: "+0.2", tone: "warning" },
    { nameKey: "spec.4.name", pct: 45, gap: "-0.8", tone: "danger" },
  ];

  const sampleCompare = [
    { nameKey: "spec.1.name", salary: 180, stab: 5 },
    { nameKey: "spec.4.name", salary: 150, stab: 4 },
  ];

  return (
    <section className="bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("landing.fp.eyebrow")}
          title={t("landing.fp.title")}
          subtitle={t("landing.fp.subtitle")}
          align="center"
        />

        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-2xl border bg-card p-1.5 shadow-soft">
            {TABS.map((tt) => (
              <button
                key={tt.id}
                onClick={() => setTab(tt.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  tab === tt.id ? "bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tt.icon className="h-4 w-4" /> {tt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border bg-background p-4 shadow-lift sm:p-6">
          <AnimatePresence mode="wait">
            {tab === "results" && (
              <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-3">
                {sampleResults.map((c) => (
                  <div key={c.nameKey} className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-foreground">{t(c.nameKey)}</div>
                      <span className={`tnum text-xs font-semibold text-${c.tone}`}>{c.gap}</span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full bg-${c.tone}`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <div className="tnum mt-2 text-xs text-muted-foreground">{t("landing.fp.compat", { n: c.pct })}</div>
                  </div>
                ))}
              </motion.div>
            )}
            {tab === "ai" && (
              <motion.div key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="max-w-[70%] rounded-2xl rounded-bl-sm bg-secondary p-3 text-sm">
                  {t("landing.fp.ai.user")}
                </div>
                <div className="ms-auto flex max-w-[85%] gap-2">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[image:var(--grad-primary)] text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="rounded-2xl rounded-br-sm border bg-primary/5 p-3 text-sm text-foreground">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> MASSIVA AI</div>
                    <p className="mt-1.5">{t("landing.fp.ai.body")}</p>
                  </div>
                </div>
              </motion.div>
            )}
            {tab === "compare" && (
              <motion.div key="c" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 sm:grid-cols-2">
                {sampleCompare.map((c) => (
                  <div key={c.nameKey} className="rounded-xl border bg-card p-4">
                    <div className="text-sm font-bold text-foreground">{t(c.nameKey)}</div>
                    <dl className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between"><dt className="text-muted-foreground">{t("landing.fp.salary")}</dt><dd className="tnum font-semibold">{c.salary}k DZD</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">{t("landing.fp.stability")}</dt><dd className="font-semibold text-warning">{"★".repeat(c.stab)}</dd></div>
                    </dl>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
