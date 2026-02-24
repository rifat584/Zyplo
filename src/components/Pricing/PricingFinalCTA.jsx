import Link from "next/link";
import { StarBorder } from "@/components/ui/star-border";

export default function PricingFinalCTA() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="pointer-events-none absolute -left-12 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-400/20" />
          <div className="pointer-events-none absolute -right-10 top-2 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl dark:bg-cyan-400/20" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Ready to run a calmer, faster execution cycle?
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                Start with Team in minutes, or work with us on a Studio rollout for your org.
              </p>
            </div>

            <div className="grid gap-2 sm:flex sm:flex-wrap">
              <StarBorder
                as={Link}
                href="/login"
                color="#f59e0b"
                speed="4s"
                thickness={3}
                className="ring-1 ring-indigo-300/80 dark:ring-cyan-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span className="inline-flex items-center justify-center rounded-[calc(0.75rem-1px)] bg-gradient-to-r from-indigo-500 via-indigo-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                  Start free trial
                </span>
              </StarBorder>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
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
