import Link from "next/link";

export default function PricingCta() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-slate-300 bg-slate-100 p-5 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 h-px w-full bg-gradient-to-r from-indigo-500/30 via-cyan-400/20 to-transparent" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Ready to ship faster with Zyplo?
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Start free today or talk with us about your team rollout.
              </p>
            </div>
            <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <Link
                href="/login"
                className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300 sm:w-auto"
              >
                Start free
              </Link>
              <Link
                href="/contact"
                className="w-full rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
