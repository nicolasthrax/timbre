"use client";

import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/Badge";
import { Banner } from "@/components/Banner";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useSession } from "@/components/SessionProvider";
import { Switch } from "@/components/Switch";
import { PRICES } from "@/content/pricing";
import { api, type User } from "@/lib/api";
import { formatDate } from "@/lib/format";

function Row({
  title,
  description,
  titleId,
  descriptionId,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  titleId?: string;
  descriptionId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p id={titleId} className="text-sm font-medium">
          {title}
        </p>
        {description && (
          <p id={descriptionId} className="mt-0.5 text-sm text-muted">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function planLabel(user: User): string {
  if (user.plan === "free") return "Free";
  const interval = user.billingInterval ?? "month";
  const price = `${PRICES[interval].label}${PRICES[interval].per}`;
  return user.plan === "pro" ? `Pro, ${price}` : `Pro (lapsed), ${price}`;
}

export function SettingsView() {
  const router = useRouter();
  const { me, setMe, openPaywall } = useSession();
  const [billingNote, setBillingNote] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!me) return null;
  const user = me;

  async function toggle(kind: "monitoring" | "alerts", next: boolean) {
    setError(null);
    try {
      setMe(kind === "monitoring" ? await api.setMonitoring(next) : await api.setEmailAlerts(next));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save that setting.");
    }
  }

  async function exportData() {
    const data = await api.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timbre-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    try {
      await api.deleteAllData();
      // Leaving the (app) group unmounts the session, so no user state survives.
      router.push("/?deleted=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete your data.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      {error && <Banner tone="warn" title="Something went wrong">{error}</Banner>}

      <Card>
        <h2 className="mb-4 font-semibold">Account</h2>
        <div className="divide-y divide-border">
          <Row title="Email" description={<span className="break-all tabular-nums text-xs">{user.email}</span>}>
            <span className="text-xs text-muted">Member since {formatDate(user.createdAt)}</span>
          </Row>
          <Row
            title="Plan"
            description={
              user.plan === "lapsed"
                ? "Payment failed. Your data is kept for 30 days."
                : user.plan === "pro"
                  ? "Renews automatically. Cancel anytime."
                  : "1 scan included. Source details are hidden."
            }
          >
            <div className="flex items-center gap-3">
              <Badge tone={user.plan === "pro" ? "accent" : user.plan === "lapsed" ? "warn" : "neutral"}>{planLabel(user)}</Badge>
              {user.plan === "pro" ? (
                <Button variant="secondary" size="sm" onClick={() => setBillingNote(true)}>
                  Manage billing
                </Button>
              ) : (
                <Button size="sm" onClick={openPaywall}>
                  {user.plan === "lapsed" ? "Renew" : "Upgrade"}
                </Button>
              )}
            </div>
          </Row>
        </div>
        {billingNote && (
          <p role="status" className="mt-4 rounded-field border border-border bg-surface-2 p-3 text-sm text-muted">
            Preview build: the billing portal is simulated. {/* TODO(real): open Stripe Customer Portal. */}
            In the live app this opens Stripe&apos;s secure billing page.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Monitoring</h2>
        <div className="divide-y divide-border">
          <Row
            title="Weekly scans"
            titleId="monitoring-label"
            descriptionId="monitoring-desc"
            description={user.plan === "pro" ? "Re-scan your accounts and the web every week." : "Available on Pro."}
          >
            <Switch
              id="monitoring"
              checked={user.monitoring}
              disabled={user.plan !== "pro"}
              onChange={(next) => toggle("monitoring", next)}
              labelledBy="monitoring-label"
              describedBy="monitoring-desc"
            />
          </Row>
          <Row
            title="Email alerts"
            titleId="alerts-label"
            descriptionId="alerts-desc"
            description="Only when we find new voice exposure, plus a monthly summary. No spam."
          >
            <Switch
              id="alerts"
              checked={user.emailAlerts}
              onChange={(next) => toggle("alerts", next)}
              labelledBy="alerts-label"
              describedBy="alerts-desc"
            />
          </Row>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">Your data</h2>
        <div className="divide-y divide-border">
          <Row title="Export my data" description="Download everything we hold about you as a JSON file.">
            <Button variant="secondary" size="sm" onClick={exportData}>
              <Download aria-hidden className="size-4" />
              Export
            </Button>
          </Row>
          <Row
            title="Delete my data"
            description="Permanently delete your voiceprint, linked accounts, scans and account. This can't be undone."
          >
            {!showDelete && (
              <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}>
                <Trash2 aria-hidden className="size-4" />
                Delete…
              </Button>
            )}
          </Row>
        </div>
        {showDelete && (
          <form onSubmit={deleteAll} className="mt-4 rounded-field border border-danger/40 bg-danger/5 p-4">
            <label htmlFor="confirm-delete" className="text-sm">
              Type <span className="tabular-nums font-semibold text-text">DELETE</span> to confirm.
            </label>
            <input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="mt-2 h-11 w-full rounded-field border border-field bg-surface px-3 tabular-nums text-text focus:border-danger focus:outline-none"
            />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button type="submit" variant="danger" disabled={confirmText !== "DELETE" || deleting}>
                <Trash2 aria-hidden className="size-4" />
                {deleting ? "Deleting…" : "Permanently delete everything"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDelete(false);
                  setConfirmText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
