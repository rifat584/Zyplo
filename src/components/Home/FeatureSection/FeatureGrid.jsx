import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Circle,
  Github,
  Layers3,
  MessageSquare,
  Rocket,
  Slack,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const kanbanColumns = [
  {
    title: "Backlog",
    tasks: [
      { title: "Refactor auth middleware", due: "Mar 4" },
    ],
  },
  {
    title: "In Progress",
    tasks: [
      { title: "Fix race condition in sync", priority: "P1", avatar: "RK" },
    ],
  },
  {
    title: "Review",
    tasks: [
      { title: "Review PR #142" },
    ],
  },
];

const tasksList = [
  { label: "Patch stale cache bug", status: "done" },
  { label: "Write migration notes", status: "active" },
  { label: "QA billing edge case", status: "idle" },
];

const projects = [
  { name: "Web App Core", progress: 74, members: 6 },
  { name: "API v2 Rollout", progress: 48, members: 4 },
];

const notifications = [
  { title: "PR #142 linked to Sprint Board", time: "Just now", icon: Bell },
  { title: "Mentioned in Docs: API pagination", time: "1h", icon: MessageSquare },
];

const integrations = [
  { name: "GitHub", state: "Connected", icon: Github },
  { name: "Vercel", state: "Connected", icon: Rocket },
  { name: "Slack", state: "Connected", icon: Slack },
  { name: "Linear", state: "Connected", icon: Layers3 },
];

const milestones = [
  { label: "Auth hardening", status: "Planned" },
  { label: "API v2 beta", status: "In Progress" },
  { label: "Staging rollout", status: "Planned" },
];

export function FeatureGrid() {
  return (
    <motion.div
      // Keep the section-level reveal simple and consistent.
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto mt-12 w-full max-w-5xl"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-6 lg:col-span-6 lg:order-1"
        >
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Kanban Boards</h3>
              <span className="text-[11px] text-zinc-500">Sprint Board</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {kanbanColumns.map((column) => (
                <div key={column.title} className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{column.title}</p>
                  </div>
                  <div className="space-y-1.5">
                    {column.tasks.map((task) => (
                      <motion.div
                        key={task.title}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="rounded-lg border border-zinc-200 bg-white p-2 text-[11px]"
                      >
                        <p className="line-clamp-2 font-medium text-zinc-800">{task.title}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {task.priority ? (
                              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">
                                {task.priority}
                              </span>
                            ) : null}
                            {task.due ? <span className="rounded-full border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600">{task.due}</span> : null}
                          </div>
                          {task.avatar ? (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[9px] font-semibold text-zinc-700">
                              {task.avatar}
                            </span>
                          ) : null}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-6 lg:col-span-6 lg:order-7"
        >
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm">
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] text-zinc-500">Task Details</p>
                  <h3 className="text-sm font-semibold text-zinc-900">Fix race condition in sync</h3>
                </div>
                <span className="inline-flex h-5 items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 text-[10px] text-cyan-700">
                  In Progress
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2">
                  <p className="font-medium text-zinc-700">Checklist</p>
                  <p className="mt-0.5">2/5 done</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2">
                  <p className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Assignee: Rifat K
                  </p>
                  <p className="mt-1">Due date: Mar 4</p>
                </div>
                <p className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2">
                  Notes: Verify lock around websocket reconcile path.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-2 lg:col-span-4 lg:order-3"
        >
          <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Tasks</h4>
              <span className="inline-flex h-5 items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 text-[10px] text-zinc-700">
                Quick add
              </span>
            </div>
            <div className="space-y-2">
              {tasksList.map((task) => (
                <div key={task.label} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 text-xs">
                  {task.status === "done" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />
                  ) : task.status === "active" ? (
                    <Circle className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-zinc-300" />
                  )}
                  <span className="line-clamp-1 text-zinc-700">{task.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-2 lg:col-span-4 lg:order-4"
        >
          <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm">
            <h4 className="mb-2 text-sm font-semibold text-zinc-900">Projects</h4>
            <div className="space-y-2.5">
              {projects.map((project) => (
                <div key={project.name} className="rounded-lg border border-zinc-200 bg-white/85 px-2.5 py-2">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <p className="font-medium text-zinc-700">{project.name}</p>
                    <span className="text-zinc-500">{project.members} members</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-2 lg:col-span-4 lg:order-5"
        >
          <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Notifications</h4>
              <Bell className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="space-y-2">
              {notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2">
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 text-cyan-600" />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-xs text-zinc-700">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-500">{item.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-3 lg:col-span-6 lg:order-2"
        >
          <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Integrations</h4>
              <span className="inline-flex h-5 items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 text-[10px] text-cyan-700">
                6 Connected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {integrations.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 text-xs">
                    <Icon className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium text-zinc-700">{item.name}</span>
                    <span className="text-zinc-500">{item.state}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          whileHover={{ y: -2 }}
          className="col-span-1 md:col-span-3 lg:col-span-6 lg:order-6"
        >
          <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-900">Roadmaps</h4>
              <span className="text-[11px] text-zinc-500">Q2 Milestones</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {milestones.map((milestone) => (
                <div
                  key={milestone.label}
                  className={[
                    "rounded-lg border px-2.5 py-2",
                    milestone.status === "In Progress"
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-zinc-200 bg-zinc-50/70 text-zinc-700",
                  ].join(" ")}
                >
                  <p className="font-medium">{milestone.label}</p>
                  <p className="mt-1 text-[11px] opacity-70">{milestone.status}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
