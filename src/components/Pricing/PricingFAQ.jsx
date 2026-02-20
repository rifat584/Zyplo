"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PricingFAQ({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Common Questions
        </h2>
        <div className="mt-4 space-y-2">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-slate-100"
              >
                {item.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-slate-200 px-4 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
