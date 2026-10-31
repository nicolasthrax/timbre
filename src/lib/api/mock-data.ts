import { createRng, hashString } from "@/lib/random";
import type { Platform, PostedBy, Scan, ScanIssue, Source } from "./types";

/** Mock scenarios, switchable via `?scenario=` or /dev/states. */
export type Scenario = "high" | "none" | "partial" | "lapsed";
export const SCENARIOS: Scenario[] = ["high", "none", "partial", "lapsed"];

export function isScenario(value: unknown): value is Scenario {
  return typeof value === "string" && (SCENARIOS as string[]).includes(value);
}

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";

function randomId(rng: () => number, length: number, alphabet = BASE62): string {
  let out = "";
  for (let i = 0; i < length; i++) out += alphabet[Math.floor(rng() * alphabet.length)];
  return out;
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

const TITLES: Record<Platform, readonly string[]> = {
  instagram: [
    "Sunday hike to Lion Rock — full vlog",
    "Trying every egg tart on Lyndhurst Terrace",
    "Q&A: my first year after graduating",
    "Late night ramen review in Mong Kok",
    "Packing for Taipei with me",
    "Get ready with me: graduation day",
  ],
  tiktok: [
    "storytime: the worst flatmate ever",
    "rating Hong Kong milk tea (honestly)",
    "POV: your mum calls during the MTR rush",
    "day in my life as a junior designer",
    "ranking cha chaan teng breakfasts",
  ],
  youtube: [
    "My study routine for finals (realistic)",
    "Hong Kong to Tokyo on a budget — travel vlog",
    "Podcast ep. 12: growing up between two cities",
    "How I edit my videos — full walkthrough",
  ],
};

const OTHER_HANDLES = [
  "mandy.wkl",
  "chris_eats_hk",
  "hkfoodiecrew",
  "jaycheung.films",
  "ust.society",
  "weekend.with.ivy",
];

interface ScenarioShape {
  totalSeconds: number;
  platforms: Platform[];
  postedBy: PostedBy[];
  /** Index of sources that get a high (≥0.9) confidence. */
  cleanIndexes: number[];
  candidates: number;
  issues: (handles: Partial<Record<Platform, string>>) => ScanIssue[];
}

const SHAPES: Record<Scenario, ScenarioShape> = {
  high: {
    totalSeconds: 47 * 60,
    platforms: [
      "instagram", "youtube", "tiktok", "instagram", "youtube", "tiktok",
      "instagram", "tiktok", "instagram", "youtube", "instagram", "tiktok",
    ],
    postedBy: [
      "self", "self", "self", "other", "self", "self",
      "self", "other", "unknown", "self", "other", "self",
    ],
    cleanIndexes: [1],
    candidates: 50,
    issues: () => [],
  },
  lapsed: {
    totalSeconds: 47 * 60,
    platforms: [
      "instagram", "youtube", "tiktok", "instagram", "youtube", "tiktok",
      "instagram", "tiktok", "instagram", "youtube", "instagram", "tiktok",
    ],
    postedBy: [
      "self", "self", "self", "other", "self", "self",
      "self", "other", "unknown", "self", "other", "self",
    ],
    cleanIndexes: [1],
    candidates: 50,
    issues: () => [],
  },
  partial: {
    totalSeconds: 11 * 60 + 24,
    platforms: ["youtube", "youtube", "instagram", "youtube", "instagram"],
    postedBy: ["self", "self", "other", "self", "unknown"],
    cleanIndexes: [],
    candidates: 31,
    issues: (handles) => [
      { platform: "tiktok", kind: "unreachable", handle: handles.tiktok ?? null },
      { platform: "instagram", kind: "private", handle: handles.instagram ?? null },
    ],
  },
  none: {
    totalSeconds: 0,
    platforms: [],
    postedBy: [],
    cleanIndexes: [],
    candidates: 18,
    issues: () => [],
  },
};

function splitSeconds(rng: () => number, total: number, parts: number): number[] {
  if (parts === 0) return [];
  const weights = Array.from({ length: parts }, () => 0.25 + rng() * rng() * 3);
  const sum = weights.reduce((a, b) => a + b, 0);
  const values = weights.map((w) => Math.max(8, Math.round((w / sum) * total)));
  const drift = total - values.reduce((a, b) => a + b, 0);
  const largest = values.indexOf(Math.max(...values));
  values[largest] += drift;
  return values;
}

function buildUrl(rng: () => number, platform: Platform, author: string): string {
  switch (platform) {
    case "youtube":
      return `https://www.youtube.com/watch?v=${randomId(rng, 11)}`;
    case "instagram":
      return `https://www.instagram.com/reel/${randomId(rng, 11, BASE62.slice(0, 62))}/`;
    case "tiktok":
      return `https://www.tiktok.com/@${author}/video/7${randomId(rng, 18, "0123456789")}`;
  }
}

export interface GenerateInput {
  userId: string;
  scanId: string;
  scenario: Scenario;
  handles: Partial<Record<Platform, string>>;
  /** 0 for the first scan; each later scan surfaces one extra repost. */
  scanIndex: number;
  now: Date;
}

export interface GeneratedScan {
  candidates: number;
  issues: ScanIssue[];
  sources: Source[];
}

/** Deterministic, realistic-looking results for a given user + scenario. */
export function generateScanResults(input: GenerateInput): GeneratedScan {
  const shape = SHAPES[input.scenario];
  const rng = createRng(hashString(`${input.userId}:${input.scenario}`));
  const seconds = splitSeconds(rng, shape.totalSeconds, shape.platforms.length);
  const firstSeenAt = input.now.toISOString();

  const make = (
    index: number,
    platform: Platform,
    postedBy: PostedBy,
    matchedSeconds: number,
    clean: boolean,
    scanId: string,
  ): Source => {
    const ownHandle = input.handles[platform] ?? "you";
    const author = postedBy === "self" ? ownHandle : pick(rng, OTHER_HANDLES);
    const daysAgo = Math.floor(20 + rng() * 1000);
    return {
      id: `src_${hashString(`${input.userId}:${input.scenario}:${index}`).toString(36)}`,
      scanId,
      userId: input.userId,
      platform,
      url: buildUrl(rng, platform, author),
      title: pick(rng, TITLES[platform]),
      thumbnail: `/thumbnails/thumb-${(index % 6) + 1}.svg`,
      author: `@${author}`,
      postedBy,
      postedAt: new Date(input.now.getTime() - daysAgo * 86_400_000).toISOString(),
      matchedSeconds,
      confidence: clean ? 0.9 + rng() * 0.07 : 0.7 + rng() * 0.18,
      firstSeenAt,
      status: "open",
    };
  };

  const sources = shape.platforms.map((platform, i) =>
    make(i, platform, shape.postedBy[i], seconds[i], shape.cleanIndexes.includes(i), input.scanId),
  );

  // Later scans (monitoring / re-scan) surface one new repost each.
  if (input.scenario !== "none") {
    for (let n = 1; n <= input.scanIndex; n++) {
      sources.push(make(100 + n, "tiktok", "other", 30 + Math.round(rng() * 60), false, input.scanId));
    }
  }

  return { candidates: shape.candidates, issues: shape.issues(input.handles), sources };
}

export function emptyPlatformCounts(): Scan["sourceCountByPlatform"] {
  return { instagram: 0, tiktok: 0, youtube: 0 };
}
