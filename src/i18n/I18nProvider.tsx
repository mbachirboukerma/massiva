import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DICTS, LOCALES, format, type Locale } from "./translations";

const STORAGE_KEY = "massiva:locale";

interface Ctx {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<Ctx | null>(null);

function detectInitial(): Locale {
  if (typeof window === "undefined") return "fr";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && DICTS[saved]) return saved;
  } catch {}
  return "fr";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    const initial = detectInitial();
    if (initial !== "fr") setLocaleState(initial);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.dataset.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => {
    const dict = DICTS[locale];
    const dir = LOCALES.find((l) => l.code === locale)?.dir ?? "ltr";
    return {
      locale,
      dir,
      setLocale,
      t: (key, vars) => format(dict[key] ?? DICTS.fr[key] ?? key, vars),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so non-wrapped trees don't crash
    return {
      locale: "fr" as Locale,
      dir: "ltr" as const,
      setLocale: () => {},
      t: (k: string, vars?: Record<string, string | number>) => format(DICTS.fr[k] ?? k, vars),
    };
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
