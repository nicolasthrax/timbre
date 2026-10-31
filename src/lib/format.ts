/** "47" for minute-scale totals, used next to a "min" unit. */
export function minutesNumber(seconds: number): string {
  if (seconds < 60) return (seconds / 60).toFixed(1);
  return Math.round(seconds / 60).toString();
}

/** Human duration: "38 sec", "4 min 12 sec", "47 min". */
export function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s} sec`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  if (m >= 10 || rest === 0) return `${Math.round(s / 60)} min`;
  return `${m} min ${rest} sec`;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

const dateFmt = new Intl.DateTimeFormat("en-HK", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Hong_Kong",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
