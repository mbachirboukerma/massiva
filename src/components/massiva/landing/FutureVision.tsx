import { motion } from "framer-motion";
import { Rocket, Globe2, Brain, Users } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { useT } from "@/i18n/I18nProvider";

const ROADMAP = [
  { icon: Rocket, key: 1, color: "bg-primary" },
  { icon: Brain, key: 2, color: "bg-info" },
  { icon: Users, key: 3, color: "bg-success" },
  { icon: Globe2, key: 4, color: "bg-warning" },
];

export function FutureVision() {
  const t = useT();
  return (
    <section className="bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t("landing.fv.eyebrow")} title={t("landing.fv.title")} subtitle={t("landing.fv.subtitle")} align="center" />
        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 sm:block" />
          <div className="grid gap-6 sm:grid-cols-4">
            {ROADMAP.map((r, i) => (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className={`relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full ${r.color} text-white shadow-lift`}>
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">{t(`landing.fv.${r.key}.label`)}</div>
                <div className="mt-1 text-sm font-bold text-foreground">{t(`landing.fv.${r.key}.title`)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
