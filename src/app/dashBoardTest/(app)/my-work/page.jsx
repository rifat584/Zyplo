"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, FolderKanban, ListTodo } from "lucide-react";
import { formatDate, fromNow } from "@/app/dashBoardTest/_lib/format";
import { setLastVisited, useMockStore } from "@/components/dashBoardTest/mockStore";

const FILTERS = [
  { key: "assigned", label: "Assigned to me", icon: CheckCircle2 },
  { key: "dueSoon", label: "Due soon", icon: Clock3 },
  { key: "overdue", label: "Overdue", icon: AlertTriangle },
];

function getDayStart(value = new Date()) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function MyWorkPage() {
  const [active, setActive] = useState("assigned");

  const { userId, tasks, projects, workspaces, activity } = useMockStore((state) => ({
    userId: state.currentUser.id,
    tasks: state.tasks,
    projects: state.projects,
    workspaces: state.workspaces,
    activity: [...state.activity].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  }));

  const taskRows = useMemo(() => {
    return tasks
      .filter((task) => task.assignee === userId && task.status !== "done")
      .map((task) => {
        const project = projects.find((projectItem) => projectItem.id === task.projectId) || null;
        const workspace = project ? workspaces.find((workspaceItem) => workspaceItem.id === project.workspaceId) || null : null;
        return { ...task, project, workspace };
      })
      .filter((task) => task.project && task.workspace)
      .sort((a, b) => new Date(a.dueDate || "2999-01-01").getTime() - new Date(b.dueDate || "2999-01-01").getTime());
  }, [tasks, userId, projects, workspaces]);

  const stats = useMemo(() => {
    const today = getDayStart();
    const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const assigned = taskRows.length;
    const dueSoon = taskRows.filter((task) => {
      if (!task.dueDate) return false;
      const due = getDayStart(task.dueDate);
      return due >= today && due <= dueSoonLimit;
    }).length;
    const overdue = taskRows.filter((task) => task.dueDate && getDayStart(task.dueDate) < today).length;

    return { assigned, dueSoon, overdue };
  }, [taskRows]);

  const visibleTasks = useMemo(() => {
    if (active === "assigned") return taskRows;

    const today = getDayStart();
    const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    return taskRows.filter((task) => {
      if (!task.dueDate) return false;
      const due = getDayStart(task.dueDate);
      if (active === "dueSoon") return due >= today && due <= dueSoonLimit;
      if (active === "overdue") return due < today;
      return true;
    });
  }, [active, taskRows]);

  const recentUpdates = useMemo(() => {
    return activity
      .map((entry) => {
        const project = projects.find((projectItem) => projectItem.id === entry.projectId) || null;
        if (!project) return null;
        const workspace = workspaces.find((workspaceItem) => workspaceItem.id === project.workspaceId) || null;
        return { ...entry, project, workspace };
      })
      .filter(Boolean)
      .slice(0, 8);
  }, [activity, projects, workspaces]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">My Work</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tasks assigned to you across all workspaces.</p>
          </div>
          <Link
            href="/dashBoardTest/workspaces"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FolderKanban className="size-4" />
            Open Workspaces
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            {stats.assigned} assigned
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            {stats.dueSoon} due soon
          </span>
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {stats.overdue} overdue
          </span>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActive(filter.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
              active === filter.key
                ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <filter.icon className="size-3.5" />
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Task Queue</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
              <ListTodo className="size-3.5" />
              {visibleTasks.length} items
            </span>
          </div>

          <div className="space-y-2">
            {visibleTasks.map((task) => {
              const overdue = task.dueDate && new Date(task.dueDate) < new Date();
              return (
                <Link
                  key={task.id}
                  href={`/dashBoardTest/w/${task.workspace.id}/p/${task.project.id}/list`}
                  onClick={() => setLastVisited(task.workspace.id, task.project.id, "list")}
                  className="block rounded-xl border border-slate-200 p-3 transition hover:border-indigo-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        task.priority === "P1"
                          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                          : task.priority === "P2"
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {task.workspace.name} · {task.project.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={`font-medium ${overdue ? "text-rose-600 dark:text-rose-300" : "text-slate-500 dark:text-slate-400"}`}>
                      {task.dueDate ? `Due ${formatDate(task.dueDate)}` : "No due date"}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{task.status}</span>
                  </div>
                </Link>
              );
            })}
            {visibleTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                No tasks in this bucket.
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Recent Updates</h2>
          <div className="space-y-2">
            {recentUpdates.map((entry) => (
              <Link
                key={entry.id}
                href={`/dashBoardTest/w/${entry.workspace.id}/p/${entry.project.id}/activity`}
                onClick={() => setLastVisited(entry.workspace.id, entry.project.id, "activity")}
                className="block rounded-xl border border-slate-200 p-3 transition hover:border-cyan-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-cyan-500/30 dark:hover:bg-slate-800"
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">
                  <span className="font-semibold">{entry.actor}</span> {entry.message}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {entry.workspace.name} · {entry.project.name} · {fromNow(entry.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
