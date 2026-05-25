import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Brain, Eye, Sparkles, Target, TrendingDown, Lightbulb } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { useT } from "@/i18n/I18nProvider";

const PROBLEMS = [
  { icon: Eye, key: "p1" },
  { icon: TrendingDown, key: "p2" },
  { icon: AlertCircle, key: "p3" },
];

const SOLUTIONS = [
  { icon: Brain, key: "s1" },
  { icon: Target, key: "s2" },
  { icon: Lightbulb, key: "s3" },
];

export function ProblemSolution() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow={t("landing.ps.eyebrow")}
        title={t("landing.ps.title")}
        subtitle={t("landing.ps.subtitle")}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-2xl border border-danger/20 bg-danger/5 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">{t(`landing.ps.${p.key}.t`)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{t(`landing.ps.${p.key}.d`)}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid h-14 w-14 place-items-center rounded-full bg-[image:var(--grad-primary)] text-primary-foreground shadow-lift"
          >
            <ArrowRight className="h-6 w-6 rtl:scale-x-[-1]" />
          </motion.div>
        </div>

        <div className="space-y-3">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.2 }}
              className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/5 p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  {t(`landing.ps.${s.key}.t`)}
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{t(`landing.ps.${s.key}.d`)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
