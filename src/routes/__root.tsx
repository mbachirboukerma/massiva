import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter,
  HeadContent, Scripts, ScriptOnce,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/massiva/Header";
import { I18nProvider, useT } from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

const themeBootstrap = `(function(){try{var t=localStorage.getItem("massiva:theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark")document.documentElement.classList.add("dark");var l=localStorage.getItem("massiva:locale");if(l==="ar"){document.documentElement.dir="rtl";document.documentElement.lang="ar";}else if(l==="en"){document.documentElement.lang="en";}}catch(e){}})();`;

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notfound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notfound.subtitle")}</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            {t("notfound.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Erreur</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Réessayer
          </button>
          <a href="/" className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Accueil</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MASSIVA — AI Orientation post-Bac DZ" },
      { name: "description", content: "Plateforme d'orientation IA pour bacheliers algériens : recommandations personnalisées, comparaisons et analyses multilingues." },
      { property: "og:title", content: "MASSIVA — AI Orientation post-Bac DZ" },
      { property: "og:description", content: "Plateforme d'orientation IA pour bacheliers algériens : recommandations personnalisées, comparaisons et analyses multilingues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MASSIVA — AI Orientation post-Bac DZ" },
      { name: "twitter:description", content: "Plateforme d'orientation IA pour bacheliers algériens : recommandations personnalisées, comparaisons et analyses multilingues." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/455b3044-ac92-42a7-8f55-6457b368889f/id-preview-9e894494--12f194d6-032f-4701-9862-bec216c0488d.lovable.app-1779380929999.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/455b3044-ac92-42a7-8f55-6457b368889f/id-preview-9e894494--12f194d6-032f-4701-9862-bec216c0488d.lovable.app-1779380929999.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ScriptOnce>{themeBootstrap}</ScriptOnce>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function FooterNotice() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-border/60 bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} MASSIVA · {t("footer.notice")}
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Outlet />
            <FooterNotice />
          </div>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
