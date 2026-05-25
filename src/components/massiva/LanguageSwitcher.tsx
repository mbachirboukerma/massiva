import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LOCALES, type Locale } from "@/i18n/translations";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const current = LOCALES.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.lang")}
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-secondary"
      >
        <Languages className="h-4 w-4" aria-hidden />
        <span className="tnum">{current?.native}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLocale(l.code as Locale)}
            className={l.code === locale ? "bg-secondary font-semibold" : ""}
          >
            <span className="tnum mr-2 w-7 text-xs text-muted-foreground">{l.native}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
