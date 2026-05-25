import type { Specialty } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

interface Props {
  items: Specialty[];
  size?: number;
}

const PALETTE = ["var(--primary)", "var(--success)", "var(--warning)"];

export function CompareRadar({ items, size = 320 }: Props) {
  const t = useT();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 50;

  const axes = [
    { key: "salary", label: t("compare.salary"), get: (s: Specialty) => Math.min(100, (s.estimatedSalary / 200) * 100) },
    { key: "stability", label: t("compare.stability"), get: (s: Specialty) => s.stability * 20 },
    { key: "intl", label: t("compare.intl"), get: (s: Specialty) => s.internationalOpportunity * 20 },
    { key: "access", label: t("compare.winner.access"), get: (s: Specialty) => Math.max(10, 100 - (s.predicted2027 - 10) * 10) },
    { key: "duration", label: t("compare.duration"), get: (s: Specialty) => Math.max(20, 100 - s.duration * 12) },
    { key: "low-comp", label: t("compare.competition"), get: (s: Specialty) => (6 - s.competition) * 20 },
  ];

  const n = axes.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, v: number, radius = r) => {
    const a = angle(i);
    const rad = (v / 100) * radius;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  };

  const rings = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-md">
        {rings.map((p) => (
          <polygon
            key={p}
            points={axes.map((_, i) => point(i, p).join(",")).join(" ")}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} />;
        })}
        {items.map((s, idx) => {
          const color = PALETTE[idx % PALETTE.length];
          const pts = axes.map((a, i) => point(i, a.get(s)).join(",")).join(" ");
          return (
            <g key={s.id}>
              <polygon points={pts} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />
              {axes.map((a, i) => {
                const [x, y] = point(i, a.get(s));
                return <circle key={i} cx={x} cy={y} r={3} fill={color} />;
              })}
            </g>
          );
        })}
        {axes.map((a, i) => {
          const [x, y] = point(i, 118, r);
          return (
            <text
              key={a.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10, fontWeight: 500 }}
            >
              {a.label}
            </text>
          );
        })}
      </svg>
      <ul className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {items.map((s, idx) => (
          <li key={s.id} className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: PALETTE[idx % PALETTE.length] }} />
            <span className="font-semibold text-foreground">{t(s.nameKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
