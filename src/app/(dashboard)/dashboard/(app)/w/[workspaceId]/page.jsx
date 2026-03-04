"use client";

import Link from "next/link";
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

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7DaysTasks = useMemo(
    () =>
      workspaceTasks.filter((task) => {
        const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : 0;
        return createdAt >= sevenDaysAgo;
      }),
    [workspaceTasks, sevenDaysAgo]
  );

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

  const recentCompleted = last7DaysTasks.filter((task) => (task.status || "todo") === "done").length;
  const recentCreated = last7DaysTasks.length;
  const recentUpdated = last7DaysTasks.filter((task) => {
    const status = task.status || "todo";
    return status === "inprogress" || status === "inreview";
  }).length;
  const dueSoon = workspaceTasks.filter((task) => {
    if (!task.dueDate || (task.status || "todo") === "done") return false;
    const due = new Date(task.dueDate).getTime();
    return due >= Date.now() && due <= Date.now() + 7 * 24 * 60 * 60 * 1000;
  }).length;

  const priorityCounts = useMemo(() => {
    const result = { P1: 0, P2: 0, P3: 0 };
    workspaceTasks.forEach((task) => {
      const p = task.priority || "P2";
      if (result[p] !== undefined) result[p] += 1;
    });
    return result;
  }, [workspaceTasks]);

  const typeCounts = useMemo(() => {
    const result = { feature: 0, bug: 0, chore: 0 };
    workspaceTasks.forEach((task) => {
      const text = `${task.title || ""} ${task.description || ""}`.toLowerCase();
      if (text.includes("bug") || text.includes("fix") || text.includes("issue")) {
        result.bug += 1;
      } else if (text.includes("refactor") || text.includes("chore") || text.includes("cleanup") || text.includes("docs")) {
        result.chore += 1;
      } else {
        result.feature += 1;
      }
    });
    return result;
  }, [workspaceTasks]);

  const teamWorkload = useMemo(() => {
    return members.map((member) => {
      const assigned = workspaceTasks.filter((task) => task.assigneeId === member.id);
      const active = assigned.filter((task) => {
        const status = task.status || "todo";
        return status === "todo" || status === "inprogress" || status === "inreview";
      }).length;
      const done = assigned.filter((task) => (task.status || "todo") === "done").length;
      return {
        id: member.id,
        name: member.name,
        active,
        done,
        total: assigned.length,
      };
    });
  }, [members, workspaceTasks]);

  const maxWorkload = Math.max(1, ...teamWorkload.map((item) => item.active));
  const maxPriority = Math.max(1, priorityCounts.P1, priorityCounts.P2, priorityCounts.P3);
  const typeTotal = Math.max(1, typeCounts.feature + typeCounts.bug + typeCounts.chore);
  const typeRows = [
    { id: "feature", label: "Feature", value: typeCounts.feature, color: "bg-indigo-600" },
    { id: "bug", label: "Bug", value: typeCounts.bug, color: "bg-rose-600" },
    { id: "chore", label: "Chore", value: typeCounts.chore, color: "bg-slate-600" },
  ];
  const priorityRows = [
    { id: "p1", label: "High", value: priorityCounts.P1, color: "bg-rose-600" },
    { id: "p2", label: "Medium", value: priorityCounts.P2, color: "bg-amber-600" },
    { id: "p3", label: "Low", value: priorityCounts.P3, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-4">
        <InsightCard title="Completed" value={String(recentCompleted)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/board`} />
        <InsightCard title="Updated" value={String(recentUpdated)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/timeline`} />
        <InsightCard title="Created" value={String(recentCreated)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/board`} />
        <InsightCard title="Due Soon" value={String(dueSoon)} subtitle="in next 7 days" href={`/dashboard/w/${workspaceId}/timeline`} />
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
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Priority breakdown</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            How work is currently prioritized.
          </p>

          <div className="mt-5">
            <div className="grid h-40 grid-cols-3 items-end gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
              {priorityRows.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end">
                    <div
                      className={`w-full rounded-md ${item.color}`}
                      style={{ height: `${Math.max(8, Math.round((item.value / maxPriority) * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs">
              {priorityRows.map((item) => (
                <span key={`${item.id}-legend`} className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <span className={`inline-block size-2 rounded-full ${item.color}`} />
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Types of work</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Distribution by task type.
          </p>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {typeRows.map((row) => (
              <DistRow
                key={row.id}
                label={row.label}
                value={row.value}
                total={typeTotal}
                color={row.color}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Team workload</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Active work distribution per assignee.
          </p>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {teamWorkload.map((person) => (
              <DistRow
                key={person.id}
                label={person.name}
                value={person.active}
                total={maxWorkload}
                color="bg-cyan-600"
                rightLabel={`${person.active} active`}
              />
            ))}
            {!teamWorkload.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No team members found.</p> : null}
          </div>
        </div>
      </section>
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

function InsightCard({ title, value, subtitle, href }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-500/40"
    >
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </Link>
  );
}

function DistRow({ label, value, total, color, rightLabel }) {
  const pct = Math.round((value / Math.max(1, total)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
        <span className="truncate pr-2">{label}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{rightLabel || `${pct}%`}</span>
      </div>
      <div className="h-6 rounded-md bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-6 rounded-md ${color} px-2 text-xs font-medium leading-6 text-white`}
          style={{ width: `${Math.max(10, pct)}%` }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
