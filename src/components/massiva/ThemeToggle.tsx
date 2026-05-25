import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/I18nProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const t = useT();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t("nav.theme.light") : t("nav.theme.dark")}
      className="grid h-10 w-10 place-items-center rounded-lg border bg-background transition-colors hover:bg-secondary"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
