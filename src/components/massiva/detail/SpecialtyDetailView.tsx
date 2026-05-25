import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import type { Specialty } from "@/lib/data";
import type { StudentProfile } from "@/lib/recommendation";
import { loadStudentProfile } from "@/lib/studentProfile";
import { withProfileSearch } from "@/lib/profileSearch";
import { SuggestedComparisons } from "@/components/massiva/SuggestedComparisons";
import { ThresholdChart } from "./ThresholdChart";
import { EmploymentDonut } from "./EmploymentDonut";
import { SalaryBlock } from "./SalaryBlock";
import { CareerTimeline } from "./CareerTimeline";
import { BarList } from "./BarList";
import { ReviewsBlock } from "./ReviewsBlock";
import { StatCard } from "@/components/massiva/shared/StatCard";
import { useSpecialtyDetail } from "./useSpecialtyDetail";
import { AccordionSection, InsightCard, MiniStat, profileTextKey } from "./detailUi";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Brain,
  Briefcase,
  Compass,
  Download,
  Globe2,
  Heart,
  Info,
  Lock,
  Scale,
  ShieldAlert,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

export type SpecialtyDetailVariant = "modal" | "page";

interface Props {
  specialty: Specialty;
  variant: SpecialtyDetailVariant;
  studentGrade?: number;
  profile?: StudentProfile | null;
  /** Modal: chart locked behind email gate */
  chartLocked?: boolean;
  onRequestChartUnlock?: () => void;
  /** Modal: PDF download */
  chartUnlocked?: boolean;
  onDownloadPdf?: () => void;
  /** Modal: close dialog when navigating away */
  onNavigateAway?: () => void;
}

export function SpecialtyDetailView({
  specialty,
  variant,
  studentGrade,
  profile: profileProp,
  chartLocked = false,
  onRequestChartUnlock,
  chartUnlocked = true,
  onDownloadPdf,
  onNavigateAway,
}: Props) {
  const profile = profileProp ?? loadStudentProfile();
  const {
    t,
    detail,
    profileExplain,
    aiSummaryText,
    suggestions,
    avgSat,
    avgDiff,
    recommendPct,
  } = useSpecialtyDetail(specialty, studentGrade, profile);

  const navSearch = withProfileSearch(
    studentGrade != null ? { note: studentGrade } : {},
    profile,
  );
  const isModal = variant === "modal";

  const warningBanner = specialty.warnings.length > 0 && (
    <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <div>
        <strong>{t("detail.warning.prefix")}</strong> {t("detail.warning.body")}
      </div>
    </div>
  );

  const thresholdSection = (
    <motion.section
      initial={isModal ? { opacity: 0, y: 8 } : false}
      animate={isModal ? { opacity: 1, y: 0 } : undefined}
      transition={isModal ? { duration: 0.35 } : undefined}
      className={`relative overflow-hidden rounded-2xl border bg-card shadow-soft ${isModal ? "p-5" : "p-6"}`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
      <div className={isModal ? "mb-3 flex flex-wrap items-center justify-between gap-2" : ""}>
        <h2
          className={
            isModal
              ? "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"
              : "flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground"
          }
        >
          {isModal ? (
            <>
              <Sparkles className="h-4 w-4" /> {t("detail.chart.title")}
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4 text-primary" /> {t("detail.section.threshold")}
            </>
          )}
        </h2>
        {isModal && studentGrade != null && (
          <span className="tnum text-xs font-semibold text-muted-foreground">
            {t("detail.chart.note", { note: studentGrade.toFixed(2) })}
          </span>
        )}
      </div>
      <div
        className={`relative rounded-xl border bg-background/60 ${isModal ? "p-3" : "mt-4 p-3"} ${chartLocked ? "select-none" : ""}`}
      >
        <ThresholdChart
          thresholds={specialty.thresholds}
          predicted={specialty.predicted2027}
          studentGrade={studentGrade}
        />
        {chartLocked && (
          <button
            type="button"
            onClick={onRequestChartUnlock}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-background/70 backdrop-blur-sm"
            aria-label={t("detail.chart.unlock")}
          >
            <Lock className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground">{t("detail.chart.unlock")}</span>
          </button>
        )}
      </div>
      {isModal && (
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("detail.disclaimer")}
        </p>
      )}
    </motion.section>
  );

  const aiSummarySection = (
    <motion.section
      initial={!isModal ? { opacity: 0, y: 8 } : false}
      whileInView={!isModal ? { opacity: 1, y: 0 } : undefined}
      viewport={!isModal ? { once: true } : undefined}
      className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[image:var(--grad-primary)]" />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="h-4 w-4" /> {t("detail.aiSummary.title")}
      </div>
      <p className="mt-3 text-base leading-relaxed text-foreground">{aiSummaryText}</p>
      {profileExplain && (
        <p className="mt-2 text-xs text-muted-foreground">{detail.aiSummary}</p>
      )}
    </motion.section>
  );

  const employmentBlock = <EmploymentDonut data={detail.employment} />;
  const salaryBlock = <SalaryBlock range={detail.salaryRange} />;
  const abroadBlock = (
    <BarList items={detail.abroad.map((a) => ({ label: a.country, value: a.value, flag: a.flag }))} />
  );
  const satisfactionBlock = <BarList items={detail.satisfaction} tone="success" />;
  const difficultyBlock = <BarList items={detail.difficulty} tone="warning" />;
  const reviewsBlock = <ReviewsBlock reviews={detail.reviews} />;

  const aiInsightCards = (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <InsightCard
        icon={Target}
        tone="primary"
        title={t("detail.modal.ai.suitable")}
        text={t(profileTextKey(specialty.iconKey))}
      />
      <InsightCard
        icon={TrendingUp}
        tone="success"
        title={t("detail.modal.ai.strengths")}
        text={`${t("detail.stat.employment")} ${detail.employment.employed}% · ${t("detail.modal.community.satisfaction")} ${avgSat}%`}
      />
      <InsightCard
        icon={ShieldAlert}
        tone="warning"
        title={t("detail.modal.ai.watch")}
        text={`${t("detail.section.difficulty")}: ${avgDiff}/100`}
      />
      <InsightCard
        icon={Compass}
        tone="info"
        title={t("detail.modal.ai.outlook")}
        text={`${t("detail.stat.salary")}: ${detail.salaryRange.min}k – ${detail.salaryRange.max}k`}
      />
    </div>
  );

  if (isModal) {
    return (
      <div className="space-y-6">
        {warningBanner}
        {thresholdSection}

        <section>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("detail.modal.quickStats")}
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat icon={Briefcase} label={t("detail.stat.employment")} value={`${detail.employment.employed}%`} tone="success" />
            <MiniStat icon={Wallet} label={t("detail.stat.salary")} value={`${detail.salaryRange.med}k`} tone="info" />
            <MiniStat icon={Heart} label={t("detail.modal.community.satisfaction")} value={`${avgSat}%`} tone="warning" />
            <MiniStat icon={Star} label={t("detail.modal.community.recommend")} value={`${recommendPct}%`} tone="primary" />
          </div>
        </section>

        <Accordion type="multiple" defaultValue={["ai"]} className="space-y-2">
          <AccordionSection value="ai" icon={Brain} title={t("detail.modal.section.ai")}>
            <p className="rounded-lg border bg-background/60 p-3 text-sm leading-relaxed text-foreground">
              {aiSummaryText}
            </p>
            {profileExplain && (
              <p className="mt-2 text-xs text-muted-foreground">{detail.aiSummary}</p>
            )}
            {aiInsightCards}
          </AccordionSection>
          <AccordionSection value="emp" icon={Briefcase} title={t("detail.modal.section.employment")}>
            {employmentBlock}
          </AccordionSection>
          <AccordionSection value="sal" icon={Wallet} title={t("detail.modal.section.salary")}>
            {salaryBlock}
          </AccordionSection>
          <AccordionSection value="sat" icon={Heart} title={t("detail.modal.section.satisfaction")}>
            <div className="grid gap-4 sm:grid-cols-2">
              {satisfactionBlock}
              {difficultyBlock}
            </div>
          </AccordionSection>
          <AccordionSection value="abr" icon={Globe2} title={t("detail.modal.section.abroad")}>
            {abroadBlock}
          </AccordionSection>
          <AccordionSection value="rev" icon={Star} title={t("detail.modal.section.reviews")}>
            {reviewsBlock}
          </AccordionSection>
        </Accordion>

        <section>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("detail.career.title")}
          </h4>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {specialty.careers.map((c, i) => (
              <li key={i} className="rounded-lg border bg-background p-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[image:var(--grad-primary)] text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {c.nameKey ? t(c.nameKey) : c.name}
                  </span>
                </div>
                <p className="mt-1 ps-9 text-xs text-muted-foreground">
                  {c.durationKey ? t(c.durationKey) : c.duration}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="text-xs text-muted-foreground">
            {t(specialty.universityKey)} · {t(specialty.cityKey)} · {specialty.places} {t("card.places")}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              {chartUnlocked ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {t("detail.download")}
            </button>
            <Link
              to="/specialties"
              search={withProfileSearch(
                { compare: String(specialty.id), ...(studentGrade != null ? { note: studentGrade } : {}) },
                profile,
              )}
              onClick={onNavigateAway}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              <Scale className="h-4 w-4" /> {t("detail.cta.compare")}
            </Link>
            <Link
              to="/specialite/$id"
              params={{ id: String(specialty.id) }}
              search={navSearch}
              onClick={onNavigateAway}
              className="group inline-flex items-center gap-2 rounded-lg bg-[image:var(--grad-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
              title={t("detail.modal.openFullHint")}
            >
              {t("detail.modal.openFull")}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // —— Full page layout ——
  return (
    <div className="space-y-8">
      {warningBanner}
      {aiSummarySection}

      <SuggestedComparisons
        anchor={specialty}
        suggestions={suggestions}
        profile={profile}
        studentNote={studentGrade}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label={t("detail.stat.threshold")}
          value={`${specialty.predicted2027.toFixed(2)}/20`}
          hint={t("detail.stat.threshold.hint")}
          tone="primary"
        />
        <StatCard
          icon={Briefcase}
          label={t("detail.stat.employment")}
          value={`${detail.employment.employed}%`}
          hint={t("detail.stat.employment.hint")}
          tone="success"
        />
        <StatCard
          icon={Globe2}
          label={t("detail.stat.salary")}
          value={`${detail.salaryRange.med}k`}
          hint={t("detail.stat.salary.hint")}
          tone="info"
        />
        <StatCard
          icon={Star}
          label={t("detail.stat.satisfaction")}
          value={`${avgSat}%`}
          hint={t("detail.stat.satisfaction.hint")}
          tone="warning"
        />
      </section>

      {thresholdSection}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {t("detail.section.employment")}
          </h2>
          <div className="mt-4">{employmentBlock}</div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {t("detail.section.salary")}
          </h2>
          <div className="mt-4">{salaryBlock}</div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Globe2 className="h-4 w-4 text-primary" /> {t("detail.section.abroad")}
          </h2>
          <div className="mt-4">{abroadBlock}</div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Heart className="h-4 w-4 text-primary" /> {t("detail.section.satisfaction")}
          </h2>
          <div className="mt-4">{satisfactionBlock}</div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Brain className="h-4 w-4 text-primary" /> {t("detail.section.difficulty")}
          </h2>
          <div className="mt-4">{difficultyBlock}</div>
        </section>
        <section className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            {t("detail.section.timeline")}
          </h2>
          <div className="mt-5">
            <CareerTimeline careers={specialty.careers} />
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <Star className="h-4 w-4 text-warning" /> {t("detail.section.reviews")}
        </h2>
        {reviewsBlock}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5 shadow-soft">
        <div>
          <div className="text-sm font-bold text-foreground">{t("detail.cta.title")}</div>
          <div className="text-xs text-muted-foreground">{t("detail.cta.subtitle")}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/specialties"
            search={withProfileSearch(
              { compare: String(specialty.id), ...(studentGrade != null ? { note: studentGrade } : {}) },
              profile,
            )}
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-secondary"
          >
            <Scale className="h-4 w-4" /> {t("detail.cta.compare")}
          </Link>
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--grad-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
          >
            <Download className="h-4 w-4" /> {t("detail.cta.pdf")}
          </button>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">{t("detail.cta.disclaimer")}</p>
    </div>
  );
}
