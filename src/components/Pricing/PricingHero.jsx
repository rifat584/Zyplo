"use client";

import Link from "next/link";
import { StarBorder } from "@/components/ui/star-border";

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 py-12 dark:border-slate-800/70 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(79,70,229,0.22),transparent_45%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.18),transparent_42%),radial-gradient(circle_at_50%_78%,rgba(79,70,229,0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(79,70,229,0.28),transparent_48%),radial-gradient(circle_at_82%_24%,rgba(34,211,238,0.22),transparent_45%),radial-gradient(circle_at_50%_78%,rgba(79,70,229,0.14),transparent_52%)]" />
      <div className="pointer-events-none absolute left-1/2 top-2 h-44 w-[32rem] -translate-x-1/2 rounded-full bg-indigo-500/18 blur-3xl dark:bg-indigo-400/20" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-36 w-[26rem] -translate-x-1/2 rounded-full bg-cyan-400/14 blur-3xl dark:bg-cyan-300/18" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(248,250,252,0.95),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_20%,rgba(2,6,23,0.92),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 backdrop-blur-[1.5px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
          Simple pricing, built to scale.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Pick the right plan and start shipping faster.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </section>
  );
}
