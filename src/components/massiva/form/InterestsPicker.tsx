import { Atom, Code2, Heart, Languages, Palette, Briefcase, Stethoscope, Wrench, BookOpen, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

const INTERESTS = [
  { id: "sciences", icon: Atom },
  { id: "sante", icon: Stethoscope },
  { id: "tech", icon: Code2 },
  { id: "langues", icon: Languages },
  { id: "art", icon: Palette },
  { id: "business", icon: Briefcase },
  { id: "ingenierie", icon: Wrench },
  { id: "social", icon: Heart },
  { id: "lettres", icon: BookOpen },
  { id: "international", icon: Globe2 },
];

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
}

export function InterestsPicker({ value, onChange }: Props) {
  const t = useT();
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {INTERESTS.map((it) => {
        const on = value.includes(it.id);
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => toggle(it.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              on
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            <it.icon className="h-3.5 w-3.5" />
            {t(`form.interest.${it.id}`)}
          </button>
        );
      })}
    </div>
  );
}
