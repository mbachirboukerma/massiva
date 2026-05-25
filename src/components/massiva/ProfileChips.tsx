import { useT } from "@/i18n/I18nProvider";
import type { StudentProfile } from "@/lib/recommendation";
import { hasPersonalization } from "@/lib/studentProfile";

export function ProfileChips({ profile }: { profile: StudentProfile }) {
  const t = useT();
  if (!hasPersonalization(profile)) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{t("reco.profile.active")}</span>
      {profile.interests.map((id) => (
        <span key={id} className="rounded-full border border-primary/25 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
          {t(`form.interest.${id}`)}
        </span>
      ))}
      {profile.goals.map((id) => (
        <span key={id} className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
          {t(`form.goal.${id}.label`)}
        </span>
      ))}
    </div>
  );
}
