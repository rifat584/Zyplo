"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingPlans({ plans }) {
  const [yearly, setYearly] = useState(true);
  const orderedPlans = [
    plans.find((plan) => plan.id === "team"),
    plans.find((plan) => plan.id === "starter"),
    plans.find((plan) => plan.id === "studio"),
  ].filter(Boolean);

  return (
    <section id="pricing-plans" className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-xl border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              yearly
                ? "text-slate-500"
                : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              yearly
                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                : "text-slate-500"
            }`}
          >
            Yearly
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-indigo-950/40 dark:text-cyan-300">
              Save 20%
            </span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orderedPlans.map((plan, i) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className={`relative overflow-hidden rounded-2xl border p-4 transition-shadow sm:p-5 ${
                  plan.highlight
                    ? "border-indigo-500/40 bg-indigo-500/5 shadow-md dark:border-indigo-400/40 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
                } ${plan.highlight ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-transparent" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlight && (
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-indigo-950/50 dark:text-cyan-300">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  ${price}
                  <span className="ml-1 text-sm font-medium text-slate-500">/mo</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {yearly ? "billed yearly" : "billed monthly"}
                </p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.included}
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === "studio" ? "/contact" : "/login"}
                  className={`mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    plan.highlight
                      ? "bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-indigo-400 dark:text-slate-950 dark:hover:bg-indigo-300"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
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
