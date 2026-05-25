import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  onDone: () => void;
}

const STEPS = ["compare.analyze.1", "compare.analyze.2", "compare.analyze.3", "compare.analyze.4"];
const STEP_MS = 650;

export function CompareAnalyzing({ onDone }: Props) {
  const t = useT();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= STEPS.length) {
      const id = setTimeout(onDone, 300);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCurrent((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [current, onDone]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl border bg-card p-8 shadow-lift"
      >
        <div className="mb-6 flex items-center gap-3 text-sm font-semibold text-primary">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-5 w-5" />
          </motion.div>
          <Sparkles className="h-4 w-4" />
          {t("compare.analyze.title")}
        </div>
        <ul className="space-y-4">
          {STEPS.map((k, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <motion.li
                key={k}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: done || active ? 1 : 0.4, x: 0 }}
                className="flex items-center gap-3 text-sm"
              >
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : active ? (
                  <motion.span
                    className="block h-5 w-5 rounded-full border-2 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <span className="block h-5 w-5 rounded-full border-2 border-muted" />
                )}
                <span
                  className={
                    done
                      ? "text-foreground"
                      : active
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                  }
                >
                  {t(k)}
                </span>
              </motion.li>
            );
          })}
        </ul>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-[image:var(--grad-primary)]"
            initial={{ width: "0%" }}
            animate={{ width: `${(current / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </main>
  );
}
