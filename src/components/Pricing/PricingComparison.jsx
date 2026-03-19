import { Fragment } from "react";
import { Check } from "lucide-react";

function ComparisonCell({ value }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-secondary" />;
  }
  if (value === false) {
    return <span className="text-muted-foreground dark:text-slate-700">-</span>;
  }
  return <span>{value}</span>;
}

export default function PricingComparison({ categories }) {
  return (
    <section id="compare-plans" className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 text-center">
          <h2 className="text-center text-5xl font-heading font-semibold tracking-tight text-foreground">
            Compare plans in detail
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Feature groups are organized for quick scanning across planning, collaboration, and security needs.
          </p>
        </div>

        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-border bg-white/90 shadow-[0_20px_42px_-28px_rgba(15,23,42,0.5)] dark:border-border dark:bg-background/85">
          <table className="w-full min-w-170 text-xs sm:min-w-190 sm:text-sm">
            <thead>
              <tr className="text-left text-foreground">
                <th className="sticky left-0 z-20 min-w-45 border-b border-border bg-white px-3 py-3 font-semibold sm:min-w-55 sm:px-4 dark:border-border dark:bg-background">
                  Feature
                </th>
                <th className="border-b border-border px-3 py-3 text-center font-semibold sm:px-4 dark:border-border">Starter</th>
                <th className="border-b border-border px-3 py-3 text-center font-semibold sm:px-4 dark:border-border">Team</th>
                <th className="border-b border-border px-3 py-3 text-center font-semibold sm:px-4 dark:border-border">Studio</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <Fragment key={category.id}>
                  <tr key={`${category.id}-header`} className="bg-surface/80">
                    <td
                      className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:px-4 dark:text-muted-foreground"
                      colSpan={4}
                    >
                      {category.title}
                    </td>
                  </tr>
                  {category.rows.map((row) => (
                    <tr
                      key={`${category.id}-${row.feature}`}
                      className="border-t border-border/80 text-foreground transition hover:bg-accent/40 dark:border-border dark:text-foreground dark:hover:bg-accent/20"
                    >
                      <td className="sticky left-0 z-10 bg-white px-3 py-3 font-medium sm:px-4 dark:bg-background">{row.feature}</td>
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
