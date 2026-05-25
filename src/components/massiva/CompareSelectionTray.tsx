import { AnimatePresence, motion } from "framer-motion";
import { Scale, Sparkles, X } from "lucide-react";
import { getSpecialtyById } from "@/lib/data";
import { CAREER_ICONS } from "@/lib/careerIcons";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  selectedIds: number[];
  onRemove: (id: number) => void;
  onClear: () => void;
  onCompare: () => void;
}

/** Bottom compare bar — secondary action, shown only when selections exist. */
export function CompareSelectionTray({ selectedIds, onRemove, onClear, onCompare }: Props) {
  const t = useT();
  if (selectedIds.length === 0) return null;

  const canCompare = selectedIds.length >= 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-4 py-3 shadow-lift backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">
              {t("compare.select.chosen", { n: selectedIds.length })}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("compare.select.clear")}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <AnimatePresence>
              {selectedIds.map((id) => {
                const s = getSpecialtyById(id);
                if (!s) return null;
                const Icon = CAREER_ICONS[s.iconKey];
                return (
                  <motion.span
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    <Icon className="h-3 w-3" />
                    {t(s.nameKey)}
                    <button
                      type="button"
                      onClick={() => onRemove(id)}
                      className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary/15"
                      aria-label={t("compare.select.remove")}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
          {!canCompare && (
            <p className="mt-1.5 text-xs text-muted-foreground">{t("compare.select.min")}</p>
          )}
        </div>
        <button
          type="button"
          disabled={!canCompare}
          onClick={onCompare}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[image:var(--grad-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
        >
          <Sparkles className="h-4 w-4" />
          {t("compare.select.launch")}
          <Scale className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
