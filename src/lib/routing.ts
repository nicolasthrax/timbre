import { api, type User } from "@/lib/api";

/** Where a signed-in user should land, based on how far they got. */
export async function resolveHome(user: User): Promise<string> {
  if (!user.consentAt) return "/onboarding/consent";
  const [voiceprint, accounts, scans] = await Promise.all([
    api.getVoiceprint(),
    api.getAccounts(),
    api.listScans(),
  ]);
  if (!voiceprint) return "/onboarding/enrol";
  if (accounts.length === 0 && !user.fullName) return "/onboarding/accounts";
  const latest = scans[0];
  if (!latest) return "/onboarding/accounts";
  if (!latest.finishedAt) return `/scan/${latest.id}`;
  return "/dashboard";
}
