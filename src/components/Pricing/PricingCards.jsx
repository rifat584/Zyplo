"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export default function PricingCards({ plans, yearly, onBillingChange }) {
  return (
    <section id="pricing-cards" className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <div>
            <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Choose your plan
            </h2>
          </div>
          <div className="mx-auto inline-flex w-full max-w-70 items-center rounded-xl border border-slate-300 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-900 sm:w-auto sm:max-w-none">
            <button
              type="button"
              onClick={() => onBillingChange(false)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-4 ${
                yearly ? "text-slate-500 dark:text-slate-400" : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => onBillingChange(true)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex-none sm:px-4 ${
                yearly ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 sm:p-6 ${
                  plan.highlight
                    ? "lg:-mt-3 lg:mb-3 lg:scale-[1.01] border-indigo-500/45 bg-indigo-500/[0.08] shadow-[0_30px_65px_-40px_rgba(79,70,229,0.85)] dark:border-indigo-400/40 dark:bg-indigo-500/10"
                    : "border-slate-200/90 bg-white/75 shadow-[0_20px_40px_-32px_rgba(15,23,42,0.45)] hover:border-indigo-300/70 hover:shadow-[0_25px_50px_-34px_rgba(79,70,229,0.45)] dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-cyan-400/35"
                }`}
              >
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                  </div>
                  {plan.highlight ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300 bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  ${price}
                  <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400">/user/mo</span>
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                  {plan.bestFor}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {plan.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === "studio" ? "/contact" : "/login"}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      : "border border-slate-300 bg-white/85 text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
