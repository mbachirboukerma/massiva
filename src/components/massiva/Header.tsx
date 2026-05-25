import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const LINKS: Array<{ to: "/" | "/ai" | "/specialties" | "/debouches" | "/a-propos"; key: string; exact?: boolean }> = [
  { to: "/", key: "nav.home", exact: true },
  { to: "/ai", key: "nav.ai" },
  { to: "/specialties", key: "nav.specialties" },
  { to: "/debouches", key: "nav.debouches" },
  { to: "/a-propos", key: "nav.about" },
];

export function Header() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled ? "border-border/80 bg-background/85 shadow-soft backdrop-blur-xl" : "border-transparent bg-background/60 backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg tracking-tight">MASSIVA</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={l.exact ? { exact: true } : undefined}
              className="relative rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
            >
              {({ isActive }) => (
                <>
                  {t(l.key)}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[image:var(--grad-primary)]" />
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 rounded-xl border bg-card/60 p-1 backdrop-blur md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border md:hidden"
              aria-label={t("nav.menu")}
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">{t("nav.menu")}</SheetTitle>
            <div className="mt-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={l.exact ? { exact: true } : undefined}
                  className="rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "bg-secondary text-foreground font-semibold" }}
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
