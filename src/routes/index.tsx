import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GradeForm } from "@/components/massiva/GradeForm";
import { HeroBackground } from "@/components/massiva/HeroBackground";
import { AnimatedCounter } from "@/components/massiva/AnimatedCounter";
import { ProblemSolution } from "@/components/massiva/landing/ProblemSolution";
import { FeaturePreview } from "@/components/massiva/landing/FeaturePreview";
import { Testimonials } from "@/components/massiva/landing/Testimonials";
import { FaqSection } from "@/components/massiva/landing/FaqSection";
import { FutureVision } from "@/components/massiva/landing/FutureVision";
import { ArrowRight, BarChart3, Bot, Compass, Languages, Sparkles, Target, Zap, MousePointer2 } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MASSIVA — AI Orientation post-Bac DZ" },
      { name: "description", content: "Plateforme IA d'orientation post-Bac pour bacheliers algériens. Recommandations personnalisées, comparaisons, multilingue FR/AR/EN." },
    ],
  }),
  component: Index,
});

function Index() {
  const t = useT();

  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <HeroBackground />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-12 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-card/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.badge")}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="grad-text">MASSIVA</span> — {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">{t("hero.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ai" className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--grad-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition hover:opacity-90">
                <Bot className="h-4 w-4" /> {t("hero.cta.ai")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#form" className="inline-flex items-center gap-2 rounded-xl border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur hover:bg-card">
                <Target className="h-4 w-4" /> {t("hero.cta.grade")}
              </a>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BarChart3, t: t("hero.feature.data"), d: t("hero.feature.data.d") },
                { icon: Bot, t: t("hero.feature.ai"), d: t("hero.feature.ai.d") },
                { icon: Languages, t: t("hero.feature.free"), d: t("hero.feature.free.d") },
              ].map(({ icon: Icon, t: tt, d }) => (
                <div key={tt} className="rounded-xl border bg-card/70 p-3 backdrop-blur transition hover:shadow-soft">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  <div className="mt-1.5 text-sm font-semibold text-foreground">{tt}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div id="form" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <GradeForm />
          </motion.div>
        </div>
        <div className="pointer-events-none flex justify-center pb-6">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="text-muted-foreground">
            <MousePointer2 className="h-4 w-4" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {[
            { v: 1000, s: "+", k: "stats.students" },
            { v: 17, s: "", k: "stats.years" },
            { v: 120, s: "+", k: "stats.specialties" },
            { v: 3, s: "", k: "stats.languages" },
          ].map((x) => (
            <div key={x.k} className="text-center">
              <div className="text-3xl font-extrabold text-primary sm:text-4xl"><AnimatedCounter value={x.v} suffix={x.s} /></div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground sm:text-sm">{t(x.k)}</div>
            </div>
          ))}
        </div>
      </section>

      <ProblemSolution />
      <FeaturePreview />

      {/* AI Preview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Orientation</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("ai.preview.title")}</h2>
            <p className="mt-3 text-muted-foreground">{t("ai.subtitle")}</p>
            <Link to="/ai" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              {t("hero.cta.ai")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl border bg-card p-5 shadow-lift">
            <div className="mb-3 flex max-w-[80%] rounded-2xl rounded-bl-sm bg-secondary p-3 text-sm">{t("ai.preview.user")}</div>
            <div className="ms-auto flex max-w-[85%] gap-2">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[image:var(--grad-primary)] text-primary-foreground">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl rounded-br-sm bg-primary/10 p-3 text-sm text-foreground">{t("ai.preview.ai")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-foreground">{t("why.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("why.subtitle")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Compass, k: "why.1" },
              { icon: Zap, k: "why.2" },
              { icon: Bot, k: "why.3" },
            ].map(({ icon: Icon, k }) => (
              <div key={k} className="rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-3 text-base font-bold text-foreground">{t(`${k}.t`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${k}.d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-bold text-foreground">{t("how.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("how.subtitle")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["how.1", "how.2", "how.3"].map((k, i) => (
            <div key={k} className="relative rounded-2xl border bg-card p-5 shadow-soft">
              <span className="tnum grid h-10 w-10 place-items-center rounded-full bg-[image:var(--grad-primary)] text-sm font-bold text-primary-foreground">{i + 1}</span>
              <h3 className="mt-3 text-base font-bold text-foreground">{t(`${k}.t`)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`${k}.d`)}</p>
            </div>
          ))}
        </div>
      </section>

      <Testimonials />
      <FutureVision />
      <FaqSection />

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-[image:var(--grad-primary)] p-10 text-center shadow-lift">
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--grad-hero)" }} />
          <div className="relative">
            <Sparkles className="mx-auto h-8 w-8 text-primary-foreground" />
            <h2 className="mt-3 text-2xl font-bold text-primary-foreground sm:text-3xl">{t("finalCta.title")}</h2>
            <p className="mt-2 text-sm text-primary-foreground/80">{t("finalCta.subtitle")}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/ai" className="inline-flex items-center gap-2 rounded-xl bg-background px-5 py-3 text-sm font-semibold text-foreground shadow-soft hover:bg-card">
                <Bot className="h-4 w-4" /> {t("hero.cta.ai")}
              </Link>
              <a href="#form" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/20">
                <Target className="h-4 w-4" /> {t("hero.cta.grade")}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
