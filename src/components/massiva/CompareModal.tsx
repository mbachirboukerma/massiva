import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import type { Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: Specialty[];
  studentGrade: number;
}

function StarRating({ n }: { n: number }) {
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? "fill-warning text-warning" : "text-muted"}`} />
      ))}
    </span>
  );
}

function Bar({ n, max = 5, tone = "primary" }: { n: number; max?: number; tone?: "primary" | "danger" }) {
  return (
    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full ${tone === "danger" ? "bg-danger" : "bg-primary"}`} style={{ width: `${(n / max) * 100}%` }} />
    </div>
  );
}

export function CompareModal({ open, onOpenChange, items, studentGrade }: Props) {
  const t = useT();
  const ids = items.map((s) => s.id).join(",");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("compare.title")}</DialogTitle>
        </DialogHeader>
        <div className={`grid gap-4 ${items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {items.map((s) => {
            const gap = computeProbability(studentGrade, s.predicted2027).gap;
            return (
              <article key={s.id} className="rounded-2xl border bg-card p-4 shadow-soft">
                <div className="text-base font-bold text-foreground">{t(s.nameKey)}</div>
                <div className="text-xs text-muted-foreground">{t(`diploma.${s.diplomaType}`)} · {s.duration} {t("card.years")}</div>
                <dl className="tnum mt-4 space-y-2.5 text-sm">
                  <Row label={t("compare.threshold25")} v={`${(s.thresholds[2025] ?? 0).toFixed(2)}/20`} />
                  <Row label={t("compare.predicted27")} v={`${s.predicted2027.toFixed(2)}/20`} />
                  <Row label={t("compare.yourGap")} v={`${gap > 0 ? "+" : ""}${gap.toFixed(2)}`} tone={gap >= 0 ? "good" : "bad"} />
                  <Row label={t("compare.salary")} v={`~${s.estimatedSalary}k DZD`} />
                  <Row label={t("compare.stability")} v={<StarRating n={s.stability} />} />
                  <Row label={t("compare.competition")} v={<Bar n={s.competition} tone="danger" />} />
                  <Row label={t("compare.intl")} v={<Bar n={s.internationalOpportunity} />} />
                  <Row label={t("compare.city")} v={t(s.cityKey)} />
                </dl>
              </article>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center border-t border-border/60 pt-4">
          <Link
            to="/specialties"
            search={{ compare: ids, note: studentGrade }}
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--grad-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
          >
            {t("compare.openFull")} <ArrowRight className="h-4 w-4 rtl:scale-x-[-1]" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, v, tone }: { label: string; v: React.ReactNode; tone?: "good" | "bad" }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`text-sm font-semibold ${tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-foreground"}`}>{v}</dd>
    </div>
  );
}
