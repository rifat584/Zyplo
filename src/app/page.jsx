import Hero from '@/components/Home/Hero/Hero';
import TimeTracking from '@/components/Home/TimeTracking/TimeTracking';
import WorkflowStepper from '@/components/Home/WorkFlow/WorkflowStepper';

export default function Home() {
  return (
    <main>
      <Hero />
      <WorkflowStepper />
      <TimeTracking />
    </main>
  );
}