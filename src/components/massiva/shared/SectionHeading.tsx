interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "start" }: Props) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {subtitle && <p className={`mt-3 max-w-2xl text-muted-foreground ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>}
    </div>
  );
}
