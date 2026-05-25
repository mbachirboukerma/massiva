import type { Career } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  careers: Career[];
}

export function CareerTimeline({ careers }: Props) {
  const t = useT();
  return (
    <ol className="relative ms-3 space-y-5 border-s-2 border-dashed border-primary/30 ps-6">
      {careers.map((c, i) => (
        <li key={i} className="relative">
          <span className="absolute -start-[34px] grid h-7 w-7 place-items-center rounded-full bg-[image:var(--grad-primary)] text-xs font-bold text-primary-foreground shadow-soft">
            {i + 1}
          </span>
          <div className="rounded-xl border bg-card p-3">
            <div className="text-sm font-semibold text-foreground">{c.nameKey ? t(c.nameKey) : c.name}</div>
            <div className="text-xs text-muted-foreground">{c.durationKey ? t(c.durationKey) : c.duration}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
