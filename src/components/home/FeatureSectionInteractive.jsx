"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  CheckSquare,
  CircleDashed,
  FileText,
  Flag,
  FolderKanban,
  GripVertical,
  LayoutGrid,
  Milestone,
  Puzzle,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";

const steps = [
  {
    id: "tasks",
    title: "Tasks",
    description:
      "Keep priorities, due dates, and context in one place so engineers can execute without chasing details.",
  },
  {
    id: "projects",
    title: "Projects",
    description:
      "Track project health and milestones at a glance so release risks surface early.",
  },
  {
    id: "kanban",
    title: "Kanban Boards",
    description:
      "Move work across clear stages so ownership and progress stay obvious to the whole team.",
  },
  {
    id: "docs",
    title: "Docs",
    description:
      "Attach implementation notes and specs directly to execution so decisions remain discoverable.",
  },
  {
    id: "activity",
    title: "Activity History",
    description:
      "Get an auditable timeline of changes so updates and handoffs are never ambiguous.",
  },
  {
    id: "roles-integrations",
    title: "Roles & Integrations",
    description:
      "Control access precisely and connect existing tools so teams collaborate securely without fragmentation.",
  },
];

function TasksMock() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Task Queue
        </h4>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
          12 open
        </span>
      </div>
      <div className="space-y-2">
        {["Refactor auth middleware", "Fix flaky integration test", "Ship API pagination"].map(
          (task) => (
            <div
              key={task}
              className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {task}
                </p>
                <CheckSquare className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                  <Flag className="h-3 w-3" /> P1
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  <CalendarDays className="h-3 w-3" /> Fri
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Tag className="h-3 w-3" /> backend
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ProjectsMock() {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Platform Revamp
      </h4>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Status
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            On track
          </span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2 w-2/3 rounded-full bg-cyan-500" />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Milestones
          </p>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {["Schema stabilized", "QA signoff", "Release candidate"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Milestone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KanbanMock() {
  const columns = ["Backlog", "In Progress", "Done"];
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Sprint Board
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {columns.map((column, idx) => (
          <div
            key={column}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {column}
            </p>
            <div className="mt-2 space-y-2">
              <div className="rounded-md border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                API Contract
              </div>
              <div
                className={`rounded-md border p-2 text-xs shadow-sm ${
                  idx === 1
                    ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {idx === 1 && <GripVertical className="h-3 w-3" aria-hidden="true" />}
                  Drag to QA
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsMock() {
  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Docs
        </p>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          <li className="rounded-md bg-white px-2 py-1 dark:bg-slate-800">API Spec</li>
          <li className="rounded-md px-2 py-1">Auth Flow</li>
          <li className="rounded-md px-2 py-1">Release Notes</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
          <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          API Spec v3
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-2.5 w-5/6 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-2.5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

function ActivityMock() {
  const items = [
    "Maya moved API Contract to In Progress",
    "Lin added release checklist notes",
    "Ethan updated auth acceptance criteria",
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Team Activity
      </h4>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <CircleDashed className="mt-0.5 h-4 w-4 text-slate-400" />
            <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
          </div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="flex items-start gap-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950/40"
        >
          <Activity className="mt-0.5 h-4 w-4 text-cyan-700 dark:text-cyan-300" />
          <p className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
            New: Priya changed priority on Payments Bug to P1
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function RolesIntegrationsMock() {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Access and Connections
      </h4>
      <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="font-semibold text-slate-500">Role</div>
          <div className="font-semibold text-slate-500">Boards</div>
          <div className="font-semibold text-slate-500">Settings</div>
          <div className="text-slate-700 dark:text-slate-300">Engineer</div>
          <div className="text-emerald-700 dark:text-emerald-300">Edit</div>
          <div className="text-rose-700 dark:text-rose-300">No</div>
          <div className="text-slate-700 dark:text-slate-300">Manager</div>
          <div className="text-emerald-700 dark:text-emerald-300">Edit</div>
          <div className="text-emerald-700 dark:text-emerald-300">Yes</div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Integrations
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "GitHub", icon: FolderKanban },
            { label: "Slack", icon: Puzzle },
            { label: "Sentry", icon: ShieldCheck },
            { label: "Jira Import", icon: LayoutGrid },
            { label: "SSO", icon: Users },
          ].map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepMock({ stepId }) {
  if (stepId === "tasks") return <TasksMock />;
  if (stepId === "projects") return <ProjectsMock />;
  if (stepId === "kanban") return <KanbanMock />;
  if (stepId === "docs") return <DocsMock />;
  if (stepId === "activity") return <ActivityMock />;
  return <RolesIntegrationsMock />;
}

export default function FeatureSectionInteractive() {
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <section
      aria-labelledby="feature-preview-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.17),transparent_35%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2
            id="feature-preview-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            Feature Preview
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Explore how Zyplo keeps project context, delivery state, and team coordination aligned.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/70">
            <div
              role="tablist"
              aria-label="Feature steps"
              className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
            >
              {steps.map((step, idx) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    id={`feature-tab-${step.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`feature-panel-${step.id}`}
                    onClick={() => setActiveStep(step.id)}
                    className={`group min-w-max rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:focus-visible:ring-cyan-500 dark:focus-visible:ring-offset-slate-950 lg:min-w-0 ${
                      isActive
                        ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    <p className="mt-1 hidden text-xs lg:block">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                id={`feature-panel-${activeStep}`}
                role="tabpanel"
                aria-labelledby={`feature-tab-${activeStep}`}
                initial={{ opacity: 0, y: 12, x: 8 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -8, x: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {steps[activeIndex].title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {steps[activeIndex].description}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Step {activeIndex + 1}/6
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/40">
                  <StepMock stepId={activeStep} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
