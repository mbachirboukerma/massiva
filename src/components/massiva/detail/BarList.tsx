import { motion } from "framer-motion";

interface Props {
  items: { label: string; value: number; flag?: string }[];
  tone?: "primary" | "success" | "warning";
}

export function BarList({ items, tone = "primary" }: Props) {
  const color = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-[image:var(--grad-primary)]";
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-foreground">
              {it.flag && <span>{it.flag}</span>}
              {it.label}
            </span>
            <span className="tnum font-semibold text-muted-foreground">{it.value}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${it.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${color}`}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
