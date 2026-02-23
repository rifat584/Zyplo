"use client";

import { useMemo, useState } from "react";

import PricingHero from "@/components/Pricing/PricingHero";
import PricingCards from "@/components/Pricing/PricingCards";
import PricingBenefits from "@/components/Pricing/PricingBenefits";
import PricingComparison from "@/components/Pricing/PricingComparison";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingFinalCTA from "@/components/Pricing/PricingFinalCTA";

export default function PricingExperience({
  plans,
  benefits,
  comparisonCategories,
  faqs,
}) {
  const [yearly, setYearly] = useState(true);

  const orderedPlans = useMemo(() => {
    return [
      plans.find((plan) => plan.id === "starter"),
      plans.find((plan) => plan.id === "team"),
      plans.find((plan) => plan.id === "studio"),
    ].filter(Boolean);
  }, [plans]);

  return (
    <>
      <PricingHero />
      <PricingCards plans={orderedPlans} yearly={yearly} onBillingChange={setYearly} />
      <PricingBenefits benefits={benefits} />
      <PricingComparison categories={comparisonCategories} />
      <PricingFAQ faqs={faqs} />
      <PricingFinalCTA />
    </>
  );
}
