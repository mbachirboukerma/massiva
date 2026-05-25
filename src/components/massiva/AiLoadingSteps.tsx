import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  onDone: () => void;
  step?: number; // optional control
}

const STEP_KEYS = ["ai.loading.1", "ai.loading.2", "ai.loading.3", "ai.loading.4"];
const STEP_MS = 700;

export function AiLoadingSteps({ onDone }: Props) {
  const t = useT();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= STEP_KEYS.length) {
      onDone();
      return;
    }
    const id = setTimeout(() => setCurrent((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [current, onDone]);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}>
          <Loader2 className="h-5 w-5" />
        </motion.div>
        MASSIVA AI
      </div>
      <ul className="space-y-3">
        {STEP_KEYS.map((k, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <motion.li
              key={k}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: done || active ? 1 : 0.4, y: 0 }}
              className="flex items-center gap-3 text-sm"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : active ? (
                <motion.span
                  className="block h-4 w-4 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <span className="block h-4 w-4 rounded-full border-2 border-muted" />
              )}
              <span className={done ? "text-foreground" : active ? "text-foreground font-medium" : "text-muted-foreground"}>
                {t(k)}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
