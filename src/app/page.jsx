import CommandPaletteSection from '@/components/Home/CommandPaletteSection/CommandPaletteSection';
import Hero from '@/components/Home/Hero/Hero';
import Testimonials from '@/components/Home/Testimonials/Testimonials';
import TimeTracking from '@/components/Home/TimeTracking/TimeTracking';
import WorkflowStepper from '@/components/Home/WorkFlow/WorkflowStepper';

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkflowStepper />
      <TimeTracking />
      <CommandPaletteSection />
      <Testimonials />
    </main>
  );
}