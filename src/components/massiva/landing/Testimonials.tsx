import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { useT } from "@/i18n/I18nProvider";

const ITEMS = [1, 2, 3, 4];

export function Testimonials() {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow={t("landing.tm.eyebrow")} title={t("landing.tm.title")} align="center" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((i, idx) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="relative rounded-2xl border bg-card p-5 shadow-soft"
          >
            <Quote className="absolute end-4 top-4 h-5 w-5 text-primary/30" aria-hidden />
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />)}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground">"{t(`landing.tm.${i}.text`)}"</blockquote>
            <figcaption className="mt-4 border-t border-border/60 pt-3">
              <div className="text-sm font-semibold text-foreground">{t(`landing.tm.${i}.name`)}</div>
              <div className="text-xs text-muted-foreground">{t(`landing.tm.${i}.role`)}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
