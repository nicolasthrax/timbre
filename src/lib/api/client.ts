import type {
  AccountsInput,
  BillingInterval,
  CloneTestResult,
  ConsentRecord,
  DataExport,
  LinkedAccount,
  Scan,
  ScanType,
  SignInMethod,
  Source,
  SourceFilter,
  SourceStatus,
  User,
  Voiceprint,
} from "./types";

/**
 * The only contract UI code depends on. Implementations:
 *   - mock.ts      (default, localStorage-backed, used for v0)
 *   - supabase.ts  (TODO(real): Supabase + Python worker)
 *
 * Rules every implementation must follow:
 *   - Redaction of source details for non-Pro users happens HERE,
 *     never in UI components.
 *   - Raw audio blobs passed in are never persisted.
 */
export interface TimbreApi {
  signIn(method: SignInMethod): Promise<User>;
  signOut(): Promise<void>;
  /** The signed-in user, or `null` when signed out. */
  getMe(): Promise<User | null>;

  recordConsent(version: string): Promise<ConsentRecord>;
  /** Creates a voiceprint. The blob is processed then discarded. */
  enrolVoice(audio: Blob): Promise<Voiceprint>;
  getVoiceprint(): Promise<Voiceprint | null>;

  setAccounts(input: AccountsInput): Promise<LinkedAccount[]>;
  getAccounts(): Promise<LinkedAccount[]>;

  startScan(type?: ScanType): Promise<Scan>;
  getScan(id: string): Promise<Scan>;
  /** All scans for the user, newest first. */
  listScans(): Promise<Scan[]>;

  listSources(filter?: SourceFilter): Promise<Source[]>;
  getSource(id: string): Promise<Source>;
  updateSourceStatus(id: string, status: SourceStatus): Promise<Source>;

  upgrade(interval: BillingInterval): Promise<User>;
  setMonitoring(enabled: boolean): Promise<User>;
  setEmailAlerts(enabled: boolean): Promise<User>;

  /** Pro only. `liveSample` re-verifies identity and is discarded after use. */
  requestCloneTest(liveSample: Blob): Promise<CloneTestResult>;

  exportData(): Promise<DataExport>;
  deleteAllData(): Promise<void>;
}
