import { Coins, Shield, Plane, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

const GOALS = [
  { id: "salary", icon: Coins },
  { id: "stability", icon: Shield },
  { id: "abroad", icon: Plane },
  { id: "passion", icon: Heart },
];

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export function CareerGoalsPicker({ value, onChange }: Props) {
  const t = useT();
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {GOALS.map((g) => {
        const on = value.includes(g.id);
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => toggle(g.id)}
            className={cn(
              "group flex flex-col items-start gap-2 rounded-xl border p-3 text-start transition",
              on ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40",
            )}
          >
            <span className={cn("grid h-9 w-9 place-items-center rounded-lg", on ? "bg-[image:var(--grad-primary)] text-primary-foreground" : "bg-secondary text-muted-foreground")}>
              <g.icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">{t(`form.goal.${g.id}.label`)}</div>
              <div className="text-[11px] text-muted-foreground">{t(`form.goal.${g.id}.desc`)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
