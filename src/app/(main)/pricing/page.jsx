import { Suspense } from "react";
import PricingExperience from "@/components/Pricing/PricingExperience";
import {
  comparisonCategories,
  faqs,
  pricingBenefits,
  pricingPlans,
} from "@/components/Pricing/pricingData";

export default function PricingPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Suspense fallback={null}>
        <PricingExperience
          plans={pricingPlans}
          benefits={pricingBenefits}
          comparisonCategories={comparisonCategories}
          faqs={faqs}
        />
      </Suspense>
    </main>
  );
}
