"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

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
    const error = new Error(
      String(data?.error || data?.message || "Request failed"),
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function isTerminalBillingStatus(status) {
  return ["inactive", "canceled", "incomplete_expired"].includes(
    String(status || "").toLowerCase(),
  );
}

export default function PricingExperience({
  plans,
  benefits,
  comparisonCategories,
  faqs,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: sessionStatus } = useSession();

  const [yearly, setYearly] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(
    sessionStatus === "loading",
  );
  const [subscriptionError, setSubscriptionError] = useState("");
  const [checkoutLoadingPlanId, setCheckoutLoadingPlanId] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [successPollCount, setSuccessPollCount] = useState(0);

  const checkoutState = String(searchParams.get("checkout") || "")
    .trim()
    .toLowerCase();
  const checkoutSessionId = String(searchParams.get("session_id") || "").trim();
  const billingCycle = yearly ? "yearly" : "monthly";

  const orderedPlans = useMemo(
    () =>
      [
        plans.find((plan) => plan.id === "starter"),
        plans.find((plan) => plan.id === "team"),
        plans.find((plan) => plan.id === "studio"),
      ].filter(Boolean),
    [plans],
  );

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

  useEffect(() => {
    setSuccessPollCount(0);
  }, [checkoutSessionId, checkoutState]);

  const subscription = subscriptionData?.subscription || null;
  const subscriptionStatus = String(subscription?.status || "inactive").toLowerCase();
  const existingManagedSubscription =
    Boolean(subscription?.planId) && !isTerminalBillingStatus(subscriptionStatus);
  const activePlanId = subscription?.planId || "";
  const activeBillingCycle = subscription?.billingCycle || "";

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

  useEffect(() => {
    if (checkoutState === "success" && subscription?.hasAccess) {
      router.replace("/dashboard/settings?billing=success");
    }
  }, [checkoutState, router, subscription?.hasAccess]);

  const pricingHref = "/pricing";

  const checkoutNotice = useMemo(() => {
    if (checkoutState === "success") {
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
  }, [checkoutState]);

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
      setSubscriptionError(
        String(error?.message || "Failed to open billing portal."),
      );
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

      setSubscriptionError(
        String(error?.message || "Failed to create checkout session."),
      );
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
      const isCurrentCycle =
        isCurrentPlan && activeBillingCycle === billingCycle;

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
        label:
          checkoutLoadingPlanId === plan.id
            ? "Opening Checkout..."
            : plan.cta,
        onClick: () => handleCheckout(plan.id),
        busy: checkoutLoadingPlanId === plan.id,
        disabled: Boolean(
          checkoutLoadingPlanId && checkoutLoadingPlanId !== plan.id,
        ),
        note: "Continue to hosted Stripe Checkout.",
      };
    }

    return actions;
  })();

  return (
    <>
      <PricingHero />

      {checkoutNotice || subscriptionError ? (
        <section className="py-8 pb-0 sm:py-10 sm:pb-0">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="space-y-3">
              {checkoutNotice ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    checkoutNotice.tone === "warning"
                      ? "border-warning/25 bg-warning/10 text-warning"
                      : "border-info/20 bg-info/10 text-info"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {checkoutNotice.tone === "warning" ? (
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                    )}
                    <div>
                      <p className="font-semibold">{checkoutNotice.title}</p>
                      <p className="mt-1 text-current/90">
                        {checkoutNotice.description}
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
          </div>
        </section>
      ) : null}

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
