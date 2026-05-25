import { cn } from "@/lib/utils";
import type { ProbabilityInfo } from "@/lib/probability";
import { useT } from "@/i18n/I18nProvider";
import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from "lucide-react";

const ICONS = {
  "tres-probable": CheckCircle2,
  possible: HelpCircle,
  difficile: AlertTriangle,
  "tres-difficile": XCircle,
} as const;

export function ProbabilityBadge({ info, className }: { info: ProbabilityInfo; className?: string }) {
  const t = useT();
  const Icon = ICONS[info.level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", info.tokenClass, className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {t(info.labelKey)}
    </span>
  );
}
