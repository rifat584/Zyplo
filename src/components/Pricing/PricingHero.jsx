import Link from "next/link";

export default function PricingHero() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-heading font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Pick the plan that matches how your team plans, builds, and ships.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
            >
              Start free
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Contact sales
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
