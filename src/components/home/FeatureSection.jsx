"use client";

import { motion } from "framer-motion";
import {
  Bell,
  BookText,
  Boxes,
  Cable,
  FileText,
  FolderKanban,
  GitPullRequest,
  LayoutGrid,
  ListChecks,
  ShieldCheck,
  StickyNote,
  Users,
} from "lucide-react";

const messyChips = ["urgent", "bugfix", "review", "P1", "backend", "client"];
const messyCards = [
  { title: "Fix flaky CI", label: "Overdue" },
  { title: "Spec update", label: "Needs context" },
  { title: "API mismatch", label: "Blocked" },
];

const pillars = [
  {
    title: "Organize",
    icon: LayoutGrid,
    points: [
      { icon: ListChecks, label: "Tasks and ownership stay explicit" },
      { icon: FolderKanban, label: "Projects grouped by product area" },
      { icon: Boxes, label: "Kanban boards keep delivery visible" },
    ],
  },
  {
    title: "Document",
    icon: BookText,
    points: [
      { icon: FileText, label: "Docs live next to execution context" },
      { icon: GitPullRequest, label: "Specs linked to implementation" },
      { icon: StickyNote, label: "Notes stay attached to the work" },
    ],
  },
  {
    title: "Collaborate",
    icon: Users,
    points: [
      { icon: Bell, label: "Activity history keeps decisions traceable" },
      { icon: ShieldCheck, label: "Roles protect sensitive project areas" },
      { icon: Cable, label: "Integrations sync team signals in one place" },
    ],
  },
];

export default function FeatureSection() {
  return (
    <section
      aria-labelledby="feature-section-heading"
      className="relative overflow-hidden bg-white py-16 text-gray-900 dark:bg-slate-950 dark:text-slate-100 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.16),transparent_32%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="feature-section-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            From chaos to control.
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Developer-first planning that turns scattered updates into clear,
            shippable execution.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <motion.article
            aria-label="Messy workspace preview"
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 0.45, x: -10 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.35 }}
            className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Before
            </p>
            <h3 className="mt-2 text-lg font-medium">Scattered and reactive</h3>

            {messyChips.map((chip, index) => (
              <motion.span
                key={chip}
                initial={{ y: 0, rotate: 0 }}
                whileInView={{
                  y: index % 2 === 0 ? -6 : 6,
                  rotate: index % 2 === 0 ? -4 : 4,
                }}
                transition={{ duration: 1.1, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.4 }}
                className="absolute rounded-full border border-rose-200/70 bg-rose-50 px-2.5 py-1 text-xs text-rose-700 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200"
                style={{
                  top: `${18 + (index % 3) * 12}%`,
                  left: `${10 + index * 12}%`,
                }}
              >
                {chip}
              </motion.span>
            ))}

            <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
              {messyCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ y: 0, opacity: 0.95 }}
                  whileInView={{ y: index % 2 === 0 ? 5 : -5, opacity: 0.8 }}
                  transition={{ duration: 0.8, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-900/50 dark:text-amber-200">
                    {card.label}
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {card.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.article>

          <motion.article
            aria-label="Organized workspace preview"
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.35 }}
            className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85"
          >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
              After
            </p>
            <h3 className="mt-2 text-lg font-medium">Calm, clear execution</h3>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {["Backlog", "In Progress", "Done"].map((column) => (
                <div
                  key={column}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {column}
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="h-8 rounded-md bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700" />
                    <div className="h-8 rounded-md bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-cyan-200/70 bg-cyan-50/80 p-3 dark:border-cyan-900 dark:bg-cyan-950/40">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                Task Details
              </p>
              <div className="mt-2 space-y-2">
                <div className="h-2.5 w-8/12 rounded-full bg-cyan-200/80 dark:bg-cyan-800/60" />
                <div className="h-2.5 w-full rounded-full bg-cyan-200/80 dark:bg-cyan-800/60" />
                <div className="h-2.5 w-10/12 rounded-full bg-cyan-200/80 dark:bg-cyan-800/60" />
              </div>
            </div>
          </motion.article>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <article
                key={pillar.title}
                tabIndex={0}
                className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm outline-none transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900/80 dark:focus-visible:ring-cyan-500 dark:focus-visible:ring-offset-slate-950"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300">
                  <PillarIcon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{pillar.title}</h3>
                <ul className="mt-3 space-y-2">
                  {pillar.points.map((point) => {
                    const PointIcon = point.icon;
                    return (
                      <li
                        key={point.label}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <PointIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400"
                          aria-hidden="true"
                        />
                        <span>{point.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
