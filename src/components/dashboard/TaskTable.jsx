"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, CalendarDays, CheckSquare } from "lucide-react";
import { useMockStore } from "./mockStore";
import { Avatar, PriorityPill, StatusDot } from "./ui";
import { formatDate } from "@/app/(dashboard)/dashboard/_lib/format";
import TaskDrawer from "./TaskDrawer";

function applyFilters(tasks, filters, search, userId) {
  const lower = search.toLowerCase().trim();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return tasks.filter((task) => {
    if (filters.mine && task.assignee !== userId) return false;
    if (filters.p1 && task.priority !== "P1") return false;
    if (filters.dueSoon) {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
      const until = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      if (dueDay > until || dueDay < today) return false;
    }
    if (filters.overdue) {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
      if (dueDay >= today || task.status === "done") return false;
    }
    if (lower && !`${task.title} ${task.tags.join(" ")} ${task.description || ""}`.toLowerCase().includes(lower)) return false;
    return true;
  });
}

function dueTone(dueDate, status) {
  if (!dueDate) return "text-slate-500 dark:text-slate-400";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueDate);
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  if (status !== "done" && dueDay < today) return "text-rose-600 dark:text-rose-300";
  if (dueDay.getTime() === today.getTime()) return "text-amber-600 dark:text-amber-300";
  return "text-slate-600 dark:text-slate-300";
}

export default function TaskTable({ workspaceId, projectId, filters, search }) {
  const [sort, setSort] = useState("updated");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const { tasks, members, userId } = useMockStore((s) => ({
    tasks: s.tasks.filter((task) => task.projectId === projectId),
    members: s.workspaces.find((workspace) => workspace.id === workspaceId)?.members || [],
    userId: s.currentUser.id,
  }));

  const filtered = useMemo(() => {
    const prepared = applyFilters(tasks, filters, search, userId);
    if (sort === "priority") {
      const order = { P1: 1, P2: 2, P3: 3 };
      return [...prepared].sort((a, b) => order[a.priority] - order[b.priority]);
    }
    if (sort === "due") {
      return [...prepared].sort((a, b) => new Date(a.dueDate || "2999-01-01") - new Date(b.dueDate || "2999-01-01"));
    }
    return prepared;
  }, [tasks, filters, search, userId, sort]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Tasks</p>
        <button
          type="button"
          onClick={() => setSort((prev) => (prev === "priority" ? "due" : prev === "due" ? "updated" : "priority"))}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowUpDown className="size-3" />
          Sort: {sort}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Assignee</th>
              <th className="px-4 py-2">Due</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task) => {
              const assignee = members.find((member) => member.id === task.assignee);
              const taskKey = `PMTZ-${task.id.replace(/\D+/g, "") || "0"}`;
              return (
                <tr
                  key={task.id}
                  className="cursor-pointer border-t border-slate-100 align-top hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800/60"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-100">
                    <p className="font-medium">{task.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <CheckSquare className="size-3.5 text-indigo-500" />
                        {taskKey}
                      </span>
                      {task.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-md border border-slate-200 px-1.5 py-0.5 text-slate-500 dark:border-white/10 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <StatusDot status={task.status} /> {task.status.replace("inprogress", "in progress").replace("inreview", "in review")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityPill priority={task.priority} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-2">
                      {assignee ? <Avatar name={assignee.name} className="size-6 text-[10px]" /> : null}
                      {assignee?.name || "-"}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${dueTone(task.dueDate, task.status)}`}>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No tasks match this filter or search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TaskDrawer
        open={Boolean(selectedTask)}
        task={selectedTask}
        workspaceId={workspaceId}
        onOpenChange={() => setSelectedTaskId("")}
      />
    </div>
  );
}
