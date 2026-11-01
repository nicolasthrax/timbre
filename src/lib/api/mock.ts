import { hashString } from "@/lib/random";
import { estimateRisk } from "@/lib/risk";
import type { TimbreApi } from "./client";
import {
  emptyPlatformCounts,
  generateScanResults,
  isScenario,
  type Scenario,
} from "./mock-data";
import {
  ApiError,
  type AccountsInput,
  type CloneTestResult,
  type ConsentRecord,
  type DataExport,
  type LinkedAccount,
  type Platform,
  type Scan,
  type ScanIssue,
  type ScanType,
  type SignInMethod,
  type Source,
  type SourceFilter,
  type SourceStatus,
  type User,
  type Voiceprint,
} from "./types";

const STORAGE_KEY = "timbre:mock:v1";
const SCAN_DURATION_MS = 10_000;
/** Manual scans are limited to one per user per day (.plans/01-prd.md F4). */
const SCAN_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const CLONE_SENTENCE =
  "Every voice has a timbre, a colour that makes it yours and no one else's.";

interface StoredScan {
  id: string;
  userId: string;
  type: ScanType;
  startedAt: string;
  durationMs: number;
  finishedAt: string | null;
  candidatesCount: number;
  issues: ScanIssue[];
  /** Snapshot taken when the scan finished. */
  matchedSeconds: number;
  sourceCount: number;
  sourceCountByPlatform: Record<Platform, number>;
}

interface MockStore {
  version: 1;
  signedIn: boolean;
  scenario: Scenario;
  user: User | null;
  consent: ConsentRecord | null;
  voiceprint: Voiceprint | null;
  accounts: LinkedAccount[];
  scans: StoredScan[];
  sources: Source[];
}

function emptyStore(scenario: Scenario = "high"): MockStore {
  return {
    version: 1,
    signedIn: false,
    scenario,
    user: null,
    consent: null,
    voiceprint: null,
    accounts: [],
    scans: [],
    sources: [],
  };
}

let memoryFallback: MockStore | null = null;

function load(): MockStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockStore;
      if (parsed.version === 1) return parsed;
    }
  } catch {
    // Storage blocked (private mode, SSR, quota). Use memory.
  }
  return memoryFallback ?? emptyStore();
}

function save(store: MockStore): void {
  memoryFallback = store;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Keep the in-memory copy only.
  }
}

function latency(): Promise<void> {
  const ms = 300 + Math.random() * 600;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function requireUser(store: MockStore): User {
  if (!store.signedIn || !store.user) {
    throw new ApiError("unauthenticated", "Please sign in to continue.");
  }
  return store.user;
}

function countByPlatform(sources: Source[]): Record<Platform, number> {
  const counts = emptyPlatformCounts();
  for (const s of sources) counts[s.platform] += 1;
  return counts;
}

function handlesOf(accounts: LinkedAccount[]): Partial<Record<Platform, string>> {
  const out: Partial<Record<Platform, string>> = {};
  for (const a of accounts) out[a.platform] = a.handle;
  return out;
}

export class MockTimbreApi implements TimbreApi {
  // ── internal helpers ──────────────────────────────────────────────

  /** Completes scans whose (mock) processing time has elapsed. */
  private settle(store: MockStore, now = Date.now()): boolean {
    let changed = false;
    store.scans.forEach((scan, index) => {
      if (scan.finishedAt) return;
      const started = new Date(scan.startedAt).getTime();
      if (now < started + scan.durationMs) return;

      const finishedAt = new Date(started + scan.durationMs);
      const scanIndex = store.scans.length - 1 - index;
      const generated = generateScanResults({
        userId: scan.userId,
        scanId: scan.id,
        scenario: store.scenario,
        handles: handlesOf(store.accounts),
        scanIndex,
        now: finishedAt,
      });
      // Merge: keep status/first-seen for sources we already know about.
      const known = new Map(store.sources.map((s) => [s.id, s]));
      const merged = generated.sources.map((s) => {
        const existing = known.get(s.id);
        return existing ? { ...s, scanId: existing.scanId, status: existing.status, firstSeenAt: existing.firstSeenAt } : s;
      });
      store.sources = merged;
      scan.finishedAt = finishedAt.toISOString();
      scan.candidatesCount = generated.candidates;
      scan.issues = generated.issues;
      const exposed = merged.filter((s) => s.status !== "fixed");
      scan.matchedSeconds = exposed.reduce((sum, s) => sum + s.matchedSeconds, 0);
      scan.sourceCount = merged.length;
      scan.sourceCountByPlatform = countByPlatform(merged);
      changed = true;
    });
    return changed;
  }

  private view(store: MockStore, scan: StoredScan, now = Date.now()): Scan {
    const base = {
      id: scan.id,
      userId: scan.userId,
      type: scan.type,
      startedAt: scan.startedAt,
      candidatesCount: scan.candidatesCount,
    };
    if (!scan.finishedAt) {
      const fraction = Math.min(1, (now - new Date(scan.startedAt).getTime()) / scan.durationMs);
      const status = fraction < 0.55 ? "collecting" : fraction < 0.85 ? "matching" : "scoring";
      return {
        ...base,
        status,
        candidatesProcessed:
          status === "collecting"
            ? Math.min(scan.candidatesCount, Math.floor((fraction / 0.55) * scan.candidatesCount))
            : scan.candidatesCount,
        matchedSeconds: 0,
        riskLevel: null,
        sourceCount: 0,
        sourceCountByPlatform: emptyPlatformCounts(),
        issues: [],
        finishedAt: null,
      };
    }

    const isLatest = store.scans[0]?.id === scan.id;
    // The latest scan reflects sources marked fixed since; older scans are snapshots.
    const segments = isLatest
      ? store.sources.filter((s) => s.status !== "fixed")
      : [{ matchedSeconds: scan.matchedSeconds, confidence: 0.8 }];
    const matchedSeconds = segments.reduce((sum, s) => sum + s.matchedSeconds, 0);
    return {
      ...base,
      status: scan.issues.length > 0 ? "partial" : "complete",
      candidatesProcessed: scan.candidatesCount,
      matchedSeconds,
      riskLevel: estimateRisk(segments),
      sourceCount: scan.sourceCount,
      sourceCountByPlatform: scan.sourceCountByPlatform,
      issues: scan.issues,
      finishedAt: scan.finishedAt,
    };
  }

  private mutate<T>(fn: (store: MockStore) => T): T {
    const store = load();
    const result = fn(store);
    save(store);
    return result;
  }

  // ── TimbreApi ─────────────────────────────────────────────────────

  async signIn(method: SignInMethod): Promise<User> {
    await latency();
    // TODO(real): Supabase Auth, magic link (signInWithOtp) or Google OAuth.
    const email = method.kind === "email" ? method.email.trim().toLowerCase() : "kai.chan@gmail.com";
    return this.mutate((store) => {
      if (store.user && store.user.email === email) {
        store.signedIn = true;
        return store.user;
      }
      const fresh = emptyStore(store.scenario);
      Object.assign(store, fresh);
      store.signedIn = true;
      store.user = {
        id: `usr_${hashString(email).toString(36)}`,
        email,
        consentVersion: null,
        consentAt: null,
        fullName: null,
        monitoring: false,
        emailAlerts: true,
        createdAt: new Date().toISOString(),
      };
      return store.user;
    });
  }

  async signOut(): Promise<void> {
    await latency();
    this.mutate((store) => {
      store.signedIn = false;
    });
  }

  async getMe(): Promise<User | null> {
    await latency();
    const store = load();
    return store.signedIn && store.user ? { ...store.user } : null;
  }

  async recordConsent(version: string): Promise<ConsentRecord> {
    await latency();
    return this.mutate((store) => {
      const user = requireUser(store);
      const record = { version, at: new Date().toISOString() };
      store.consent = record;
      user.consentVersion = record.version;
      user.consentAt = record.at;
      return record;
    });
  }

  async enrolVoice(audio: Blob): Promise<Voiceprint> {
    await latency();
    // TODO(real): upload to POST /api/enrol → Python worker (Whisper liveness
    // check + ECAPA-TDNN embedding). The worker deletes raw audio immediately.
    if (audio.size === 0) throw new ApiError("invalid", "The recording was empty. Please try again.");
    return this.mutate((store) => {
      const user = requireUser(store);
      if (!user.consentAt) throw new ApiError("forbidden", "Consent is required before enrolment.");
      // The mock never reads or stores the audio itself.
      const voiceprint: Voiceprint = {
        id: id("vp"),
        userId: user.id,
        modelVersion: "ecapa-tdnn-mock-0.1",
        createdAt: new Date().toISOString(),
      };
      store.voiceprint = voiceprint;
      return voiceprint;
    });
  }

  async getVoiceprint(): Promise<Voiceprint | null> {
    await latency();
    const store = load();
    requireUser(store);
    return store.voiceprint;
  }

  async setAccounts(input: AccountsInput): Promise<LinkedAccount[]> {
    await latency();
    return this.mutate((store) => {
      const user = requireUser(store);
      if (input.accounts.length === 0 && !input.fullName) {
        throw new ApiError("invalid", "Add at least one account or your name.");
      }
      user.fullName = input.fullName;
      store.accounts = input.accounts.map((a) => ({
        id: id("acct"),
        userId: user.id,
        platform: a.platform,
        handle: a.handle,
      }));
      return store.accounts;
    });
  }

  async getAccounts(): Promise<LinkedAccount[]> {
    await latency();
    const store = load();
    requireUser(store);
    return store.accounts;
  }

  async startScan(type?: ScanType): Promise<Scan> {
    await latency();
    // TODO(real): POST /api/scans → enqueue job for the Python worker on Modal.
    return this.mutate((store) => {
      const user = requireUser(store);
      if (!store.voiceprint) throw new ApiError("invalid", "Record your voice before scanning.");
      const latest = store.scans[0];
      if (latest) {
        const waitMs = new Date(latest.startedAt).getTime() + SCAN_COOLDOWN_MS - Date.now();
        if (waitMs > 0) {
          const hours = Math.ceil(waitMs / 3_600_000);
          throw new ApiError("rate_limited", `You can run one scan a day. Try again in ${hours} hour${hours === 1 ? "" : "s"}.`);
        }
      }
      const scan: StoredScan = {
        id: id("scan"),
        userId: user.id,
        type: type ?? "manual",
        startedAt: new Date().toISOString(),
        durationMs: SCAN_DURATION_MS,
        finishedAt: null,
        candidatesCount: 50,
        issues: [],
        matchedSeconds: 0,
        sourceCount: 0,
        sourceCountByPlatform: emptyPlatformCounts(),
      };
      store.scans.unshift(scan);
      return this.view(store, scan);
    });
  }

  async getScan(scanId: string): Promise<Scan> {
    await latency();
    return this.mutate((store) => {
      requireUser(store);
      this.settle(store);
      const scan = store.scans.find((s) => s.id === scanId);
      if (!scan) throw new ApiError("not_found", "We couldn't find that scan.");
      return this.view(store, scan);
    });
  }

  async listScans(): Promise<Scan[]> {
    await latency();
    return this.mutate((store) => {
      requireUser(store);
      this.settle(store);
      return store.scans.map((s) => this.view(store, s));
    });
  }

  async listSources(filter: SourceFilter = {}): Promise<Source[]> {
    await latency();
    return this.mutate((store) => {
      requireUser(store);
      this.settle(store);
      return store.sources
        .filter((s) => !filter.platform || s.platform === filter.platform)
        .filter((s) => !filter.status || s.status === filter.status)
        .sort((a, b) => b.matchedSeconds - a.matchedSeconds)
        .map((s) => ({ ...s }));
    });
  }

  async getSource(sourceId: string): Promise<Source> {
    await latency();
    const store = load();
    requireUser(store);
    const source = store.sources.find((s) => s.id === sourceId);
    if (!source) throw new ApiError("not_found", "We couldn't find that source.");
    return { ...source };
  }

  async updateSourceStatus(sourceId: string, status: SourceStatus): Promise<Source> {
    await latency();
    return this.mutate((store) => {
      requireUser(store);
      const source = store.sources.find((s) => s.id === sourceId);
      if (!source) throw new ApiError("not_found", "We couldn't find that source.");
      // TODO(real): fixed items are re-verified on the next scan.
      source.status = status;
      return { ...source };
    });
  }

  async setMonitoring(enabled: boolean): Promise<User> {
    await latency();
    return this.mutate((store) => {
      const user = requireUser(store);
      user.monitoring = enabled;
      return { ...user };
    });
  }

  async setEmailAlerts(enabled: boolean): Promise<User> {
    await latency();
    return this.mutate((store) => {
      const user = requireUser(store);
      user.emailAlerts = enabled;
      return { ...user };
    });
  }

  async requestCloneTest(liveSample: Blob): Promise<CloneTestResult> {
    await latency();
    await latency();
    // TODO(real, stage 11 in .plans/pivot-review.md): POST /api/clone with a
    // server-issued challenge, rate limits, deletion after generation.
    const store = load();
    requireUser(store);
    if (liveSample.size === 0) throw new ApiError("invalid", "The recording was empty. Please try again.");
    return {
      id: id("clone"),
      sentence: CLONE_SENTENCE,
      realAudioUrl: "/audio/real.wav",
      cloneAudioUrl: "/audio/clone.wav",
      watermarked: true,
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    };
  }

  async exportData(): Promise<DataExport> {
    await latency();
    return this.mutate((store) => {
      const user = requireUser(store);
      this.settle(store);
      return {
        exportedAt: new Date().toISOString(),
        user: { ...user },
        consent: store.consent,
        voiceprint: store.voiceprint,
        linkedAccounts: store.accounts,
        scans: store.scans.map((s) => this.view(store, s)),
        sources: store.sources.map((s) => ({ ...s })),
        note: "Mock export. Raw audio is never stored, so none is included. Voiceprint embeddings are omitted from exports.",
      };
    });
  }

  async deleteAllData(): Promise<void> {
    await latency();
    // TODO(real): DELETE /api/me cascades voiceprints, accounts, scans, sources; audit-logged.
    const scenario = load().scenario;
    save(emptyStore(scenario));
  }

  // ── Dev-only helpers (not part of TimbreApi) ──────────────────────

  getScenario(): Scenario {
    return load().scenario;
  }

  setScenario(scenario: Scenario): void {
    this.mutate((store) => {
      store.scenario = scenario;
    });
  }

  /** Creates a signed-in account with a finished scan, skipping onboarding. */
  seedDemo(): void {
    const scenario = load().scenario;
    const fresh = emptyStore(scenario);
    const now = Date.now();
    const user: User = {
      id: "usr_demo",
      email: "kai.chan@example.com",
      consentVersion: "2026-10-v2",
      consentAt: new Date(now - 40 * 86_400_000).toISOString(),
      fullName: "Kai Chan",
      monitoring: false,
      emailAlerts: true,
      createdAt: new Date(now - 40 * 86_400_000).toISOString(),
    };
    fresh.signedIn = true;
    fresh.user = user;
    fresh.consent = { version: user.consentVersion ?? "", at: user.consentAt ?? "" };
    fresh.voiceprint = { id: "vp_demo", userId: user.id, modelVersion: "ecapa-tdnn-mock-0.1", createdAt: user.createdAt };
    fresh.accounts = [
      { id: "acct_ig", userId: user.id, platform: "instagram", handle: "kai.eats.hk" },
      { id: "acct_tt", userId: user.id, platform: "tiktok", handle: "kaichan" },
      { id: "acct_yt", userId: user.id, platform: "youtube", handle: "kaichanvlogs" },
    ];

    // A few weeks of earlier scans, so the trend line has data.
    const history = scenario === "none" ? 0 : 4;
    const totals = [3420, 3180, 3060, 2940];
    for (let i = history; i >= 0; i--) {
      const started = now - i * 7 * 86_400_000 - SCAN_DURATION_MS - 60_000;
      fresh.scans.unshift({
        id: i === 0 ? "scan_demo" : `scan_demo_${i}`,
        userId: user.id,
        type: i === history ? "manual" : "monitor",
        startedAt: new Date(started).toISOString(),
        durationMs: SCAN_DURATION_MS,
        finishedAt: i === 0 ? null : new Date(started + SCAN_DURATION_MS).toISOString(),
        candidatesCount: 50,
        issues: [],
        matchedSeconds: totals[4 - i] ?? 0,
        sourceCount: 11,
        sourceCountByPlatform: { instagram: 5, tiktok: 3, youtube: 3 },
      });
    }
    this.settle(fresh, now);
    save(fresh);
  }

  reset(): void {
    save(emptyStore(load().scenario));
  }
}

export { isScenario };
export type { Scenario };
