import { useT } from "@/i18n/I18nProvider";
import type { AiProfile } from "@/lib/aiSimulator";

interface Props {
  axes: AiProfile["axes"];
  size?: number;
}

const ORDER: Array<{ key: keyof AiProfile["axes"]; tKey: string }> = [
  { key: "science", tKey: "axis.science" },
  { key: "logic", tKey: "axis.logic" },
  { key: "creativity", tKey: "axis.creativity" },
  { key: "social", tKey: "axis.social" },
  { key: "endurance", tKey: "axis.endurance" },
  { key: "lang", tKey: "axis.lang" },
];

export function RadarChart({ axes, size = 280 }: Props) {
  const t = useT();
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;
  const n = ORDER.length;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const point = (i: number, v: number) => {
    const a = angle(i);
    const rad = (v / 100) * r;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  };

  const polygon = ORDER.map(({ key }, i) => point(i, axes[key])).map(([x, y]) => `${x},${y}`).join(" ");
  const rings = [25, 50, 75, 100];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" role="img" aria-label="Radar profil">
      {rings.map((p) => (
        <polygon
          key={p}
          points={ORDER.map((_, i) => {
            const [x, y] = point(i, p);
            return `${x},${y}`;
          }).join(" ")}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}
      {ORDER.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} />;
      })}
      <polygon
        points={polygon}
        fill="var(--primary)"
        fillOpacity={0.25}
        stroke="var(--primary)"
        strokeWidth={2}
      />
      {ORDER.map(({ key }, i) => {
        const [x, y] = point(i, axes[key]);
        return <circle key={key} cx={x} cy={y} r={3.5} fill="var(--primary)" />;
      })}
      {ORDER.map(({ key, tKey }, i) => {
        const [x, y] = point(i, 115);
        return (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            {t(tKey)}
          </text>
        );
      })}
    </svg>
  );
}
