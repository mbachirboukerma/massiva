import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import type { Specialty } from "@/lib/data";
import { CAREER_ICONS } from "@/lib/careerIcons";
import { withProfileSearch } from "@/lib/profileSearch";
import type { StudentProfile } from "@/lib/recommendation";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  anchor: Specialty;
  suggestions: Specialty[];
  profile: StudentProfile | null;
  studentNote?: number;
}

export function SuggestedComparisons({ anchor, suggestions, profile, studentNote }: Props) {
  const t = useT();
  if (suggestions.length === 0) return null;

  const compareIds = [anchor.id, ...suggestions.map((s) => s.id)].slice(0, 3).join(",");

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-soft">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        <Scale className="h-4 w-4 text-primary" /> {t("reco.suggest.compare.title")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("reco.suggest.compare.subtitle")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => {
          const Icon = CAREER_ICONS[s.iconKey];
          return (
            <Link
              key={s.id}
              to="/specialties"
              search={withProfileSearch(
                { compare: compareIds, ...(studentNote != null ? { note: studentNote } : {}) },
                profile,
              )}
              className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {t(s.nameKey)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
