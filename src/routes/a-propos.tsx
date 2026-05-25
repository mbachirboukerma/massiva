import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/I18nProvider";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — MASSIVA" },
      { name: "description", content: "MASSIVA aide les bacheliers algériens à transformer leurs notes en choix universitaires éclairés." },
    ],
  }),
  component: APropos,
});

function APropos() {
  const t = useT();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("about.title")}</h1>
      <p className="mt-4 text-base text-muted-foreground">{t("about.mission")}</p>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-foreground">{t("about.how.t")}</h2>
        <ol className="list-decimal space-y-2 ps-5 text-sm text-foreground">
          <li>{t("about.how.1")}</li>
          <li>{t("about.how.2")}</li>
          <li>{t("about.how.3")}</li>
        </ol>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-bold text-foreground">{t("about.sources.t")}</h2>
        <p className="text-sm text-muted-foreground">{t("about.sources.d")}</p>
      </section>

      <section className="mt-8 rounded-2xl border bg-card p-5">
        <h2 className="text-base font-semibold text-foreground">{t("about.public.t")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("about.public.d")}</p>
      </section>
    </main>
  );
}
