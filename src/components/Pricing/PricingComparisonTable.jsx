"use client";

import { useState } from "react";
import { Check } from "lucide-react";

function Cell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-cyan-400" />;
  }
  return <span>{value}</span>;
}

export default function PricingComparisonTable({ rows }) {
  const [showAll, setShowAll] = useState(false);
  const visibleRows = showAll ? rows : rows.slice(0, 5);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Compare Plans
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Clear limits and capabilities for each plan.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-gradient-to-r from-indigo-500/10 via-cyan-400/10 to-transparent dark:from-indigo-400/15 dark:via-cyan-300/10 dark:to-transparent">
              <tr className="text-left text-slate-700 dark:text-slate-200">
                <th className="sticky left-0 z-10 bg-white px-4 py-3 font-semibold dark:bg-slate-950">Feature</th>
                <th className="px-4 py-3 font-semibold">Starter</th>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Studio</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-t border-slate-200 text-slate-700 transition hover:bg-cyan-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-indigo-950/20"
                >
                  <td className="sticky left-0 bg-white px-4 py-3 font-medium dark:bg-slate-950">{row.feature}</td>
                  <td className="px-4 py-3 text-center"><Cell value={row.starter} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.team} /></td>
                  <td className="px-4 py-3 text-center"><Cell value={row.studio} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAll && rows.length > 5 && (
          <div className="mt-3 sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Show all features
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
