import { useT } from "@/i18n/I18nProvider";

interface Props {
  thresholds: Record<number, number>;
  predicted: number;
  studentGrade?: number;
}

export function ThresholdChart({ thresholds, predicted, studentGrade }: Props) {
  const t = useT();
  const entries = Object.entries(thresholds).map(([y, v]) => ({ y: Number(y), v })).sort((a, b) => a.y - b.y);
  const all = [...entries.map((e) => e.v), predicted, studentGrade ?? predicted];
  const min = Math.floor(Math.min(...all) - 0.5);
  const max = Math.ceil(Math.max(...all) + 0.5);
  const W = 600, H = 220, P = 30;

  const x = (i: number) => P + (i / (entries.length)) * (W - 2 * P);
  const y = (v: number) => H - P - ((v - min) / (max - min)) * (H - 2 * P);

  const points = entries.map((e, i) => `${x(i)},${y(e.v)}`).join(" ");
  const lastX = x(entries.length);
  const predX = x(entries.length);
  const predY = y(predicted);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full">
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line key={p} x1={P} x2={W - P} y1={P + p * (H - 2 * P)} y2={P + p * (H - 2 * P)} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
      ))}
      {/* area under line */}
      <defs>
        <linearGradient id="thArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${P},${H - P} ${points} ${lastX - (W - 2 * P) / entries.length},${H - P}`}
        fill="url(#thArea)"
      />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* student grade line */}
      {studentGrade != null && (
        <>
          <line x1={P} x2={W - P} y1={y(studentGrade)} y2={y(studentGrade)} stroke="var(--foreground)" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} />
          <text x={W - P} y={y(studentGrade) - 4} textAnchor="end" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>
            {t("detail.youGrade", { note: studentGrade.toFixed(2) })}
          </text>
        </>
      )}

      {/* points */}
      {entries.map((e, i) => (
        <g key={e.y}>
          <circle cx={x(i)} cy={y(e.v)} r={4} fill="var(--primary)" />
          <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>
            {e.y}
          </text>
          <text x={x(i)} y={y(e.v) - 10} textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>
            {e.v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* prediction */}
      <line x1={lastX - 12} x2={predX + 12} y1={predY} y2={predY} stroke="var(--info)" strokeWidth={3} strokeDasharray="4 3" />
      <circle cx={predX} cy={predY} r={5} fill="var(--info)" stroke="var(--background)" strokeWidth={2} />
      <text x={predX} y={H - 10} textAnchor="middle" className="fill-info" style={{ fontSize: 10, fontWeight: 700 }}>
        2027*
      </text>
      <text x={predX} y={predY - 10} textAnchor="middle" className="fill-info" style={{ fontSize: 10, fontWeight: 700 }}>
        {predicted.toFixed(1)}
      </text>
    </svg>
  );
}
