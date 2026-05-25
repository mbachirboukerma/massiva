import { AlertTriangle } from "lucide-react";
import { findSameNameCollisions } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

export function SameNameWarning() {
  const t = useT();
  const collisions = findSameNameCollisions();
  if (collisions.size === 0) return null;

  return (
    <section className="rounded-2xl border border-warning/40 bg-warning/10 p-5">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" aria-hidden />
        <div>
          <h2 className="text-base font-semibold text-foreground">{t("collision.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("collision.subtitle")}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {[...collisions.entries()].map(([group, list]) => (
          <div key={group} className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-start text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium text-start">{t("compare.diploma")}</th>
                  <th className="px-3 py-2 font-medium text-start">{t("compare.duration")}</th>
                  <th className="px-3 py-2 font-medium text-start">{t("compare.predicted27")}</th>
                  <th className="px-3 py-2 font-medium text-start">{t("compare.city")}</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {list.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{t(s.nameKey)} — {t(`diploma.${s.diplomaType}`)}</td>
                    <td className="px-3 py-2">{s.duration} {t("card.years")}</td>
                    <td className="px-3 py-2">{s.predicted2027.toFixed(2)}/20</td>
                    <td className="px-3 py-2">{t(s.cityKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
