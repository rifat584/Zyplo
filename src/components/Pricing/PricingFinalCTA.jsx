import Link from "next/link";
import { StarBorder } from "@/components/ui/star-border";

export default function PricingFinalCTA() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted p-5 dark:border-border dark:bg-card sm:p-7">
          <div className="pointer-events-none absolute -left-12 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20" />
          <div className="pointer-events-none absolute -right-10 top-2 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl dark:bg-secondary/15" />

          <div className="relative flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-foreground">
                Ready to run a calmer, faster execution cycle?
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                Start with Team in minutes, or work with us on a Studio rollout for your org.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center">
              <StarBorder
                as={Link}
                href="/login"
                color="#f59e0b"
                speed="4s"
                thickness={3}
                className="w-full sm:w-auto ring-1 ring-indigo-300/80 dark:ring-cyan-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <span className="inline-flex w-full items-center justify-center rounded-[calc(0.75rem-1px)] bg-gradient-to-r from-indigo-500 via-indigo-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                  Start free trial
                </span>
              </StarBorder>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-lg border border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:w-auto dark:border-foreground dark:bg-background dark:text-muted-foreground dark:hover:bg-surface"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
