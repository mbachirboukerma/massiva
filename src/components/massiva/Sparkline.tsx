import { trendDirection } from "@/lib/probability";

export function Sparkline({ thresholds }: { thresholds: Record<number, number> }) {
  const years = Object.keys(thresholds).map(Number).sort((a, b) => a - b);
  const values = years.map((y) => thresholds[y]);
  const min = Math.min(...values) - 0.2;
  const max = Math.max(...values) + 0.2;
  const range = Math.max(max - min, 0.5);
  const dir = trendDirection(thresholds);
  const stroke =
    dir === "up" ? "var(--info)" : dir === "down" ? "var(--destructive)" : "var(--muted-foreground)";

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-8 w-20"
      aria-label={`Tendance ${dir === "up" ? "haussière" : dir === "down" ? "baissière" : "stable"}`}
    >
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
