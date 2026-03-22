"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import PricingHero from "@/components/Pricing/PricingHero";
import PricingCards from "@/components/Pricing/PricingCards";
import PricingBenefits from "@/components/Pricing/PricingBenefits";
import PricingComparison from "@/components/Pricing/PricingComparison";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingFinalCTA from "@/components/Pricing/PricingFinalCTA";

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
    const error = new Error(String(data?.error || data?.message || "Request failed"));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
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

function isTerminalBillingStatus(status) {
  return ["inactive", "canceled", "incomplete_expired"].includes(String(status || "").toLowerCase());
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

export default function PricingExperience({
  plans,
  benefits,
  comparisonCategories,
  faqs,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();

  const [yearly, setYearly] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(sessionStatus === "loading");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [checkoutLoadingPlanId, setCheckoutLoadingPlanId] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [successPollCount, setSuccessPollCount] = useState(0);

  const checkoutState = String(searchParams.get("checkout") || "").trim().toLowerCase();
  const checkoutSessionId = String(searchParams.get("session_id") || "").trim();
  const billingCycle = yearly ? "yearly" : "monthly";

  const orderedPlans = useMemo(() => {
    return [
      plans.find((plan) => plan.id === "starter"),
      plans.find((plan) => plan.id === "team"),
      plans.find((plan) => plan.id === "studio"),
    ].filter(Boolean);
  }, [plans]);

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

        const cycle = String(data?.subscription?.billingCycle || "").toLowerCase();
        if (cycle === "monthly") setYearly(false);
        if (cycle === "yearly") setYearly(true);
      } catch (error) {
        if (!active) return;
        setSubscriptionData(null);
        setSubscriptionError(String(error?.message || "Failed to load billing details."));
      } finally {
        if (active) setSubscriptionLoading(false);
      }
    }

    loadSubscription();
    return () => {
      active = false;
    };
  }, [refreshNonce, sessionStatus]);

  useEffect(() => {
    setSuccessPollCount(0);
  }, [checkoutSessionId, checkoutState]);

  const subscription = subscriptionData?.subscription || null;
  const subscriptionStatus = String(subscription?.status || "inactive").toLowerCase();
  const existingManagedSubscription =
    Boolean(subscription?.planId) && !isTerminalBillingStatus(subscriptionStatus);
  const activePlanId = subscription?.planId || "";
  const activeBillingCycle = subscription?.billingCycle || "";

  const accountLabel = useMemo(() => {
    const ownerName = String(subscriptionData?.owner?.billingContactName || "").trim();
    const sessionName = String(session?.user?.name || "").trim();
    return ownerName || sessionName || "Your Account";
  }, [session?.user?.name, subscriptionData?.owner?.billingContactName]);

  const accountEmail = useMemo(() => {
    const ownerEmail = String(subscriptionData?.owner?.billingEmail || "").trim();
    const sessionEmail = String(session?.user?.email || "").trim();
    return ownerEmail || sessionEmail || "";
  }, [session?.user?.email, subscriptionData?.owner?.billingEmail]);

  useEffect(() => {
    if (
      checkoutState !== "success" ||
      sessionStatus !== "authenticated" ||
      subscriptionLoading ||
      subscription?.hasAccess ||
      successPollCount >= 4
    ) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccessPollCount((count) => count + 1);
      setRefreshNonce((count) => count + 1);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, [
    checkoutState,
    sessionStatus,
    subscription?.hasAccess,
    subscriptionLoading,
    successPollCount,
  ]);

  const pricingHref = "/pricing";

  const checkoutNotice = useMemo(() => {
    if (checkoutState === "success") {
      if (subscription?.hasAccess) {
        return {
          tone: "success",
          title: "Subscription is live.",
          description:
            accountLabel === "Your Account"
              ? "Your account now has access to paid billing features."
              : `${accountLabel} now has access to paid billing features.`,
        };
      }

      return {
        tone: "info",
        title: "Payment received. Syncing your subscription.",
        description:
          "Stripe has sent us the checkout result. Billing status can take a few seconds to update while webhooks arrive.",
      };
    }

    if (checkoutState === "cancelled") {
      return {
        tone: "warning",
        title: "Checkout was cancelled.",
        description: "No changes were made to your subscription.",
      };
    }

    return null;
  }, [accountLabel, checkoutState, subscription?.hasAccess]);

  async function handleManageBilling() {
    if (sessionStatus !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pricingHref)}`);
      return;
    }

    if (portalLoading) return;

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
      setSubscriptionError(String(error?.message || "Failed to open billing portal."));
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleCheckout(planId) {
    if (sessionStatus !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pricingHref)}`);
      return;
    }

    if (checkoutLoadingPlanId) return;

    try {
      setCheckoutLoadingPlanId(planId);
      setSubscriptionError("");

      const data = await requestJson("/api/billing/checkout-session", {
        method: "POST",
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      });

      if (!data?.url) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.assign(data.url);
    } catch (error) {
      if (error?.status === 409 && subscription?.portalAvailable) {
        setSubscriptionError(
          "This account already has a Stripe subscription. Opening billing portal so you can manage it there.",
        );
        await handleManageBilling();
        return;
      }

      setSubscriptionError(String(error?.message || "Failed to create checkout session."));
    } finally {
      setCheckoutLoadingPlanId("");
    }
  }

  const planActions = (() => {
    const actions = {};

    for (const plan of orderedPlans) {
      if (plan.id === "studio") {
        actions[plan.id] = {
          kind: "link",
          href: "/contact",
          label: plan.cta,
          note: "Studio is handled through a custom sales workflow.",
        };
        continue;
      }

      if (sessionStatus === "loading") {
        actions[plan.id] = {
          kind: "button",
          label: "Checking Account...",
          disabled: true,
          busy: true,
        };
        continue;
      }

      if (sessionStatus !== "authenticated") {
        actions[plan.id] = {
          kind: "link",
          href: `/login?callbackUrl=${encodeURIComponent(pricingHref)}`,
          label: "Log In to Continue",
          note: "Sign in first so we can attach billing to your account.",
        };
        continue;
      }

      const isCurrentPlan = activePlanId === plan.id;
      const isCurrentCycle = isCurrentPlan && activeBillingCycle === billingCycle;

      if (isCurrentCycle && subscription?.hasAccess) {
        actions[plan.id] = {
          kind: "button",
          label: "Current Plan",
          disabled: true,
          variant: "current",
          note: "Your account is already on this billing setup.",
        };
        continue;
      }

      if (existingManagedSubscription && subscription?.portalAvailable) {
        actions[plan.id] = {
          kind: "button",
          label:
            isCurrentPlan && !isCurrentCycle
              ? "Switch Cycle in Billing"
              : subscriptionStatus === "past_due"
                ? "Fix in Billing"
                : "Change in Billing",
          onClick: handleManageBilling,
          busy: portalLoading,
          disabled: portalLoading,
          note: "Plan changes happen in the Stripe Billing Portal.",
        };
        continue;
      }

      actions[plan.id] = {
        kind: "button",
        label: checkoutLoadingPlanId === plan.id ? "Opening Checkout..." : plan.cta,
        onClick: () => handleCheckout(plan.id),
        busy: checkoutLoadingPlanId === plan.id,
        disabled: Boolean(checkoutLoadingPlanId && checkoutLoadingPlanId !== plan.id),
        note: "Continue to hosted Stripe Checkout.",
      };
    }

    return actions;
  })();

  return (
    <>
      <PricingHero />

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 p-5 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(79,70,229,0.16),transparent_36%),radial-gradient(circle_at_85%_18%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(79,70,229,0.08),transparent_44%)]" />
            <div className="pointer-events-none absolute -right-16 top-8 h-40 w-40 rounded-full bg-cyan-400/14 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-4 h-48 w-48 rounded-full bg-primary/12 blur-3xl" />

            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                  <CreditCard className="h-3.5 w-3.5" />
                  Account Billing
                </span>
                {checkoutNotice ? (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                      checkoutNotice.tone === "success"
                        ? "border-success/25 bg-success/10 text-success"
                        : checkoutNotice.tone === "warning"
                          ? "border-warning/25 bg-warning/10 text-warning"
                          : "border-info/20 bg-info/10 text-info"
                    }`}
                  >
                    {checkoutNotice.tone === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : checkoutNotice.tone === "warning" ? (
                      <TriangleAlert className="h-3.5 w-3.5" />
                    ) : (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {checkoutNotice.title}
                  </span>
                ) : null}
              </div>

              {checkoutNotice ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    checkoutNotice.tone === "success"
                      ? "border-success/25 bg-success/10 text-success"
                      : checkoutNotice.tone === "warning"
                        ? "border-warning/25 bg-warning/10 text-warning"
                        : "border-info/20 bg-info/10 text-info"
                  }`}
                >
                  <p className="font-semibold">{checkoutNotice.title}</p>
                  <p className="mt-1 text-current/90">{checkoutNotice.description}</p>
                </div>
              ) : null}

              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-3xl font-heading font-semibold tracking-tight text-foreground sm:text-4xl">
                      Manage your subscription.
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Billing in Zyplo is managed per user account. Start a hosted Stripe checkout for your account or
                      jump straight into the billing portal when a subscription already exists.
                    </p>
                  </div>

                  {sessionStatus === "loading" ? (
                    <div className="rounded-3xl border border-border bg-background/85 p-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Checking your account...
                      </div>
                    </div>
                  ) : sessionStatus !== "authenticated" ? (
                    <div className="rounded-3xl border border-border bg-background/85 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">Log in before starting billing.</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            We only start subscription checkout after we know which account should own it.
                          </p>
                        </div>
                        <Link
                          href="/login?callbackUrl=%2Fpricing"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                        >
                          Log In
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-border bg-background/85 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            Billing Account
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Your Stripe subscription is attached to your Zyplo account.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRefreshNonce((count) => count + 1)}
                          disabled={subscriptionLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${subscriptionLoading ? "animate-spin" : ""}`} />
                          Refresh
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <ShieldCheck className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground">{accountLabel}</p>
                          <p className="truncate text-muted-foreground">{accountEmail || "Signed in account"}</p>
                        </div>
                      </div>

                      {subscriptionError ? (
                        <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                          {subscriptionError}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-border bg-background/88 p-5 shadow-[0_18px_48px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Current Subscription
                      </p>
                      <h3 className="mt-2 text-2xl font-heading font-semibold text-foreground">{accountLabel}</h3>
                    </div>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CreditCard className="h-5 w-5" />
                    </span>
                  </div>

                  {sessionStatus !== "authenticated" ? (
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      Log in to load your billing status, renewal timeline, and available Stripe actions.
                    </p>
                  ) : subscriptionLoading ? (
                    <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Fetching live billing status...
                    </div>
                  ) : (
                    <div className="mt-5 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-4xl font-semibold tracking-tight text-foreground">
                          {subscription?.planId ? subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1) : "Free"}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                            subscription?.status,
                          )}`}
                        >
                          {formatStatus(subscription?.status)}
                        </span>
                      </div>

                      <dl className="grid gap-3 rounded-2xl border border-border bg-muted/45 p-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-muted-foreground">Billing cycle</dt>
                          <dd className="font-medium text-foreground">
                            {subscription?.billingCycle ? formatStatus(subscription.billingCycle) : "Not started"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-muted-foreground">
                            {subscription?.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
                          </dt>
                          <dd className="font-medium text-foreground">
                            {formatDate(subscription?.currentPeriodEnd) || "Not scheduled"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-muted-foreground">Access</dt>
                          <dd className="font-medium text-foreground">
                            {subscription?.hasAccess ? "Included" : "Restricted"}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                          href="/pricing#pricing-cards"
                          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                        >
                          {subscription?.planId ? "Review Plans" : "Choose a Plan"}
                        </Link>
                        <button
                          type="button"
                          onClick={handleManageBilling}
                          disabled={!subscription?.portalAvailable || portalLoading || sessionStatus !== "authenticated"}
                          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-55"
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

                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {subscription?.portalAvailable
                          ? "Card updates, plan changes, invoice history, and cancellations all happen inside Stripe Billing Portal."
                          : "Start a subscription below to unlock hosted billing management in Stripe."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingCards
        plans={orderedPlans}
        yearly={yearly}
        onBillingChange={setYearly}
        planActions={planActions}
        currentPlanId={activePlanId}
        currentBillingCycle={activeBillingCycle}
        subscriptionStatus={subscriptionStatus}
      />
      <PricingBenefits benefits={benefits} />
      <PricingComparison categories={comparisonCategories} />
      <PricingFAQ faqs={faqs} />
      <PricingFinalCTA />
    </>
  );
}

