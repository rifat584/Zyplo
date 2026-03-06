"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMockStore } from "@/components/dashboard/mockStore";

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { projects, tasks, members } = useMockStore((state) => ({
    projects: state.projects || [],
    tasks: state.tasks || [],
    members: state.workspaces.find((item) => item.id === workspaceId)?.members || [],
  }));

  const workspaceProjects = useMemo(
    () => projects.filter((item) => item.workspaceId === workspaceId),
    [projects, workspaceId]
  );
  const workspaceTasks = useMemo(
    () => tasks.filter((item) => item.workspaceId === workspaceId),
    [tasks, workspaceId]
  );

  const counts = useMemo(() => {
    const result = { todo: 0, inprogress: 0, inreview: 0, done: 0 };
    workspaceTasks.forEach((task) => {
      const status = task.status || "todo";
      if (result[status] !== undefined) result[status] += 1;
    });
    return result;
  }, [workspaceTasks]);

  const totalTasks = workspaceTasks.length;
  const donePct = totalTasks ? Math.round((counts.done / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks ? Math.round((counts.inprogress / totalTasks) * 100) : 0;
  const todoPct = totalTasks ? Math.round((counts.todo / totalTasks) * 100) : 0;
  const reviewPct = totalTasks ? Math.round((counts.inreview / totalTasks) * 100) : 0;

  const recentItems = useMemo(() => {
    return [...workspaceTasks]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 8);
  }, [workspaceTasks]);

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-4">
        <Card title="Projects" value={String(workspaceProjects.length)} />
        <Card title="Members" value={String(members.length)} />
        <Card title="To Do" value={String(counts.todo)} />
        <Card title="Completed" value={`${counts.done}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Status Overview
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div
              className="relative size-40 rounded-full"
              style={{
                background: `conic-gradient(#16a34a 0% ${donePct}%, #0891b2 ${donePct}% ${donePct + inProgressPct}%, #7c3aed ${donePct + inProgressPct}% ${donePct + inProgressPct + reviewPct}%, #94a3b8 ${donePct + inProgressPct + reviewPct}% 100%)`,
              }}
            >
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white text-center dark:bg-slate-900">
                <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{totalTasks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total tasks</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <Legend label={`Done: ${counts.done}`} color="bg-green-600" />
              <Legend label={`In Progress: ${counts.inprogress}`} color="bg-cyan-600" />
              <Legend label={`In Review: ${counts.inreview}`} color="bg-violet-600" />
              <Legend label={`To Do: ${counts.todo}`} color="bg-slate-400" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Throughput (Tasks by Stage)
          </h2>
          <div className="mt-6 space-y-4">
            <Bar label="Done" value={counts.done} total={Math.max(1, totalTasks)} color="bg-green-600" />
            <Bar label="In Progress" value={counts.inprogress} total={Math.max(1, totalTasks)} color="bg-cyan-600" />
            <Bar label="In Review" value={counts.inreview} total={Math.max(1, totalTasks)} color="bg-violet-600" />
            <Bar label="To Do" value={counts.todo} total={Math.max(1, totalTasks)} color="bg-slate-500" />
          </div>
          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
            Completion rate: {donePct}% | In-progress load: {inProgressPct}% | Pending: {todoPct}%
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentItems.map((task) => (
            <div key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                {(task.assigneeName || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  <span className="font-medium">{task.assigneeName || "Someone"}</span> updated
                  <span className="font-medium"> {task.title}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {task.projectName || "No project"} | {task.status || "todo"} | {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown time"}
                </p>
              </div>
            </div>
          ))}
          {!recentItems.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Legend({ label, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block size-2.5 rounded-full ${color}`} />
      <span className="text-slate-700 dark:text-slate-300">{label}</span>
    </div>
  );
}

function Bar({ label, value, total, color }) {
  const widthPct = Math.max(6, Math.round((value / total) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  );
}
