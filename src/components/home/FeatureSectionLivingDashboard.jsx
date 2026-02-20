"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Bell,
  BookText,
  CalendarDays,
  CircleDot,
  Clock3,
  FileText,
  FolderGit2,
  GitPullRequest,
  LayoutGrid,
  Link2,
  MessageSquare,
  Puzzle,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const kanbanColumns = [
  {
    id: "backlog",
    name: "Backlog",
    icon: LayoutGrid,
    tasks: [
      {
        id: "task-auth-middleware",
        title: "Refactor auth middleware",
        due: "Today",
        priority: "High",
        comments: 6,
        assignees: ["AL", "RP"],
        status: "Queued",
        description:
          "Split token validation from route guards and isolate tenant checks for cleaner test coverage.",
        activity: [
          "Maya linked auth fallback notes.",
          "Rifat added middleware benchmark results.",
          "Lipi confirmed route matrix coverage.",
        ],
      },
      {
        id: "task-docs-pagination",
        title: "Docs: API pagination notes",
        due: "Thu",
        priority: "Med",
        comments: 2,
        assignees: ["RP", "MK"],
        status: "Queued",
        description:
          "Document cursor guarantees and backfill behavior before API v2 cutover.",
        activity: [
          "Priya updated cursor examples.",
          "Al Helal added QA checklist links.",
        ],
      },
    ],
  },
  {
    id: "in-progress",
    name: "In Progress",
    icon: Clock3,
    tasks: [
      {
        id: "task-sync-race",
        title: "Fix race condition in sync",
        due: "Wed",
        priority: "High",
        comments: 9,
        assignees: ["MK", "TN", "RP"],
        status: "In Progress",
        description:
          "Retry sync on stale websocket sessions and prevent duplicate state writes during reconnect.",
        activity: [
          "Priya updated acceptance checks.",
          "Maya linked release checklist.",
          "Rifat added sync failure logs.",
        ],
      },
      {
        id: "task-review-pr-142",
        title: "Review PR #142",
        due: "Today",
        priority: "Med",
        comments: 4,
        assignees: ["TN", "AL"],
        status: "Review",
        description:
          "Validate API naming consistency and rollback behavior before merge into release branch.",
        activity: [
          "Lin requested API naming updates.",
          "Maya attached QA notes.",
          "Rifat added rollback checklist.",
        ],
      },
    ],
  },
  {
    id: "review",
    name: "Review",
    icon: GitPullRequest,
    tasks: [
      {
        id: "task-deploy-132",
        title: "Deploy v1.3.2 to staging",
        due: "Now",
        priority: "High",
        comments: 3,
        assignees: ["JD", "LP"],
        status: "Review",
        description:
          "Promote staging build and validate migration logs, notifications, and session continuity.",
        activity: [
          "Israt attached deployment notes.",
          "Lipi approved staging readiness.",
        ],
      },
      {
        id: "task-org-roles-matrix",
        title: "Add org roles matrix",
        due: "Fri",
        priority: "Low",
        comments: 1,
        assignees: ["PS", "MK"],
        status: "Review",
        description:
          "Finalize member/admin visibility matrix and confirm settings scope for workspace-level changes.",
        activity: [
          "Rifat linked permission docs.",
          "Maya reviewed role inheritance notes.",
        ],
      },
    ],
  },
];

const docsPreviewLines = [
  "API Pagination Notes",
  "Cursor strategy",
  "Backfill edge cases",
  "Keep page boundaries deterministic",
  "Guard race paths during sync retries",
];

const projects = [
  {
    id: "project-web-core",
    name: "Web App Core",
    status: "On track",
    progress: 68,
    owners: ["MK", "TN", "PS"],
  },
  {
    id: "project-billing-plans",
    name: "Billing & Plans",
    status: "At risk",
    progress: 42,
    owners: ["AL", "RP"],
  },
  {
    id: "project-api-v2",
    name: "API v2 Rollout",
    status: "On track",
    progress: 81,
    owners: ["JD", "LP", "MK"],
  },
];

const notificationToggles = [
  { id: "release-blockers", label: "Release blockers", enabled: true },
  { id: "mentions-replies", label: "Mentions & replies", enabled: true },
  { id: "assigned-to-me", label: "Assigned to me", enabled: true },
  { id: "pr-linked", label: "PR linked", enabled: true },
  { id: "daily-summary", label: "Daily summary", enabled: false },
];

const roles = [
  { role: "Admin", boards: "Edit", admin: "Yes" },
  { role: "Member", boards: "Edit", admin: "No" },
];

const integrations = ["GitHub", "Slack", "Sentry", "Vercel", "Linear", "Notion", "+12"];

const activityItems = [
  "Israt moved Review PR #142 to done",
  "Al Helal linked API pagination docs to board",
  "Lipi changed release priority to High",
];

const mobileTourTabs = [
  { id: "tasks", label: "Tasks" },
  { id: "docs", label: "Docs" },
  { id: "activity", label: "Activity" },
  { id: "roles", label: "Roles & Integrations" },
  { id: "notifications", label: "Notifications" },
];

function Avatar({ initials }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {initials}
    </span>
  );
}

function KanbanTaskCard({ task, selected, reducedMotion, onSelect }) {
  const priorityClass =
    task.priority === "High"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
      : task.priority === "Med"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={reducedMotion ? {} : { y: -2, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: EASE }}
      className={`w-full rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
        selected
          ? "border-cyan-400 bg-cyan-50/90 dark:border-cyan-700 dark:bg-cyan-950/35"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className={`rounded-full border px-1.5 py-0.5 ${priorityClass}`}>{task.priority}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <CalendarDays className="h-3 w-3" />
          {task.due}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <MessageSquare className="h-3 w-3" />
          {task.comments}
        </span>
      </div>
    </motion.button>
  );
}

function SelectedTaskPanel({ selectedTask, compact = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Selected task
        </p>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{selectedTask.comments} comments</span>
      </div>

      <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedTask.title}</h4>
      {!compact && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{selectedTask.description}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          {selectedTask.priority}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <CalendarDays className="h-3 w-3" />
          {selectedTask.due}
        </span>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
          {selectedTask.status}
        </span>
      </div>

      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Assignees</p>
        <div className="mt-1 flex items-center gap-1.5">
          {selectedTask.assignees.map((initials) => (
            <Avatar key={initials} initials={initials} />
          ))}
        </div>
      </div>

      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <BookText className="h-3 w-3" />
          Docs: API pagination notes
        </span>
      </div>

      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Activity History</p>
        <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          {selectedTask.activity.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-1">
              <CircleDot className="mt-0.5 h-3 w-3 text-cyan-600 dark:text-cyan-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProjectsCard({ reducedMotion, limit }) {
  const list = typeof limit === "number" ? projects.slice(0, limit) : projects;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Projects</h3>
        <FolderGit2 className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track scope, progress, and owners in one glance.</p>

      <div className="mt-3 space-y-2.5">
        {list.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">{project.name}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  project.status === "On track"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {project.status}
              </span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: reducedMotion ? `${project.progress}%` : 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE }}
                className="h-2 rounded-full bg-cyan-500"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{project.progress}%</span>
              <div className="flex items-center gap-1">
                {project.owners.map((owner) => (
                  <Avatar key={`${project.id}-${owner}`} initials={owner} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsCard({ minimal = false }) {
  const list = minimal ? notificationToggles.slice(0, 3) : notificationToggles;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
        <div className="relative">
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </div>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Notification preferences for delivery-critical updates.</p>

      <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
        {list.map((item) => (
          <label
            key={item.id}
            className="flex min-h-10 cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30"
          >
            {item.label}
            <span className={`h-3 w-6 rounded-full ${item.enabled ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-600"}`} />
          </label>
        ))}
      </div>

      {!minimal && (
        <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Channels</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {[
              { label: "In-app", active: true },
              { label: "Email", active: true },
              { label: "Slack", active: false },
            ].map((channel) => (
              <span
                key={channel.label}
                className={`rounded-full border px-2 py-0.5 text-[11px] ${
                  channel.active
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300"
                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {channel.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RolesIntegrationsCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Roles & Integrations</h3>
        <ShieldCheck className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Permission sanity, not permission spaghetti.</p>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200/80 dark:border-slate-700/80">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.6fr] bg-slate-200/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <span>Role</span>
          <span>Boards</span>
          <span>Admin</span>
        </div>
        {roles.map((row) => (
          <div
            key={row.role}
            className="grid grid-cols-[1.1fr_0.8fr_0.6fr] items-center bg-white px-2.5 py-1.5 text-[11px] text-slate-700 transition hover:bg-cyan-50/70 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-cyan-950/30"
          >
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {row.role}
            </span>
            <span>{row.boards}</span>
            <span className={row.admin === "Yes" ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
              {row.admin}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-slate-200 pt-2.5 dark:border-slate-700">
        <div className="mb-2.5">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Integrations</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">6 connected · 2 pending</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {integrations.map((name) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-[11px] font-semibold text-slate-500 opacity-75 grayscale transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:shadow-[0_8px_20px_rgba(34,211,238,0.16)]"
            >
              {name === "+12" ? (
                <span className="text-[11px] font-semibold">+12</span>
              ) : (
                <Puzzle className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeatureSectionLivingDashboard() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 10]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 6]);

  const [heroHovered, setHeroHovered] = useState(false);
  const [activeColumn, setActiveColumn] = useState("in-progress");
  const [selectedTaskId, setSelectedTaskId] = useState("task-sync-race");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("tasks");

  const allTasks = useMemo(
    () => kanbanColumns.flatMap((column) => column.tasks.map((task) => ({ ...task, columnId: column.id }))),
    [],
  );
  const selectedTask = allTasks.find((task) => task.id === selectedTaskId) ?? allTasks[0];
  const mobileActiveColumn = kanbanColumns.find((column) => column.id === activeColumn) ?? kanbanColumns[0];

  const setSelection = (taskId, columnId) => {
    setSelectedTaskId(taskId);
    setActiveColumn(columnId);
  };

  return (
    <section
      aria-labelledby="living-dashboard-features-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_8%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_88%_2%,rgba(59,130,246,0.14),transparent_34%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-3xl">
          <h2
            id="living-dashboard-features-heading"
            className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl"
          >
            A dashboard that feels like shipping.
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Tasks, Projects, Kanban Boards, Docs, Activity History, Notifications,
            Roles, and Integrations in one place for teams shipping on web cadence.
          </p>
        </header>

        <motion.div style={{ y: fgY }} className="relative mt-8 space-y-4 overflow-hidden sm:mt-10 sm:space-y-6">
          <motion.div
            style={{ y: bgY }}
            className="pointer-events-none absolute -inset-3 -z-10 hidden overflow-hidden rounded-[28px] border border-slate-300/40 bg-slate-100/60 opacity-[0.14] blur-[1.5px] [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_100%)] dark:border-slate-700/50 dark:bg-slate-900/60 lg:block"
          >
            <div className="flex h-full">
              <aside className="w-52 border-r border-slate-300/60 p-4 dark:border-slate-700/50">
                <div className="h-7 w-28 rounded-md bg-slate-300/80 dark:bg-slate-700/70" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-300/80 dark:bg-slate-700/70" />
                  <div className="h-3 w-20 rounded bg-slate-300/80 dark:bg-slate-700/70" />
                  <div className="h-3 w-16 rounded bg-slate-300/80 dark:bg-slate-700/70" />
                </div>
              </aside>
              <div className="flex-1">
                <div className="flex h-11 items-center justify-between border-b border-slate-300/60 px-4 dark:border-slate-700/50">
                  <div className="text-[10px] text-slate-500 dark:text-slate-300">Zyplo • Web App Core</div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full border border-slate-300/70 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-300">
                      feature/dashboard-redesign
                    </span>
                    <span className="rounded-full border border-slate-300/70 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-300">
                      v1.3.2
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4">
                  <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
                  <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
                  <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile guided tour */}
          <div className="space-y-4 sm:hidden">
            <article className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kanban Boards</h3>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  Preview task
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                {kanbanColumns.map((column) => (
                  <button
                    key={column.id}
                    type="button"
                    onClick={() => setActiveColumn(column.id)}
                    className={`min-h-10 rounded-md px-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                      activeColumn === column.id
                        ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                        : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {column.name}
                  </button>
                ))}
              </div>

              <div className="mt-3 space-y-2">
                {mobileActiveColumn.tasks.map((task) => (
                  <KanbanTaskCard
                    key={task.id}
                    task={task}
                    selected={task.id === selectedTaskId}
                    reducedMotion={reducedMotion}
                    onSelect={() => {
                      setSelection(task.id, mobileActiveColumn.id);
                      setIsDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Feature Tour</h3>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {mobileTourTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMobileTab(tab.id)}
                    className={`min-h-10 shrink-0 rounded-lg border px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                      mobileTab === tab.id
                        ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                {mobileTab === "tasks" && (
                  <div className="space-y-1.5">
                    {allTasks.slice(0, 3).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          setSelection(task.id, task.columnId);
                          setIsDrawerOpen(true);
                        }}
                        className={`min-h-10 w-full rounded-lg border px-2.5 py-1.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          task.id === selectedTaskId
                            ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span className="block truncate">{task.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {mobileTab === "docs" && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800">
                    {docsPreviewLines.map((line, idx) => (
                      <div key={line} className="rounded px-1 py-0.5 text-slate-700 dark:text-slate-200">
                        {idx >= 3 ? `• ${line}` : idx > 0 ? `${idx}. ${line}` : line}
                      </div>
                    ))}
                  </div>
                )}

                {mobileTab === "activity" && (
                  <div className="space-y-1.5 text-xs">
                    {activityItems.map((item) => (
                      <p
                        key={item}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {mobileTab === "roles" && (
                  <div className="space-y-3">
                    <RolesIntegrationsCard />
                  </div>
                )}

                {mobileTab === "notifications" && <NotificationsCard minimal />}
              </div>
            </article>

            <ProjectsCard reducedMotion={reducedMotion} limit={2} />
          </div>

          {/* Tablet layout */}
          <div className="hidden space-y-4 sm:block lg:hidden">
            <article
              className={`relative overflow-hidden rounded-2xl border bg-white/95 p-5 shadow-sm transition-all dark:bg-slate-900/90 ${
                heroHovered ? "border-cyan-300 dark:border-cyan-700" : "border-slate-200/90 dark:border-slate-800"
              }`}
              onMouseEnter={() => setHeroHovered(true)}
              onMouseLeave={() => setHeroHovered(false)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Kanban Boards</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Move from backlog to release without losing context.</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen((prev) => !prev)}
                  className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  Preview task
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {kanbanColumns.map((column) => {
                  const ColumnIcon = column.icon;
                  const columnActive = activeColumn === column.id;
                  return (
                    <div
                      key={column.id}
                      className={`rounded-xl border p-2.5 ${
                        columnActive
                          ? "border-cyan-400 bg-cyan-50/80 dark:border-cyan-700 dark:bg-cyan-950/35"
                          : "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveColumn(column.id)}
                        className="flex w-full items-center justify-between rounded-md px-1 py-0.5 text-[11px] font-semibold text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400"
                      >
                        <span className="inline-flex items-center gap-1">
                          <ColumnIcon className="h-3.5 w-3.5" />
                          {column.name} ({column.tasks.length})
                        </span>
                      </button>

                      <div className="mt-2 space-y-2 border-t border-slate-200/80 pt-2 dark:border-slate-700/80">
                        {column.tasks.map((task) => (
                          <KanbanTaskCard
                            key={task.id}
                            task={task}
                            selected={task.id === selectedTaskId}
                            reducedMotion={reducedMotion}
                            onSelect={() => setSelection(task.id, column.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <SelectedTaskPanel selectedTask={selectedTask} compact />
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tasks</h3>
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Keep work crisp. No orphan to-dos.</p>
                  <div className="mt-3 space-y-1.5">
                    {allTasks.slice(1, 4).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => setSelection(task.id, task.columnId)}
                        className={`min-h-10 w-full rounded-lg border px-2 py-1.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          task.id === selectedTaskId
                            ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span className="block truncate">{task.title}</span>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Docs</h3>
                    <FileText className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Specs next to the work that ships them.</p>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs select-none dark:border-slate-700 dark:bg-slate-800">
                    {docsPreviewLines.map((line, idx) => (
                      <div key={line} className="rounded px-1 py-0.5 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200">
                        {idx >= 3 ? `• ${line}` : idx > 0 ? `${idx}. ${line}` : line}
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <div className="space-y-4">
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Activity History</h3>
                    <GitPullRequest className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Audit trail without the noise.</p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    {activityItems.map((item) => (
                      <p key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {item}
                      </p>
                    ))}
                    <motion.p
                      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [-8, 0, 0, -5] }}
                      transition={reducedMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, repeatDelay: 1.2, ease: EASE }}
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                    >
                      New: Rifat linked org roles matrix.
                    </motion.p>
                  </div>
                </article>

                <RolesIntegrationsCard />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ProjectsCard reducedMotion={reducedMotion} />
              <NotificationsCard />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:block">
            <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              <motion.article
                initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                viewport={{ once: true, amount: 0.2 }}
                className={`group relative overflow-hidden rounded-2xl border bg-white/95 p-6 shadow-md transition-all dark:bg-slate-900/90 ${
                  heroHovered ? "border-cyan-300 shadow-cyan-500/15 dark:border-cyan-700" : "border-slate-200/90 dark:border-slate-800"
                }`}
                onMouseEnter={() => setHeroHovered(true)}
                onMouseLeave={() => setHeroHovered(false)}
              >
                <div className="pointer-events-none absolute -top-14 left-0 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-700/20" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Kanban Boards</p>
                      <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Move from backlog to release without losing context.</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen((prev) => !prev)}
                      className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      Preview task
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {kanbanColumns.map((column) => {
                      const ColumnIcon = column.icon;
                      const columnActive = activeColumn === column.id;

                      return (
                        <div
                          key={column.id}
                          className={`rounded-xl border p-2.5 ${
                            columnActive
                              ? "border-cyan-400 bg-cyan-50/80 dark:border-cyan-700 dark:bg-cyan-950/35"
                              : "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveColumn(column.id)}
                            className="flex w-full items-center justify-between rounded-md px-1 py-0.5 text-[11px] font-semibold text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400"
                          >
                            <span className="inline-flex items-center gap-1">
                              <ColumnIcon className="h-3.5 w-3.5" />
                              {column.name} ({column.tasks.length})
                            </span>
                            {columnActive && (
                              <span className="rounded-full border border-cyan-200 bg-cyan-100 px-1.5 py-0.5 text-[10px] text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
                                Selected
                              </span>
                            )}
                          </button>
                          <div className="mt-2 space-y-2 border-t border-slate-200/80 pt-2 dark:border-slate-700/80">
                            {column.tasks.map((task) => (
                              <KanbanTaskCard
                                key={task.id}
                                task={task}
                                selected={task.id === selectedTaskId}
                                reducedMotion={reducedMotion}
                                onSelect={() => setSelection(task.id, column.id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <SelectedTaskPanel selectedTask={selectedTask} />
                  </div>
                </div>

                <AnimatePresence>
                  {isDrawerOpen && (
                    <motion.aside
                      initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8, x: 24 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, x: 18 }}
                      transition={{ duration: reducedMotion ? 0 : 0.24, ease: EASE }}
                      className="absolute bottom-4 right-4 w-[330px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedTask.title}</p>
                        <button
                          type="button"
                          onClick={() => setIsDrawerOpen(false)}
                          className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                          aria-label="Close selected task drawer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{selectedTask.description}</p>
                    </motion.aside>
                  )}
                </AnimatePresence>
              </motion.article>

              <div className="grid gap-4">
                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tasks</h3>
                    <CalendarDays className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Keep work crisp. No orphan to-dos.</p>
                  <div className="mt-3 space-y-1.5">
                    {allTasks.slice(1, 4).map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => setSelection(task.id, task.columnId)}
                        className={`min-h-10 w-full rounded-lg border px-2 py-1.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          task.id === selectedTaskId
                            ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span className="block truncate">{task.title}</span>
                      </button>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Docs</h3>
                    <FileText className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Specs next to the work that ships them.</p>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs select-none dark:border-slate-700 dark:bg-slate-800">
                    {docsPreviewLines.map((line, idx) => (
                      <div key={line} className="rounded px-1 py-0.5 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200">
                        {idx >= 3 ? `• ${line}` : idx > 0 ? `${idx}. ${line}` : line}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Activity History</h3>
                    <GitPullRequest className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Audit trail without the noise.</p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    {activityItems.map((item) => (
                      <p key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {item}
                      </p>
                    ))}
                    <motion.p
                      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [-8, 0, 0, -5] }}
                      transition={reducedMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, repeatDelay: 1.2, ease: EASE }}
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                    >
                      New: Rifat linked org roles matrix.
                    </motion.p>
                  </div>
                </article>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <ProjectsCard reducedMotion={reducedMotion} />
              <NotificationsCard />
              <RolesIntegrationsCard />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 sm:hidden"
            onClick={() => setIsDrawerOpen(false)}
          >
            <motion.div
              initial={reducedMotion ? { y: 0 } : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reducedMotion ? { y: 0, opacity: 0 } : { y: 24, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: EASE }}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedTask.title}</h4>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-md p-1 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-300"
                  aria-label="Close selected task details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SelectedTaskPanel selectedTask={selectedTask} compact={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
