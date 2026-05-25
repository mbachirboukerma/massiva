import { ArrowDownAZ, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

export type SortKey = "probability" | "personalized" | "threshold" | "salary";

interface Props {
  diplomaFilter: string | null;
  setDiplomaFilter: (v: string | null) => void;
  cityFilter: string | null;
  setCityFilter: (v: string | null) => void;
  cities: string[];
  diplomas: string[];
  sort: SortKey;
  setSort: (v: SortKey) => void;
  showPersonalizedSort?: boolean;
}

export function ResultsFilters({ diplomaFilter, setDiplomaFilter, cityFilter, setCityFilter, cities, diplomas, sort, setSort, showPersonalizedSort }: Props) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3 shadow-soft">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Filter className="h-3.5 w-3.5" /> {t("results.filter.label")}
      </span>

      <Chip label={t("results.filter.all")} on={!diplomaFilter} onClick={() => setDiplomaFilter(null)} />
      {diplomas.map((d) => (
        <Chip key={d} label={t(`diploma.${d}`)} on={diplomaFilter === d} onClick={() => setDiplomaFilter(d)} />
      ))}

      <span className="mx-2 hidden h-5 w-px bg-border sm:inline-block" />

      <select
        value={cityFilter ?? ""}
        onChange={(e) => setCityFilter(e.target.value || null)}
        className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
      >
        <option value="">{t("results.filter.allCities")}</option>
        {cities.map((c) => <option key={c} value={c}>{t(`city.${c}`)}</option>)}
      </select>

      <div className="ms-auto inline-flex items-center gap-1 rounded-full border bg-background p-1 text-xs">
        <SortBtn icon={ArrowUpDown} label={t("results.sort.probability")} on={sort === "probability"} onClick={() => setSort("probability")} />
        {showPersonalizedSort && (
          <SortBtn icon={ArrowUpDown} label={t("reco.sort.personalized")} on={sort === "personalized"} onClick={() => setSort("personalized")} />
        )}
        <SortBtn icon={ArrowDownAZ} label={t("results.sort.threshold")} on={sort === "threshold"} onClick={() => setSort("threshold")} />
        <SortBtn icon={ArrowDownAZ} label={t("results.sort.salary")} on={sort === "salary"} onClick={() => setSort("salary")} />
      </div>
    </div>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        on ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function SortBtn({ icon: Icon, label, on, onClick }: { icon: typeof Filter; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition",
        on ? "bg-[image:var(--grad-primary)] text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}
