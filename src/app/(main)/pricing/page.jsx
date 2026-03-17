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
      <PricingExperience
        plans={pricingPlans}
        benefits={pricingBenefits}
        comparisonCategories={comparisonCategories}
        faqs={faqs}
      />
    </main>
  );
}
