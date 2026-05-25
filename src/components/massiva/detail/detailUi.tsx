import type { ComponentType, ReactNode } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const DETAIL_TONE: Record<string, { bg: string; fg: string; ring: string }> = {
  primary: { bg: "bg-primary/10", fg: "text-primary", ring: "ring-primary/20" },
  success: { bg: "bg-success/10", fg: "text-success", ring: "ring-success/20" },
  info: { bg: "bg-info/10", fg: "text-info", ring: "ring-info/20" },
  warning: { bg: "bg-warning/10", fg: "text-warning", ring: "ring-warning/20" },
};

export function profileTextKey(iconKey: string): string {
  if (["stethoscope", "pill", "tooth"].includes(iconKey)) return "mock.ai.profile.health";
  if (["code", "zap"].includes(iconKey)) return "mock.ai.profile.tech";
  if (["languages", "globe"].includes(iconKey)) return "mock.ai.profile.intl";
  return "mock.ai.profile.versatile";
}

export function MiniStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: keyof typeof DETAIL_TONE;
}) {
  const c = DETAIL_TONE[tone];
  return (
    <div className={`flex items-center gap-2 rounded-xl border bg-card p-2.5 shadow-soft ring-1 ${c.ring}`}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${c.bg} ${c.fg}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="tnum text-sm font-bold text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function AccordionSection({
  value,
  icon: Icon,
  title,
  children,
}: {
  value: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={value} className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-1">{children}</AccordionContent>
    </AccordionItem>
  );
}

export function InsightCard({
  icon: Icon,
  tone,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: keyof typeof DETAIL_TONE;
  title: string;
  text: string;
}) {
  const c = DETAIL_TONE[tone];
  return (
    <div className={`rounded-lg border bg-background/60 p-3 ring-1 ${c.ring}`}>
      <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${c.fg}`}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-foreground">{text}</p>
    </div>
  );
}
