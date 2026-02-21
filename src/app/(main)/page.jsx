import Automation from '@/components/Home/Automation/Automation';
import CommandPaletteSection from '@/components/Home/CommandPaletteSection/CommandPaletteSection';
import FAQ from '@/components/Home/FAQ/FAQ';
import Hero from '@/components/Home/Hero/Hero';
import Testimonials from '@/components/Home/Testimonials/Testimonials';
import TimeTracking from '@/components/Home/TimeTracking/TimeTracking';
import WorkflowStepper from '@/components/Home/WorkFlow/WorkflowStepper';
import FeatureSectionLivingDashboard from '@/components/Home/FeatureSection';
import PartnerMarquee from '@/components/marquee/PartnerMarquee';
import Stats from '@/components/Home/Stats/Stats';




export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerMarquee />
      <FeatureSectionLivingDashboard/>
      <WorkflowStepper />
      <TimeTracking />
      <CommandPaletteSection />
      <Testimonials />
      <Stats />
      <Automation/>
      <FAQ/>
    </main>
  );
}
