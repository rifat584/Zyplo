"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderKanban,
  LayoutGrid,
  Lock,
  Puzzle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease },
  },
};

function CardFrame({ children, className }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/85",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function FeatureSectionAsymmetric() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="features-asymmetric-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.14),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(56,189,248,0.1),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2
            id="features-asymmetric-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Features Built for Fast Product Delivery
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Zyplo keeps planning, execution, and team visibility connected without adding noise.
          </p>
        </div>

        <motion.div
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-8 space-y-4"
        >
          <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
            <motion.div variants={reduceMotion ? undefined : fadeUp}>
              <CardFrame className="h-full p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                      Kanban Boards
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                      See flow, clear blockers, ship predictably
                    </h3>
                  </div>
                  <LayoutGrid className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {["Backlog", "In Progress", "Done"].map((column, idx) => (
                    <div
                      key={column}
                      className={cn(
                        "rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900",
                        idx === 1 &&
                          "ring-1 ring-cyan-300/80 dark:ring-cyan-700/80",
                      )}
                    >
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {column}
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          API Schema Patch
                        </div>
                        <div className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Client Retry Logic
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Instant view of queue load by stage.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Clear handoff state between engineering and review.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Blocked cards surface before they hit release windows.
                  </li>
                </ul>
              </CardFrame>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : fadeUp}
              className="grid gap-4"
            >
              <CardFrame>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Tasks
                  </h3>
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Patch auth regression
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Write rollout notes
                  </div>
                </div>
              </CardFrame>

              <CardFrame>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Docs
                  </h3>
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
                <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-xs text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                  Release note draft linked to board card.
                </div>
              </CardFrame>

              <CardFrame>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Activity History
                  </h3>
                  <Activity className="h-4 w-4 text-slate-500" />
                </div>
                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <p className="rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800">
                    Maya moved API patch to review.
                  </p>
                  <p className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                    New: Priya updated acceptance checks.
                  </p>
                </div>
              </CardFrame>
            </motion.div>
          </div>

          <motion.div variants={reduceMotion ? undefined : fadeUp}>
            <CardFrame className="p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.85fr_1fr]">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Projects
                    </h3>
                    <FolderKanban className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Payments Upgrade</p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-2 w-2/3 rounded-full bg-cyan-500" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      On track
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                      <Users className="h-3.5 w-3.5" />
                      Maya, Lin, Priya
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Notifications
                    </h3>
                    <Bell className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    <label className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 dark:bg-slate-800">
                      Release blockers
                      <span className="h-3 w-6 rounded-full bg-cyan-500" />
                    </label>
                    <label className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 dark:bg-slate-800">
                      Mention alerts
                      <span className="h-3 w-6 rounded-full bg-cyan-500" />
                    </label>
                    <label className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 dark:bg-slate-800">
                      Daily digest
                      <span className="h-3 w-6 rounded-full bg-slate-300 dark:bg-slate-600" />
                    </label>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Roles & Integrations
                    </h3>
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Role</span>
                    <span className="font-semibold">Boards</span>
                    <span className="font-semibold">Admin</span>
                    <span>Engineer</span>
                    <span>Edit</span>
                    <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
                      <Lock className="h-3 w-3" />
                      No
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[Puzzle, FolderKanban, ShieldCheck].map((Icon, idx) => (
                      <span
                        key={idx}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                      >
                        <Icon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardFrame>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
