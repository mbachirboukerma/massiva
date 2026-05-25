import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  primary: "from-primary/20 to-primary/0 text-primary",
  success: "from-success/20 to-success/0 text-success",
  warning: "from-warning/20 to-warning/0 text-warning",
  danger: "from-danger/20 to-danger/0 text-danger",
  info: "from-info/20 to-info/0 text-info",
};

export function StatCard({ icon: Icon, label, value, hint, tone = "primary" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft"
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${TONE[tone]} blur-2xl opacity-60`} />
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl bg-${tone === "primary" ? "primary" : tone}/10 ${TONE[tone].split(" ").pop()}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
      <div className="tnum mt-3 text-3xl font-bold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}
