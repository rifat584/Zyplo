import PricingAudience from "@/components/Pricing/PricingAudience";
import PricingComparisonTable from "@/components/Pricing/PricingComparisonTable";
import PricingCta from "@/components/Pricing/PricingCta";
import PricingFAQ from "@/components/Pricing/PricingFAQ";
import PricingHero from "@/components/Pricing/PricingHero";
import PricingPlans from "@/components/Pricing/PricingPlans";
import {
  comparisonRows,
  faqs,
  pricingPlans,
  useCaseCards,
} from "@/components/Pricing/pricingData";

export default function PricingPage() {
  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <PricingHero />
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
      <PricingPlans plans={pricingPlans} />
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
      <PricingComparisonTable rows={comparisonRows} />
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
      <PricingFAQ faqs={faqs} />
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
      <PricingAudience cards={useCaseCards} />
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
      <PricingCta />
    </main>
  );
}
