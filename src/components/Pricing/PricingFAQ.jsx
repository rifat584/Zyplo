"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function PricingFAQ({ faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-foreground">
          Answers before you commit
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
          Questions we hear from teams evaluating Zyplo for mission-critical planning and delivery.
        </p>

        <div className="mt-6 space-y-2.5">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="rounded-xl border border-border bg-card/90"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary dark:text-slate-100 dark:hover:text-secondary"
              >
                {item.q}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-slate-600 dark:border-border dark:text-muted-foreground">
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
