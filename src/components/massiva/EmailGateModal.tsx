import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { saveEmail } from "@/lib/storage";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; onUnlocked: () => void; }

export function EmailGateModal({ open, onOpenChange, onUnlocked }: Props) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setError(t("gate.error")); return; }
    saveEmail(value); setError(null); onUnlocked(); onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <DialogTitle>{t("gate.title")}</DialogTitle>
          <DialogDescription>{t("gate.subtitle")}</DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-sm text-foreground">
          {[t("gate.feat.1"), t("gate.feat.2"), t("gate.feat.3")].map((x) => (
            <li key={x} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {x}
            </li>
          ))}
        </ul>

        <form onSubmit={submit} className="mt-2 space-y-2" noValidate>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t("gate.placeholder")}
            className="h-11 w-full rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-invalid={error ? "true" : "false"} required
          />
          <p aria-live="polite" className={`min-h-[1rem] text-xs ${error ? "text-destructive" : "sr-only"}`}>{error}</p>
          <button type="submit" className="h-11 w-full rounded-lg bg-[image:var(--grad-primary)] font-semibold text-primary-foreground hover:opacity-90">
            {t("gate.submit")}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">{t("gate.spam")}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
