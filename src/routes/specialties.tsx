import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Compass } from "lucide-react";
import { SpecialtiesExplorer } from "@/components/massiva/SpecialtiesExplorer";
import { formatCompareIds, parseCompareIds } from "@/lib/compareSearch";
import { withProfileSearch } from "@/lib/profileSearch";
import { profileToSearch, resolveStudentProfile } from "@/lib/studentProfile";
import { useT } from "@/i18n/I18nProvider";

const searchSchema = z.object({
  compare: z.string().optional(),
  note: z.coerce.number().min(0).max(20).optional(),
  serie: z.enum(["SN", "LN", "SE", "TM"]).optional(),
  interests: z.string().optional(),
  goals: z.string().optional(),
});

export const Route = createFileRoute("/specialties")({
  validateSearch: (raw) => searchSchema.safeParse(raw).data ?? {},
  head: () => ({
    meta: [
      { title: "Spécialités — MASSIVA" },
      { name: "description", content: "Explore les spécialités universitaires algériennes : seuils, débouchés, avis et statistiques." },
    ],
  }),
  component: SpecialtiesPage,
});

function SpecialtiesPage() {
  const t = useT();
  const navigate = useNavigate({ from: "/specialties" });
  const search = Route.useSearch();
  const { compare, note } = search;
  const profile = useMemo(() => resolveStudentProfile(search), [search.serie, search.note, search.interests, search.goals]);
  const compareIds = useMemo(() => parseCompareIds(compare), [compare]);
  const detailSearch = useMemo(
    () => withProfileSearch(note != null ? { note } : {}, profile),
    [note, profile],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
          <Compass className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{t("specialties.hub.title")}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{t("specialties.hub.subtitle")}</p>
        </div>
      </header>

      <SpecialtiesExplorer
        initialCompareIds={compareIds}
        studentNote={note}
        detailSearch={detailSearch}
        profile={profile}
        onCompareChange={(ids) =>
          navigate({
            search: (prev) => ({
              ...prev,
              compare: formatCompareIds(ids),
              ...(profile ? profileToSearch(profile) : {}),
            }),
            replace: true,
          })
        }
        onLaunchCompare={(ids) =>
          navigate({
            to: "/comparer",
            search: withProfileSearch(
              { ids: formatCompareIds(ids), analyze: 1, ...(note != null ? { note } : {}) },
              profile,
            ),
          })
        }
      />
    </main>
  );
}
