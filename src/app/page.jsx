import Automation from '@/components/Home/Automation/Automation';
import CommandPaletteSection from '@/components/Home/CommandPaletteSection/CommandPaletteSection';
import FAQ from '@/components/Home/FAQ/FAQ';
import Hero from '@/components/Home/Hero/Hero';
import Testimonials from '@/components/Home/Testimonials/Testimonials';
import TimeTracking from '@/components/Home/TimeTracking/TimeTracking';
import WorkflowStepper from '@/components/Home/WorkFlow/WorkflowStepper';
import FeatureGrid from '@/components/home/FeatureGrid';
import PartnerMarquee from '@/components/marquee/PartnerMarquee';

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerMarquee />
      <FeatureGrid />
      <WorkflowStepper />
      <TimeTracking />
      <CommandPaletteSection />
      <Testimonials />
      <Automation/>
      <FAQ/>
    </main>
  );
}
