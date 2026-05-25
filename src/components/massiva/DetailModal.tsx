import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Specialty } from "@/lib/data";
import { computeProbability } from "@/lib/probability";
import { ProbabilityBadge } from "./ProbabilityBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { EmailGateModal } from "./EmailGateModal";
import { SpecialtyDetailView } from "./detail/SpecialtyDetailView";
import { getSavedEmail } from "@/lib/storage";
import { loadStudentProfile } from "@/lib/studentProfile";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  specialty: Specialty;
  studentGrade: number;
}

export function DetailModal({ open, onOpenChange, specialty, studentGrade }: Props) {
  const t = useT();
  const [gateOpen, setGateOpen] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean>(() => !!getSavedEmail());
  const prob = computeProbability(studentGrade, specialty.predicted2027);
  const profile = loadStudentProfile();

  function tryDownload() {
    if (!unlocked) return setGateOpen(true);
    console.info("[MASSIVA] PDF placeholder for", specialty.id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="relative overflow-hidden border-b border-border/60 px-6 pb-5 pt-6 sm:px-7">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-70" style={{ background: "var(--grad-hero)" }} />
          <DialogHeader className="space-y-2 text-start">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-semibold text-primary">
                {t(`diploma.${specialty.diplomaType}`)}
              </span>
              <ConfidenceBadge confidence={specialty.confidence} />
              <ProbabilityBadge info={prob} />
            </div>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">{t(specialty.fullTitleKey)}</DialogTitle>
            <DialogDescription>{t(specialty.descriptionKey)}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 pt-5 sm:px-7">
          <SpecialtyDetailView
            variant="modal"
            specialty={specialty}
            studentGrade={studentGrade}
            profile={profile}
            chartLocked={!unlocked}
            chartUnlocked={unlocked}
            onRequestChartUnlock={() => setGateOpen(true)}
            onDownloadPdf={tryDownload}
            onNavigateAway={() => onOpenChange(false)}
          />
        </div>

        <EmailGateModal open={gateOpen} onOpenChange={setGateOpen} onUnlocked={() => setUnlocked(true)} />
      </DialogContent>
    </Dialog>
  );
}
