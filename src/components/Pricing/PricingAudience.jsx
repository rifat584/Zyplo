import { ArrowRight, Building2, User, Users } from "lucide-react";
import Link from "next/link";

const iconMap = {
  User,
  Users,
  Building2,
};

export default function PricingAudience({ cards }) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-slate-300 bg-slate-100 p-5 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Choose your plan by use case
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Pick based on team structure, delivery cadence, and governance needs.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {cards.map((card) => {
              const Icon = iconMap[card.icon] ?? User;

              return (
                <article
                  key={card.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
                      {card.bestFit}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{card.description}</p>

                  <ul className="mt-3 space-y-1.5">
                    {card.bullets.map((item) => (
                      <li key={item} className="text-sm text-slate-700 dark:text-slate-200">
                        • {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#pricing-plans"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:text-indigo-300 dark:hover:text-indigo-200"
                  >
                    View plan details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
