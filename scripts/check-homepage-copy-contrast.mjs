import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const riskyPatterns = [
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern: 'className="marketing-copy-strong mt-5 max-w-2xl text-base leading-7 sm:text-lg"',
    reason: "hero lead copy is still using a softened tone instead of full foreground contrast",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern: 'className="marketing-copy mt-5 max-w-2xl text-base leading-7 sm:text-lg"',
    reason: "hero lead copy is still using the generic marketing tier instead of the stronger hero tier",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern: "text-base leading-7 text-muted-foreground",
    reason: "hero lead copy still uses the washed-out muted token",
  },
  {
    file: "src/components/marquee/PartnerMarquee.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "partner marquee intro copy still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/FeatureSection/FeatureSection.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "feature section intro copy still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/WorkFlow/WorkflowStepper.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "workflow section intro or step copy still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "time tracking section intro still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/CommandPaletteSection/CommandPaletteSection.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "command palette intro copy still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/Testimonials/Testimonials.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "testimonial section intro still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/Stats/Stats.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "stats section intro still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/Automation/Automation.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "automation section intro still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/FAQ/FAQ.jsx",
    pattern: "text-sm leading-6 text-muted-foreground sm:text-base",
    reason: "faq section intro still uses the washed-out muted token",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern: 'className="order-2 relative flex justify-center md:justify-end"',
    reason: "hero image is still visible on mobile",
  },
];

const failures = [];

for (const check of riskyPatterns) {
  const source = readFileSync(join(root, check.file), "utf8");
  if (source.includes(check.pattern)) {
    failures.push(`${check.file}: ${check.reason}`);
  }
}

if (failures.length > 0) {
  console.error("Homepage copy contrast check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Homepage copy contrast check passed.");
