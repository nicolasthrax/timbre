import type { Platform } from "@/lib/api/types";

export const PLATFORMS: Platform[] = ["instagram", "tiktok", "youtube"];

export const platformLabel: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

/** Handle rules (simplified from each platform's public rules). */
export const handlePattern: Record<Platform, RegExp> = {
  instagram: /^[A-Za-z0-9._]{1,30}$/,
  tiktok: /^[A-Za-z0-9._]{2,24}$/,
  youtube: /^[A-Za-z0-9._-]{3,30}$/,
};

export const handleHint: Record<Platform, string> = {
  instagram: "Letters, numbers, dots and underscores. Up to 30 characters.",
  tiktok: "Letters, numbers, dots and underscores. 2–24 characters.",
  youtube: "Your @handle. Letters, numbers, dots, dashes, underscores. 3–30 characters.",
};

export function normaliseHandle(raw: string): string {
  return raw.trim().replace(/^@/, "");
}
