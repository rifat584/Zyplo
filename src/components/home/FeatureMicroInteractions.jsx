"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRightLeft,
  Bell,
  FileText,
  FolderKanban,
  GripVertical,
  Lock,
  Milestone,
  Puzzle,
  ShieldCheck,
  SquareCheckBig,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

function CardShell({ title, description, children, className }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.14),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_30%)]" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-4">{children}</div>
      </div>
    </article>
  );
}

function TasksCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardShell
      title="Tasks"
      description="Open task context instantly so engineers can act without leaving the board."
    >
      <div className="relative h-36 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Patch API retry logic
        </div>
        <motion.div
          initial={false}
          animate={{
            x: reduceMotion ? 0 : 0,
            opacity: 1,
          }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease }}
          className={cn(
            "absolute bottom-2 right-2 w-36 rounded-lg border border-cyan-200 bg-cyan-50 p-2 dark:border-cyan-800 dark:bg-cyan-950/50",
            "lg:translate-x-6 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100",
            "motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none",
          )}
        >
          <p className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300">
            Task Details
          </p>
          <div className="mt-1 flex gap-1 text-[10px]">
            <span className="rounded-full border border-rose-200 px-1.5 py-0.5 text-rose-700 dark:border-rose-800 dark:text-rose-300">
              P1
            </span>
            <span className="rounded-full border border-amber-200 px-1.5 py-0.5 text-amber-700 dark:border-amber-800 dark:text-amber-300">
              Fri
            </span>
          </div>
        </motion.div>
      </div>
    </CardShell>
  );
}

function ProjectsCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardShell
      title="Projects"
      description="Surface project health and milestones early to reduce release surprises."
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Core Platform
          </p>
          <motion.span
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
            whileHover={reduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease }}
          >
            <Bell className="h-3 w-3" />
            Stable
          </motion.span>
        </div>
        <motion.ul
          initial={false}
          className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300"
          whileHover={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.24, ease }}
        >
          {["API freeze", "QA cycle", "Release prep"].map((item, idx) => (
            <li
              key={item}
              className={cn(
                "flex items-center gap-1.5 transition-all",
                "lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
              )}
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <Milestone className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </CardShell>
  );
}

function KanbanCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardShell
      title="Kanban Boards"
      description="See queue pressure and nudge work across stages with clearer movement cues."
    >
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-950/50">
        {["Backlog", "In Progress", "Done"].map((column, idx) => (
          <div
            key={column}
            className={cn(
              "rounded-lg border border-slate-200 bg-white p-1.5 transition-colors dark:border-slate-700 dark:bg-slate-900",
              idx === 1 &&
                "lg:group-hover:border-cyan-300 lg:group-hover:bg-cyan-50/70 dark:lg:group-hover:border-cyan-700 dark:lg:group-hover:bg-cyan-950/30",
            )}
          >
            <p className="text-[10px] font-semibold text-slate-500">{column}</p>
            <div className="mt-1 space-y-1">
              <div className="rounded bg-slate-100 px-1 py-1 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Build API
              </div>
              {idx === 1 && (
                <motion.div
                  className={cn(
                    "rounded border border-dashed border-cyan-400 bg-cyan-50/60 px-1 py-1 text-[10px] text-cyan-700 dark:border-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-300",
                    "transition-all duration-200 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                    "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
                  )}
                  initial={false}
                  animate={reduceMotion ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                  transition={{ duration: reduceMotion ? 0 : 0.2, ease }}
                >
                  <span className="inline-flex items-center gap-1">
                    <GripVertical className="h-3 w-3" /> Ghost card
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function DocsCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardShell
      title="Docs"
      description="Expose linked implementation notes in place so context stays attached to code decisions."
    >
      <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <p className="mb-1 font-semibold">Auth v3 Spec</p>
          <p className="inline-flex items-center gap-1 text-cyan-700 dark:text-cyan-300">
            <FileText className="h-3.5 w-3.5" />
            Linked snippet
          </p>
        </div>
        <motion.div
          initial={false}
          animate={reduceMotion ? { opacity: 1, y: 0 } : {}}
          className={cn(
            "absolute right-3 top-9 w-44 rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-[11px] text-cyan-800 shadow-sm dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200",
            "lg:pointer-events-none lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
            "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
          )}
        >
          Token refresh: rotate every 15 minutes and invalidate old sessions on key change.
        </motion.div>
      </div>
    </CardShell>
  );
}

function ActivityCard() {
  const reduceMotion = useReducedMotion();
  return (
    <CardShell
      title="Activity History"
      description="Stream every update into a clear timeline so handoffs and audits stay straightforward."
    >
      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        {["Maya moved Bug #214 to review", "Lin updated API acceptance criteria"].map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-lg bg-white p-2 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <Activity className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
            {item}
          </div>
        ))}
        <motion.div
          initial={false}
          animate={reduceMotion ? { opacity: 1, y: 0 } : {}}
          className="rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-xs font-medium text-cyan-800 transition-all dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          transition={{ duration: reduceMotion ? 0 : 0.22, ease }}
        >
          New: Priya set release blocker to P1.
        </motion.div>
      </div>
    </CardShell>
  );
}

function RolesIntegrationsCard() {
  const reduceMotion = useReducedMotion();
  const integrationIcons = [Puzzle, FolderKanban, ArrowRightLeft, ShieldCheck, SquareCheckBig];
  return (
    <CardShell
      title="Roles & Integrations"
      description="Protect access boundaries and keep external signals synced for cleaner team coordination."
    >
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/50">
        <div className="grid grid-cols-3 gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="font-semibold">Role</span>
          <span className="font-semibold">Boards</span>
          <span className="font-semibold">Settings</span>
          <span>Engineer</span>
          <span>Edit</span>
          <motion.span
            whileHover={reduceMotion ? {} : { scale: 1.04 }}
            className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300"
          >
            <Lock className="h-3 w-3" /> Locked
          </motion.span>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900">
          <motion.div
            className="flex w-max items-center gap-2"
            animate={
              reduceMotion
                ? { x: 0 }
                : {
                    x: [0, -10, 0],
                  }
            }
            transition={{
              duration: reduceMotion ? 0 : 1.8,
              ease,
              repeat: reduceMotion ? 0 : Infinity,
              repeatDelay: 1.2,
            }}
          >
            {integrationIcons.map((Icon, idx) => (
              <span
                key={idx}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              >
                <Icon className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </CardShell>
  );
}

export default function FeatureMicroInteractions() {
  return (
    <section
      aria-labelledby="micro-interactions-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_88%_3%,rgba(34,211,238,0.13),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2
            id="micro-interactions-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Micro-interactions
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Subtle motion patterns that make project state easier to scan, verify, and act on.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TasksCard />
          <ProjectsCard />
          <KanbanCard />
          <DocsCard />
          <ActivityCard />
          <RolesIntegrationsCard />
        </div>
      </div>
    </section>
  );
}
