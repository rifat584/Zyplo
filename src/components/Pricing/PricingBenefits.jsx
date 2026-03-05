"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Puzzle,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  Rocket,
  Activity,
  Bot,
  ShieldCheck,
  Puzzle,
  TrendingUp,
};

export default function PricingBenefits({ benefits }) {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 text-center sm:mb-8">
          <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Why teams upgrade to Zyplo
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Premium workflows are not just about features. They are about flow, confidence, and reliable delivery at every sprint.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item, index) => {
            const Icon = iconMap[item.icon] ?? Activity;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.32, delay: index * 0.05 }}
                className="rounded-2xl border border-slate-200/90 bg-white/80 p-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-5"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-300/40 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400/35 dark:bg-indigo-400/10 dark:text-indigo-300">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-base font-semibold dark:text-slate-100">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
