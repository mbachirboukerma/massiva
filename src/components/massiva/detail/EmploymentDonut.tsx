import { useT } from "@/i18n/I18nProvider";

interface Props {
  data: { employed: number; pursuing: number; searching: number };
}

export function EmploymentDonut({ data }: Props) {
  const t = useT();
  const total = data.employed + data.pursuing + data.searching;
  const segs = [
    { label: t("detail.employment.employed"), value: data.employed, color: "var(--success)" },
    { label: t("detail.employment.pursuing"), value: data.pursuing, color: "var(--info)" },
    { label: t("detail.employment.searching"), value: data.searching, color: "var(--warning)" },
  ];
  const C = 2 * Math.PI * 60;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" className="-rotate-90 shrink-0">
        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--muted)" strokeWidth="18" />
        {segs.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <circle key={i} cx="80" cy="80" r="60" fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += len;
          return el;
        })}
        <text x="80" y="78" textAnchor="middle" className="rotate-90 fill-foreground" transform="rotate(90 80 80)" style={{ fontSize: 22, fontWeight: 700 }}>
          {data.employed}%
        </text>
        <text x="80" y="98" textAnchor="middle" className="rotate-90 fill-muted-foreground" transform="rotate(90 80 80)" style={{ fontSize: 10 }}>
          {t("detail.employment.centerLabel")}
        </text>
      </svg>
      <ul className="space-y-2">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded" style={{ background: s.color }} />
            <span className="text-foreground">{s.label}</span>
            <span className="tnum ms-auto font-semibold text-muted-foreground">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
