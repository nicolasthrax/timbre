/**
 * Domain types. These mirror the future Supabase schema:
 *
 *   users(id, email, plan, consent_version, consent_at)
 *   voiceprints(id, user_id, model_version, created_at)
 *   linked_accounts(id, user_id, platform, handle)
 *   scans(id, user_id, type, status, candidates_count, matched_seconds,
 *         risk_level, started_at, finished_at)
 *   sources(id, scan_id, user_id, platform, url, title, thumbnail, posted_by,
 *           matched_seconds, confidence, first_seen_at, status)
 *
 * Fields are camelCase here; the real client maps snake_case rows to these.
 */

export type Platform = "instagram" | "tiktok" | "youtube";

/** `lapsed` = was Pro, payment failed. Data is kept 30 days, details re-redacted. */
export type Plan = "free" | "pro" | "lapsed";

export type BillingInterval = "month" | "year";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ScanType = "free" | "paid" | "monitor";

export type ScanStatus =
  | "collecting"
  | "matching"
  | "scoring"
  | "complete"
  | "partial"
  | "failed";

export type PostedBy = "self" | "other" | "unknown";

export type SourceStatus = "open" | "fixed" | "ignored";

export interface User {
  id: string;
  email: string;
  plan: Plan;
  consentVersion: string | null;
  consentAt: string | null;
  /** Full name used for web search of reposts/tags. */
  fullName: string | null;
  billingInterval: BillingInterval | null;
  /** Set when plan becomes `lapsed`; data is kept for 30 days after this. */
  lapsedAt: string | null;
  monitoring: boolean;
  emailAlerts: boolean;
  createdAt: string;
}

export interface ConsentRecord {
  version: string;
  at: string;
}

export interface Voiceprint {
  id: string;
  userId: string;
  modelVersion: string;
  createdAt: string;
}

export interface LinkedAccount {
  id: string;
  userId: string;
  platform: Platform;
  handle: string;
}

export type ScanIssueKind = "unreachable" | "private" | "blocked";

/** A non-fatal problem during a scan (partial failure / private account). */
export interface ScanIssue {
  platform: Platform;
  kind: ScanIssueKind;
  handle: string | null;
}

export interface Scan {
  id: string;
  userId: string;
  type: ScanType;
  status: ScanStatus;
  candidatesCount: number;
  /** Progress while collecting; equals candidatesCount when done. */
  candidatesProcessed: number;
  /** Seconds of matching voice across sources that are not marked fixed. */
  matchedSeconds: number;
  riskLevel: RiskLevel | null;
  sourceCount: number;
  sourceCountByPlatform: Record<Platform, number>;
  issues: ScanIssue[];
  startedAt: string;
  finishedAt: string | null;
}

/**
 * A public video containing the user's voice.
 * `url`, `title`, `thumbnail` and `author` are `null` when the caller's plan
 * does not include source details. This redaction happens in the API layer,
 * never in UI components.
 */
export interface Source {
  id: string;
  scanId: string;
  userId: string;
  platform: Platform;
  url: string | null;
  title: string | null;
  thumbnail: string | null;
  /** Handle of the account that posted it. Redacted like `url`. */
  author: string | null;
  postedBy: PostedBy;
  postedAt: string;
  matchedSeconds: number;
  /** 0–1 similarity confidence from the matcher. */
  confidence: number;
  firstSeenAt: string;
  status: SourceStatus;
}

export interface SourceFilter {
  platform?: Platform;
  status?: SourceStatus;
}

export interface AccountsInput {
  fullName: string | null;
  accounts: { platform: Platform; handle: string }[];
}

export interface CloneTestResult {
  id: string;
  sentence: string;
  realAudioUrl: string;
  cloneAudioUrl: string;
  watermarked: true;
  expiresAt: string;
}

export interface DataExport {
  exportedAt: string;
  user: User | null;
  consent: ConsentRecord | null;
  voiceprint: Voiceprint | null;
  linkedAccounts: LinkedAccount[];
  scans: Scan[];
  sources: Source[];
  note: string;
}

export type SignInMethod = { kind: "email"; email: string } | { kind: "google" };

export class ApiError extends Error {
  constructor(
    public readonly code:
      | "unauthenticated"
      | "forbidden"
      | "not_found"
      | "invalid"
      | "payment_failed",
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
