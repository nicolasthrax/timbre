/** Minimal SVG trend line. Values are drawn left (oldest) to right (newest). */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const w = 240;
  const h = 56;
  const pad = 6;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = values.length === 1 ? w / 2 : pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="h-14 w-full">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2EE6C5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2EE6C5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 && (
        <path d={`${d} L${last[0]},${h} L${points[0][0]},${h} Z`} fill="url(#spark-fill)" />
      )}
      {points.length > 1 && <path d={d} fill="none" stroke="#2EE6C5" strokeWidth="2" strokeLinejoin="round" />}
      {last && <circle cx={last[0]} cy={last[1]} r="3.5" fill="#2EE6C5" />}
    </svg>
  );
}
