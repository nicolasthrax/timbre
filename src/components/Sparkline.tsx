/** Minimal SVG trend line in the accent colour. Values run oldest (left) to newest (right). */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const w = 240;
  const h = 56;
  const pad = 6;
  const rawMax = Math.max(...values, 1);
  const rawMin = Math.min(...values);
  // Keep a visible band so small changes show without being exaggerated.
  const band = Math.max((rawMax - rawMin) * 0.15, rawMax * 0.1);
  const max = rawMax + band;
  const min = Math.max(0, rawMin - band);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = values.length === 1 ? w / 2 : pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={label} className="h-14 w-full text-accent">
      {points.length > 1 && (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      )}
      {points.length === 1 && (
        <line x1={pad} x2={w - pad} y1={last[1]} y2={last[1]} stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}
