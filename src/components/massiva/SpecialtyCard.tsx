import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Building2 } from "lucide-react";
import { hasNameCollision, type Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import type { ScoreBreakdown } from "@/lib/recommendation";
import { formatRecoExplanation } from "@/lib/recommendation";
import { Sparkles } from "lucide-react";
import { ProbabilityBadge } from "./ProbabilityBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ProbabilityRing } from "./ProbabilityRing";
import { Sparkline } from "./Sparkline";
import { DetailModal } from "./DetailModal";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";
import { CAREER_ICONS } from "@/lib/careerIcons";

interface Props {
  specialty: Specialty;
  studentGrade: number;
  selected: boolean;
  onToggleSelect: () => void;
  matchBreakdown?: ScoreBreakdown | null;
}

export function SpecialtyCard({ specialty, studentGrade, selected, onToggleSelect, matchBreakdown }: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const prob = computeProbability(studentGrade, specialty.predicted2027);
  const matchInsight = matchBreakdown ? formatRecoExplanation(t, matchBreakdown) : null;
  const collision = hasNameCollision(specialty.nameGroup);
  const gapText = `${prob.gap > 0 ? "+" : ""}${prob.gap.toFixed(2)}`;
  const Icon = CAREER_ICONS[specialty.iconKey];

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-lift",
        selected && "border-primary ring-2 ring-primary/30",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `var(${prob.colorVar})` }} />

      <div className="absolute end-4 top-4">
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
          <Checkbox checked={selected} onCheckedChange={onToggleSelect} aria-label={t("card.compare")} />
          {t("card.compare")}
        </label>
      </div>

      <div className="flex items-start gap-3 pe-24">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold tracking-tight text-foreground">{t(specialty.nameKey)}</h3>
            {collision && (
              <span title={t("detail.warning.body")} aria-label={t("detail.warning.prefix")}>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">{t(specialty.fullTitleKey)}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary">
          {t(`diploma.${specialty.diplomaType}`)}
        </span>
        <span className="text-xs text-muted-foreground">{specialty.duration} {t("card.years")}</span>
        <ConfidenceBadge confidence={specialty.confidence} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("card.threshold")}</div>
          <div className="tnum mt-0.5 text-2xl font-bold text-foreground">
            {specialty.predicted2027.toFixed(2)}<span className="text-base font-medium text-muted-foreground">/20</span>
          </div>
          <div className={cn("tnum mt-1 text-sm font-semibold", prob.gap >= 0 ? "text-success" : "text-danger")}>
            {t("card.gap")} {gapText}
          </div>
        </div>
        <ProbabilityRing value={prob.matchPct} colorVar={prob.colorVar} size={76} stroke={7} label={t("card.match")} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <ProbabilityBadge info={prob} />
        <Sparkline thresholds={specialty.thresholds} />
      </div>

      {matchInsight && (
        <div className="mt-3 flex gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-relaxed text-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span>{matchInsight}</span>
        </div>
      )}

      <div className="mt-4 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" aria-hidden />
          <span className="truncate">{t(specialty.universityKey)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {t(specialty.cityKey)} · <span className="tnum">{specialty.places}</span> {t("card.places")}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5"
      >
        {t("card.details")}
      </button>

      <DetailModal open={open} onOpenChange={setOpen} specialty={specialty} studentGrade={studentGrade} />
    </motion.article>
  );
}
