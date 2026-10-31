import type { RiskLevel } from "@/lib/api/types";

/**
 * Exposure estimate (not proof of cloning). v1 heuristic, to be tuned:
 *   Low      < 30 s of matching voice
 *   Medium   30 s – 3 min
 *   High     ≥ 3 min
 *   Critical > 15 min AND at least 40% of it is high-confidence, clean audio
 *
 * The real worker computes this server-side; the mock uses the same rule so
 * the UI behaves consistently when sources are marked fixed.
 */
export function estimateRisk(
  segments: { matchedSeconds: number; confidence: number }[],
): RiskLevel {
  const total = segments.reduce((sum, s) => sum + s.matchedSeconds, 0);
  const clean = segments
    .filter((s) => s.confidence >= 0.9)
    .reduce((sum, s) => sum + s.matchedSeconds, 0);

  if (total < 30) return "low";
  if (total < 180) return "medium";
  if (total > 900 && clean / total >= 0.4) return "critical";
  return "high";
}

export const riskCopy: Record<RiskLevel, { label: string; summary: string }> = {
  low: {
    label: "Low",
    summary: "Less than 30 seconds of your voice is publicly reachable.",
  },
  medium: {
    label: "Medium",
    summary: "Enough public audio for a basic clone attempt.",
  },
  high: {
    label: "High",
    summary: "Several minutes of public audio, enough for a convincing clone.",
  },
  critical: {
    label: "Critical",
    summary: "A large amount of clean, high-quality audio is public.",
  },
};

export const RISK_TOOLTIP =
  "This is an exposure estimate based on how much of your voice is publicly reachable and how clean it is. It is not proof that your voice has been cloned.";
