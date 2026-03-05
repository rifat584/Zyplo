import { Fragment } from "react";
import { Check } from "lucide-react";

function ComparisonCell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-cyan-500 dark:text-cyan-300" />;
  }
  if (value === false) {
    return <span className="text-slate-300 dark:text-slate-700">-</span>;
  }
  return <span>{value}</span>;
}

export default function PricingComparison({ categories }) {
  return (
    <section id="compare-plans" className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 text-center">
          <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Compare plans in detail
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Feature groups are organized for quick scanning across planning, collaboration, and security needs.
          </p>
        </div>

        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-slate-200 bg-white/90 shadow-[0_20px_42px_-28px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950/85">
          <table className="w-full min-w-170 text-xs sm:min-w-190 sm:text-sm">
            <thead>
              <tr className="text-left text-slate-700 dark:text-slate-200">
                <th className="sticky left-0 z-20 min-w-45 border-b border-slate-200 bg-white px-3 py-3 font-semibold sm:min-w-55 sm:px-4 dark:border-slate-800 dark:bg-slate-950">
                  Feature
                </th>
                <th className="border-b border-slate-200 px-3 py-3 text-center font-semibold sm:px-4 dark:border-slate-800">Starter</th>
                <th className="border-b border-slate-200 px-3 py-3 text-center font-semibold sm:px-4 dark:border-slate-800">Team</th>
                <th className="border-b border-slate-200 px-3 py-3 text-center font-semibold sm:px-4 dark:border-slate-800">Studio</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <Fragment key={category.id}>
                  <tr key={`${category.id}-header`} className="bg-slate-100/80 dark:bg-slate-900/70">
                    <td
                      className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:px-4 dark:text-slate-400"
                      colSpan={4}
                    >
                      {category.title}
                    </td>
                  </tr>
                  {category.rows.map((row) => (
                    <tr
                      key={`${category.id}-${row.feature}`}
                      className="border-t border-slate-200/80 text-slate-700 transition hover:bg-cyan-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-cyan-950/10"
                    >
                      <td className="sticky left-0 z-10 bg-white px-3 py-3 font-medium sm:px-4 dark:bg-slate-950">{row.feature}</td>
                      <td className="px-3 py-3 text-center sm:px-4"><ComparisonCell value={row.starter} /></td>
                      <td className="px-3 py-3 text-center sm:px-4"><ComparisonCell value={row.team} /></td>
                      <td className="px-3 py-3 text-center sm:px-4"><ComparisonCell value={row.studio} /></td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
