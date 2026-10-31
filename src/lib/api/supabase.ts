import type { TimbreApi } from "./client";

const notImplemented = (method: string): never => {
  throw new Error(`SupabaseTimbreApi.${method} is not implemented yet.`);
};

/**
 * TODO(real): implement against Supabase (Auth + Postgres with RLS) and the
 * Next.js API routes that enqueue jobs for the Python worker on Modal.
 * See BUILD_REPORT.md → "Swap guide" for the method-by-method mapping.
 *
 * Every method must keep the TimbreApi contract. Most importantly, source
 * details are redacted on the server for non-Pro users.
 */
export class SupabaseTimbreApi implements TimbreApi {
  signIn(): never { return notImplemented("signIn"); }
  signOut(): never { return notImplemented("signOut"); }
  getMe(): never { return notImplemented("getMe"); }
  recordConsent(): never { return notImplemented("recordConsent"); }
  enrolVoice(): never { return notImplemented("enrolVoice"); }
  getVoiceprint(): never { return notImplemented("getVoiceprint"); }
  setAccounts(): never { return notImplemented("setAccounts"); }
  getAccounts(): never { return notImplemented("getAccounts"); }
  startScan(): never { return notImplemented("startScan"); }
  getScan(): never { return notImplemented("getScan"); }
  listScans(): never { return notImplemented("listScans"); }
  listSources(): never { return notImplemented("listSources"); }
  getSource(): never { return notImplemented("getSource"); }
  updateSourceStatus(): never { return notImplemented("updateSourceStatus"); }
  upgrade(): never { return notImplemented("upgrade"); }
  setMonitoring(): never { return notImplemented("setMonitoring"); }
  setEmailAlerts(): never { return notImplemented("setEmailAlerts"); }
  requestCloneTest(): never { return notImplemented("requestCloneTest"); }
  exportData(): never { return notImplemented("exportData"); }
  deleteAllData(): never { return notImplemented("deleteAllData"); }
}
