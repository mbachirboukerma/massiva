import { ArrowDownRight, ArrowUpRight, Minus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";
import type { Confidence } from "@/lib/data";

const MAP: Record<Confidence, { dot: string; icon: typeof Minus; key: string }> = {
  Stable: { dot: "bg-success", icon: Minus, key: "conf.Stable" },
  Volatile: { dot: "bg-warning", icon: Activity, key: "conf.Volatile" },
  "Trending Up": { dot: "bg-info", icon: ArrowUpRight, key: "conf.Trending Up" },
  "Trending Down": { dot: "bg-destructive", icon: ArrowDownRight, key: "conf.Trending Down" },
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const cfg = MAP[confidence];
  const Icon = cfg.icon;
  const t = useT();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} aria-hidden />
      <Icon className="h-3 w-3" aria-hidden />
      {t(cfg.key)}
    </span>
  );
}
