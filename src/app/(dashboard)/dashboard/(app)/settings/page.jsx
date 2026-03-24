"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

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
    const error = new Error(
      String(data?.error || data?.message || "Request failed"),
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function formatDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatStatus(value) {
  const raw = String(value || "inactive")
    .trim()
    .replace(/[_-]+/g, " ");
  if (!raw) return "Inactive";
  return raw.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusTone(status) {
  const normalized = String(status || "").toLowerCase();
  if (["active", "trialing"].includes(normalized)) {
    return "border-success/25 bg-success/10 text-success";
  }
  if (["past_due", "unpaid", "incomplete"].includes(normalized)) {
    return "border-warning/25 bg-warning/10 text-warning";
  }
  return "border-border bg-muted/60 text-muted-foreground";
}

function DashboardSettingsPageContent() {
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();

  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(
    sessionStatus === "loading",
  );
  const [subscriptionError, setSubscriptionError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const billingState = String(searchParams.get("billing") || "")
    .trim()
    .toLowerCase();

  useEffect(() => {
    if (sessionStatus === "loading") {
      setSubscriptionLoading(true);
      return;
    }

    if (sessionStatus !== "authenticated") {
      setSubscriptionData(null);
      setSubscriptionLoading(false);
      setSubscriptionError("");
      return;
    }

    let active = true;

    async function loadSubscription() {
      try {
        setSubscriptionLoading(true);
        setSubscriptionError("");

        const data = await requestJson("/api/billing/subscription");
        if (!active) return;
        setSubscriptionData(data);
      } catch (error) {
        if (!active) return;
        setSubscriptionData(null);
        setSubscriptionError(
          String(error?.message || "Failed to load billing details."),
        );
      } finally {
        if (active) setSubscriptionLoading(false);
      }
    }

    loadSubscription();
    return () => {
      active = false;
    };
  }, [refreshNonce, sessionStatus]);

  const owner = subscriptionData?.owner || null;
  const subscription = subscriptionData?.subscription || null;

  const accountLabel = useMemo(() => {
    const ownerName = String(owner?.billingContactName || "").trim();
    const sessionName = String(session?.user?.name || "").trim();
    return ownerName || sessionName || "Your Account";
  }, [owner?.billingContactName, session?.user?.name]);

  const accountEmail = useMemo(() => {
    const ownerEmail = String(owner?.billingEmail || "").trim();
    const sessionEmail = String(session?.user?.email || "").trim();
    return ownerEmail || sessionEmail || "";
  }, [owner?.billingEmail, session?.user?.email]);

  const billingNotice = useMemo(() => {
    if (billingState === "success") {
      return {
        tone: "success",
        title: "Subscription is live.",
        description:
          "Your account now has access to paid features and billing controls.",
      };
    }

    if (billingState === "cancelled") {
      return {
        tone: "warning",
        title: "Checkout was cancelled.",
        description: "No changes were made to your subscription.",
      };
    }

    return null;
  }, [billingState]);

  async function handleManageBilling() {
    if (sessionStatus !== "authenticated" || portalLoading) return;

    try {
      setPortalLoading(true);
      setSubscriptionError("");

      const data = await requestJson("/api/billing/portal-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!data?.url) {
        throw new Error("Stripe Billing Portal URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setSubscriptionError(
        String(error?.message || "Failed to open billing portal."),
      );
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative mt-6 overflow-hidden rounded-4xl border border-border bg-card/95 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.35)]">
        <div className="pointer-events-none absolute inset-0" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div>
                <h1 className="text-3xl font-heading font-semibold tracking-tight text-foreground sm:text-4xl">
                  Manage your billing info.
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Review your current plan, jump into Stripe Billing Portal, and
                  keep your subscription details in one dashboard view.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/85 px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Billing Account
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {accountLabel}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {accountEmail || "Signed in account"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {billingNotice ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                billingNotice.tone === "success"
                  ? "border-success/25 bg-success/10 text-success"
                  : "border-warning/25 bg-warning/10 text-warning"
              }`}
            >
              <div className="flex items-start gap-3">
                {billingNotice.tone === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">{billingNotice.title}</p>
                  <p className="mt-1 text-current/90">
                    {billingNotice.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {subscriptionError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {subscriptionError}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_18px_48px_-40px_rgba(15,23,42,0.45)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Current Subscription
              </p>
              <h2 className="mt-2 text-2xl font-heading font-semibold text-foreground">
                {subscription?.planId
                  ? formatStatus(subscription.planId)
                  : "Free"}
              </h2>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </span>
          </div>

          {sessionStatus === "loading" || subscriptionLoading ? (
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Fetching live billing status...
            </div>
          ) : sessionStatus !== "authenticated" ? (
            <div className="mt-6 rounded-2xl border border-border bg-muted/35 p-4 text-sm text-muted-foreground">
              Sign in to manage your subscription settings.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                    subscription?.status,
                  )}`}
                >
                  {formatStatus(subscription?.status)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Access: {subscription?.hasAccess ? "Included" : "Restricted"}
                </span>
              </div>

              <dl className="grid gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Billing cycle</dt>
                  <dd className="font-medium text-foreground">
                    {subscription?.billingCycle
                      ? formatStatus(subscription.billingCycle)
                      : "Not started"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {subscription?.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {formatDate(subscription?.currentPeriodEnd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Portal access</dt>
                  <dd className="font-medium text-foreground">
                    {subscription?.portalAvailable ? "Ready" : "Not available"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Last sync</dt>
                  <dd className="font-medium text-foreground">
                    {formatDate(subscription?.updatedAt)}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing#pricing-cards"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  {subscription?.planId ? "Review Plans" : "Choose a Plan"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleManageBilling}
                  disabled={
                    !subscription?.portalAvailable ||
                    portalLoading ||
                    sessionStatus !== "authenticated"
                  }
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {portalLoading ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Opening Billing...
                    </>
                  ) : (
                    "Manage Billing"
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_18px_48px_-40px_rgba(15,23,42,0.45)]">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <RefreshCw className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Need the latest status?
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Refresh billing details after a checkout or portal update to
                  pull the newest subscription state from the backend.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRefreshNonce((count) => count + 1)}
              disabled={subscriptionLoading}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-55"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  subscriptionLoading ? "animate-spin" : ""
                }`}
              />
              Refresh Billing Status
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardSettingsPage() {
  return (
    <Suspense fallback={null}>
      <DashboardSettingsPageContent />
    </Suspense>
  );
}
