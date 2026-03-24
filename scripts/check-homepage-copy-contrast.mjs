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
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern:
      'className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.16),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.7),transparent_32%,rgba(255,255,255,0.8))] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.14),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.92),transparent_34%,rgba(2,6,23,0.96))]"',
    reason: "time tracking section still uses the old multi-layer background shell",
  },
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern:
      'className="absolute -left-36 top-0 h-[420px] w-[420px] rounded-full bg-secondary/14 blur-[120px]"',
    reason: "time tracking section still uses the old left blur orb",
  },
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern:
      'className="absolute -bottom-28 right-0 h-[440px] w-[440px] rounded-full bg-primary/14 blur-[130px]"',
    reason: "time tracking section still uses the old right blur orb",
  },
];

const requiredPatterns = [
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern:
      '<div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_62%)]" />',
    reason:
      "time tracking section is missing the new centered radial background treatment",
  },
];

const failures = [];

for (const check of riskyPatterns) {
  const source = readFileSync(join(root, check.file), "utf8");
  if (source.includes(check.pattern)) {
    failures.push(`${check.file}: ${check.reason}`);
  }
}

for (const check of requiredPatterns) {
  const source = readFileSync(join(root, check.file), "utf8");
  if (!source.includes(check.pattern)) {
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
