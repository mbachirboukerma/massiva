import { Coins } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  range: { min: number; med: number; max: number };
}

export function SalaryBlock({ range }: Props) {
  const t = useT();
  const min = range.min;
  const max = range.max;
  const span = Math.max(1, max - min);
  const medPct = ((range.med - min) / span) * 100;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Coins className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{t("detail.salary.title")}</span>
      </div>
      <div className="mt-4">
        <div className="tnum flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">{range.med}k</span>
          <span className="text-xs text-muted-foreground">{t("detail.salary.median")}</span>
        </div>
        <div className="relative mt-4 h-3 w-full rounded-full bg-muted">
          <div className="absolute inset-y-0 left-[10%] right-[10%] rounded-full bg-[image:var(--grad-primary)] opacity-30" />
          <div className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-background bg-primary shadow-soft" style={{ left: `calc(${medPct}% - 10px)` }} />
        </div>
        <div className="tnum mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{range.min}k</span>
          <span>{range.max}k</span>
        </div>
      </div>
    </div>
  );
}
