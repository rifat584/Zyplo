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
  {
    file: "src/components/layout/Navbar/Navbar.jsx",
    pattern: 'const openCommandPalette = () => {',
    reason: "navbar still wires up an in-nav command palette trigger",
  },
  {
    file: "src/components/layout/Navbar/Navbar.jsx",
    pattern: "Ctrl K",
    reason: "navbar still shows the desktop Ctrl K search pill",
  },
  {
    file: "src/components/layout/Navbar/Navbar.jsx",
    pattern: "Search...",
    reason: "navbar still shows the mobile search action",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern:
      'className="pointer-events-none absolute inset-x-6 bottom-6 top-12 rounded-[2rem] border border-primary/10 bg-linear-to-br from-background/10 via-background/5 to-secondary/10 blur-3xl"',
    reason: "hero image still has the outer framed glow shell",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern:
      'className="relative w-full max-w-[39rem] rounded-[2rem] border border-border/70 bg-card/55 p-3 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-4"',
    reason: "hero image still has the padded border frame around it",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern:
      'className="absolute inset-x-12 top-0 h-14 bg-linear-to-b from-secondary/25 to-transparent blur-2xl"',
    reason: "hero image still keeps the decorative top glow inside the old frame",
  },
  {
    file: "src/components/Home/FAQ/FAQ.jsx",
    pattern: 'className="overflow-hidden border-t border-border/60 bg-background/55"',
    reason: "faq answers still use the washed-out answer surface",
  },
  {
    file: "src/components/Home/FAQ/FAQ.jsx",
    pattern: 'className="px-5 pb-5 pt-4 text-sm leading-7 text-foreground/80 sm:text-base"',
    reason: "faq answers still use softened text on the answer surface",
  },
  {
    file: "src/components/layout/Footer/Footer.jsx",
    pattern: 'className="flex flex-col gap-2"',
    reason: "footer email field and subscribe button are still too tightly stacked",
  },
  {
    file: "src/components/marquee/PartnerMarquee.jsx",
    pattern: 'className="px-6 pb-8 pt-6 sm:pb-12 sm:pt-8"',
    reason: "marquee section still sits too close to the feature section",
  },
];

const requiredPatterns = [
  {
    file: "src/components/Home/TimeTracking/TimeTracking.jsx",
    pattern:
      '<div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_34%),radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_68%)]" />',
    reason:
      "time tracking section is missing the updated distinct backdrop treatment",
  },
  {
    file: "src/components/Home/Hero/Hero.jsx",
    pattern: 'className="relative w-full max-w-[39rem]"',
    reason: "hero image wrapper still is not reduced to a frameless shell",
  },
  {
    file: "src/components/Home/FAQ/FAQ.jsx",
    pattern:
      'className="overflow-hidden border-t border-border/60 bg-background/90 dark:bg-card/95"',
    reason: "faq answers are missing the stronger readable answer surface",
  },
  {
    file: "src/components/layout/Footer/Footer.jsx",
    pattern: 'className="flex flex-col gap-3"',
    reason: "footer stack is missing the added spacing between input and button",
  },
  {
    file: "src/components/marquee/PartnerMarquee.jsx",
    pattern: 'className="px-6 pb-12 pt-6 sm:pb-16 sm:pt-8"',
    reason: "marquee section is missing the added gap before the feature section",
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
