/** Minimal SVG trend line. Values are drawn left (oldest) to right (newest). */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const w = 240;
  const h = 56;
  const pad = 6;
  const rawMax = Math.max(...values, 1);
  const rawMin = Math.min(...values);
  // Keep at least a 20% band so small changes stay visible but not exaggerated.
  const pad2 = Math.max((rawMax - rawMin) * 0.15, rawMax * 0.1);
  const max = rawMax + pad2;
  const min = Math.max(0, rawMin - pad2);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = values.length === 1 ? w / 2 : pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label} className="h-14 w-full">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2EE6C5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2EE6C5" stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 && (
        <path d={`${d} L${last[0]},${h} L${first[0]},${h} Z`} fill="url(#spark-fill)" />
      )}
      {points.length > 1 && <path d={d} fill="none" stroke="#2EE6C5" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
      {points.length === 1 && (
        <line x1={pad} x2={w - pad} y1={last[1]} y2={last[1]} stroke="#2EE6C5" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      )}
      
    </svg>
  );
}
