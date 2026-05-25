import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowLeft, Building2, MapPin, GraduationCap } from "lucide-react";
import { getSpecialtyById, type Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { resolveStudentProfile } from "@/lib/studentProfile";
import { withProfileSearch } from "@/lib/profileSearch";
import { SpecialtyDetailView } from "@/components/massiva/detail/SpecialtyDetailView";
import { CAREER_ICONS } from "@/lib/careerIcons";
import { ProbabilityRing } from "@/components/massiva/ProbabilityRing";
import { ProbabilityBadge } from "@/components/massiva/ProbabilityBadge";
import { ConfidenceBadge } from "@/components/massiva/ConfidenceBadge";
import { useT } from "@/i18n/I18nProvider";

const searchSchema = z.object({
  note: z.coerce.number().min(0).max(20).optional(),
  serie: z.enum(["SN", "LN", "SE", "TM"]).optional(),
  interests: z.string().optional(),
  goals: z.string().optional(),
});

export const Route = createFileRoute("/specialite/$id")({
  validateSearch: (raw) => {
    const r = searchSchema.safeParse(raw);
    return r.success ? r.data : {};
  },
  loader: ({ params }) => {
    const s = getSpecialtyById(Number(params.id));
    if (!s) throw notFound();
    return { specialty: s };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.specialty.fullTitle} — MASSIVA` : "MASSIVA" },
      { name: "description", content: loaderData?.specialty.description ?? "" },
    ],
  }),
  component: SpecialtyPage,
  notFoundComponent: NotFound,
});

function NotFound() {
  const t = useT();
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">{t("seo.specialty.notFound")}</h1>
      <Link to="/" className="mt-4 inline-block text-primary hover:underline">{t("notfound.back")}</Link>
    </main>
  );
}

function SpecialtyPage() {
  const t = useT();
  const data = Route.useLoaderData() as { specialty: Specialty };
  const { specialty } = data;
  const search = Route.useSearch();
  const profile = useMemo(() => resolveStudentProfile(search), [search.serie, search.note, search.interests, search.goals]);
  const studentGrade = typeof search.note === "number" ? search.note : profile?.note;
  const Icon = CAREER_ICONS[specialty.iconKey];
  const prob = studentGrade != null ? computeProbability(studentGrade, specialty.predicted2027) : null;

  function tryDownload() {
    console.info("[MASSIVA] PDF placeholder for", specialty.id);
  }

  return (
    <main className="pb-16">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/resultats"
            search={profile ? withProfileSearch({}, profile) : studentGrade ? { note: studentGrade } : {}}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {t("detail.back")}
          </Link>
          <div className="mt-4 grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                  <GraduationCap className="h-3.5 w-3.5" /> {t(`diploma.${specialty.diplomaType}`)}
                </span>
                <ConfidenceBadge confidence={specialty.confidence} />
                {prob && <ProbabilityBadge info={prob} />}
              </div>
              <div className="mt-4 flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-lift">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{t(specialty.nameKey)}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{t(specialty.fullTitleKey)}</p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-base text-foreground/90">{t(specialty.descriptionKey)}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {t(specialty.universityKey)}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {t(specialty.cityKey)}</span>
                <span className="tnum">{t("detail.places", { n: specialty.places })}</span>
                <span className="tnum">{t("detail.years", { n: specialty.duration })}</span>
              </div>
            </div>
            {prob && (
              <div className="flex justify-center lg:justify-end">
                <ProbabilityRing value={prob.matchPct} colorVar={prob.colorVar} size={140} stroke={12} label={t("card.match")} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SpecialtyDetailView
          variant="page"
          specialty={specialty}
          studentGrade={studentGrade}
          profile={profile}
          onDownloadPdf={tryDownload}
        />
      </div>
    </main>
  );
}
