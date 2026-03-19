"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CreditCard, LoaderCircle } from "lucide-react";
import { useMockStore, useWorkspaceAccess } from "@/components/dashboard/mockStore";

function formatConnectedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function formatBillingDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatBillingState(value) {
  const raw = String(value || "inactive")
    .trim()
    .replace(/[_-]+/g, " ");
  if (!raw) return "Inactive";
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { error: text } : null;
  }

  if (!response.ok) {
    throw new Error(String(data?.error || data?.message || "Request failed"));
  }

  return data;
}

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const { isAdmin } = useWorkspaceAccess(workspaceId);
  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );

  const [name, setName] = useState(workspace?.name || "");
  const [githubStatus, setGithubStatus] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState("");
  const [githubDisconnecting, setGithubDisconnecting] = useState(false);
  const [billingStatus, setBillingStatus] = useState(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState("");
  const [billingPortalLoading, setBillingPortalLoading] = useState(false);

  useEffect(() => {
    setName(workspace?.name || "");
  }, [workspace?.name]);

  const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "";
  const connectUrl = useMemo(() => {
    if (!appSlug || !workspaceId) return "";
    return `https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(workspaceId)}`;
  }, [appSlug, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !isAdmin) return;
    let alive = true;

    async function loadBillingStatus() {
      try {
        setBillingLoading(true);
        setBillingError("");

        const data = await requestJson(
          `/api/billing/subscription?workspaceId=${encodeURIComponent(workspaceId)}`,
        );
        if (!alive) return;
        setBillingStatus(data);
      } catch (err) {
        if (!alive) return;
        setBillingStatus(null);
        setBillingError(String(err?.message || "Failed to load billing status."));
      } finally {
        if (alive) setBillingLoading(false);
      }
    }

    loadBillingStatus();
    return () => {
      alive = false;
    };
  }, [workspaceId, isAdmin]);

  useEffect(() => {
    if (!workspaceId || !isAdmin) return;
    let alive = true;

    async function loadGithubStatus() {
      try {
        setGithubLoading(true);
        setGithubError("");

        const res = await fetch(
          `/api/dashboard/github/status?workspaceId=${encodeURIComponent(workspaceId)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message = String(data?.error || data?.message || "").trim();
          throw new Error(message || "Failed to load GitHub status.");
        }

        if (!alive) return;
        setGithubStatus(data);
      } catch (err) {
        if (!alive) return;
        setGithubError(String(err?.message || "Failed to load GitHub status."));
      } finally {
        if (alive) setGithubLoading(false);
      }
    }

    loadGithubStatus();
    return () => {
      alive = false;
    };
  }, [workspaceId, isAdmin]);

  async function refreshGithubStatus() {
    if (!workspaceId || !isAdmin) return;
    try {
      setGithubLoading(true);
      setGithubError("");
      const res = await fetch(
        `/api/dashboard/github/status?workspaceId=${encodeURIComponent(workspaceId)}`,
        { cache: "no-store" },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = String(data?.error || data?.message || "").trim();
        throw new Error(message || "Failed to load GitHub status.");
      }
      setGithubStatus(data);
    } catch (err) {
      setGithubError(String(err?.message || "Failed to load GitHub status."));
    } finally {
      setGithubLoading(false);
    }
  }

  async function disconnectGithub() {
    if (!workspaceId || !isAdmin || githubDisconnecting) return;
    setGithubDisconnecting(true);
    setGithubError("");
    try {
      const res = await fetch("/api/dashboard/github/disconnect", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = String(data?.error || data?.message || "").trim();
        throw new Error(message || "Failed to disconnect GitHub.");
      }
      await refreshGithubStatus();
    } catch (err) {
      setGithubError(String(err?.message || "Failed to disconnect GitHub."));
    } finally {
      setGithubDisconnecting(false);
    }
  }

  async function refreshBillingStatus() {
    if (!workspaceId || !isAdmin) return;
    try {
      setBillingLoading(true);
      setBillingError("");
      const data = await requestJson(
        `/api/billing/subscription?workspaceId=${encodeURIComponent(workspaceId)}`,
      );
      setBillingStatus(data);
    } catch (err) {
      setBillingStatus(null);
      setBillingError(String(err?.message || "Failed to load billing status."));
    } finally {
      setBillingLoading(false);
    }
  }

  async function openBillingPortal() {
    if (!workspaceId || !isAdmin || billingPortalLoading) return;
    try {
      setBillingPortalLoading(true);
      setBillingError("");

      const data = await requestJson("/api/billing/portal-session", {
        method: "POST",
        body: JSON.stringify({ workspaceId }),
      });

      if (!data?.url) {
        throw new Error("Stripe Billing Portal URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setBillingError(String(err?.message || "Failed to open billing portal."));
    } finally {
      setBillingPortalLoading(false);
    }
  }

  const subscription = billingStatus?.subscription || null;
  const billingStatusTone = (() => {
    const normalized = String(subscription?.status || "").toLowerCase();
    if (["active", "trialing"].includes(normalized)) {
      return "border-success/25 bg-success/10 text-success";
    }
    if (["past_due", "unpaid", "incomplete"].includes(normalized)) {
      return "border-warning/25 bg-warning/10 text-warning";
    }
    return "border-border bg-muted/60 text-muted-foreground";
  })();

  if (!isAdmin) {
    return (
      <section className="space-y-4 rounded-2xl border border-warning/25 bg-warning/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warning">
          Workspace Settings
        </h2>
        <p className="text-sm text-warning">
          You do not have access to workspace settings.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 dark:border-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Workspace Settings
      </h2>

      {(() => {
        const githubParam = String(searchParams.get("github") || "");
        if (githubParam === "connected") {
          return (
            <div className="rounded-xl border border-success/25 bg-success/10 p-3 text-sm text-success">
              GitHub connected successfully.
            </div>
          );
        }
        if (githubParam === "cancelled") {
          return (
            <div className="rounded-xl border border-border bg-muted/50 p-3 text-sm text-foreground">
              GitHub connection was cancelled.
            </div>
          );
        }
        if (githubParam === "error") {
          return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive">
              GitHub connection failed. Please try again.
            </div>
          );
        }
        return null;
      })()}

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Workspace Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none dark:border-white/10 dark:bg-surface dark:text-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Rename is UI-only right now. Tell me and I will wire backend update endpoint.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-surface/40">
        <p>Workspace ID: {workspaceId}</p>
        <p>Members: {workspace?.members?.length || 0}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 dark:border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(79,70,229,0.14),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.14),transparent_28%)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Billing</p>
                <p className="text-xs text-muted-foreground">
                  Workspace-level Stripe subscription and billing management.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={refreshBillingStatus}
                disabled={billingLoading}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-surface"
              >
                {billingLoading ? "Refreshing..." : "Refresh"}
              </button>
              <Link
                href={`/pricing?workspaceId=${workspaceId}#pricing-cards`}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              >
                View Plans
              </Link>
              <button
                type="button"
                onClick={openBillingPortal}
                disabled={!subscription?.portalAvailable || billingPortalLoading}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-surface"
              >
                {billingPortalLoading ? "Opening..." : "Manage Billing"}
              </button>
            </div>
          </div>

          {billingLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading billing status...
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-semibold text-foreground">
                    {subscription?.planId
                      ? subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)
                      : "Free"}
                  </span>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${billingStatusTone}`}>
                    {formatBillingState(subscription?.status)}
                  </span>
                </div>

                <div className="grid gap-2 rounded-xl border border-border bg-muted/40 p-3 text-sm dark:border-white/10 dark:bg-surface/50">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Billing cycle</span>
                    <span className="font-medium text-foreground">
                      {subscription?.billingCycle ? formatBillingState(subscription.billingCycle) : "Not started"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">
                      {subscription?.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
                    </span>
                    <span className="font-medium text-foreground">
                      {formatBillingDate(subscription?.currentPeriodEnd) || "Not scheduled"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Access</span>
                    <span className="font-medium text-foreground">
                      {subscription?.hasAccess ? "Included" : "Restricted"}
                    </span>
                  </div>
                </div>

                {billingError ? (
                  <p className="text-sm text-destructive">{billingError}</p>
                ) : subscription?.portalAvailable ? (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Changes to cards, invoices, cancellations, and plan updates are handled inside Stripe Billing Portal.
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    This workspace does not have a Stripe customer yet. Pick a paid plan on the pricing page to start
                    billing.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-background/80 p-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-surface/60 lg:min-w-56">
                <p className="font-semibold uppercase tracking-wide text-foreground">Quick Actions</p>
                <p className="mt-2">
                  Use <span className="font-medium text-foreground">View Plans</span> to start or compare subscriptions.
                </p>
                <p className="mt-2">
                  Use <span className="font-medium text-foreground">Manage Billing</span> after checkout to update cards
                  or change plans.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-card dark:bg-white/10">
            <svg viewBox="0 0 24 24" fill="white" className="size-4">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              GitHub
            </p>
            <p className="text-xs text-muted-foreground">
              {githubLoading
                ? "Checking connection..."
                : githubStatus?.connected
                  ? "Connected · activity will appear on tasks"
                  : "Not connected"}
            </p>
            {!githubLoading && githubStatus?.connectedAt ? (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Connected at: {formatConnectedAt(githubStatus.connectedAt)}
              </p>
            ) : null}
            {!githubLoading && githubError ? (
              <p className="mt-1 text-[11px] text-destructive dark:text-destructive">
                {githubError}
              </p>
            ) : null}
          </div>
        </div>

        {githubStatus?.connected ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Connected
            </span>
            <button
              type="button"
              onClick={disconnectGithub}
              disabled={githubDisconnecting || githubLoading}
              className="cursor-pointer rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/100/15"
            >
              {githubDisconnecting ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
        ) : (
          <a
            href={connectUrl || "#"}
            aria-disabled={!connectUrl}
            onClick={(event) => {
              if (!connectUrl) event.preventDefault();
            }}
            className={[
              "cursor-pointer rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary dark:bg-primary dark:hover:bg-primary",
              !connectUrl ? "cursor-not-allowed opacity-50 pointer-events-none" : "",
            ].join(" ")}
            title={!appSlug ? "NEXT_PUBLIC_GITHUB_APP_SLUG is missing" : undefined}
          >
            Connect GitHub
          </a>
        )}
      </div>
    </section>
  );
}
