import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, FileText, X, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  onFile: (f: File | null) => void;
}

export function Dropzone({ file, onFile }: Props) {
  const t = useT();
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) { onFile(accepted[0]); setProgress(0); }
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "image/*": [".png", ".jpg", ".jpeg"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setDrag(true),
    onDragLeave: () => setDrag(false),
  });

  // Fake upload progress on file select
  useEffect(() => {
    if (!file) { setProgress(0); return; }
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + Math.max(2, Math.floor(Math.random() * 12));
      });
    }, 80);
    return () => clearInterval(id);
  }, [file]);

  if (file) {
    const done = progress >= 100;
    return (
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-12 w-12 place-items-center rounded-xl text-primary-foreground", done ? "bg-success" : "bg-[image:var(--grad-primary)]")}>
            {done ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">{file.name}</div>
            <div className="truncate text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · {done ? t("ai.upload.ready") : t("ai.upload.uploading")}</div>
          </div>
          <button type="button" onClick={() => onFile(null)} aria-label={t("ai.upload.remove")} className="rounded-lg border p-2 text-muted-foreground hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div className={cn("h-full rounded-full", done ? "bg-success" : "bg-[image:var(--grad-primary)]")} animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-card/60 p-10 text-center transition-colors",
        (isDragActive || drag) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
      )}
    >
      <input {...getInputProps()} />
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[image:var(--grad-primary)] text-primary-foreground shadow-soft">
        <FileUp className="h-6 w-6" />
      </span>
      <div className="text-sm font-semibold text-foreground">{t("ai.upload.drop")}</div>
      <div className="text-xs text-muted-foreground">{t("ai.upload.formats")}</div>
    </div>
  );
}
