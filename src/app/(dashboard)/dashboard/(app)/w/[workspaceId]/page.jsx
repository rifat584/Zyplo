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
    { id: "feature", label: "Feature", value: typeCounts.feature, color: "bg-primary", textClass: "text-primary-foreground" },
    { id: "bug", label: "Bug", value: typeCounts.bug, color: "bg-destructive", textClass: "text-destructive-foreground" },
    { id: "chore", label: "Chore", value: typeCounts.chore, color: "bg-muted", textClass: "text-foreground" },
  ];
  const priorityRows = [
    { id: "p1", label: "High", value: priorityCounts.P1, color: "bg-destructive", textClass: "text-destructive-foreground" },
    { id: "p2", label: "Medium", value: priorityCounts.P2, color: "bg-warning", textClass: "text-warning-foreground" },
    { id: "p3", label: "Low", value: priorityCounts.P3, color: "bg-success", textClass: "text-success-foreground" },
  ];

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard title="Completed" value={String(recentCompleted)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/board`} />
        <InsightCard title="Updated" value={String(recentUpdated)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/timeline`} />
        <InsightCard title="Created" value={String(recentCreated)} subtitle="in last 7 days" href={`/dashboard/w/${workspaceId}/board`} />
        <InsightCard title="Due Soon" value={String(dueSoon)} subtitle="in next 7 days" href={`/dashboard/w/${workspaceId}/timeline`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Status Overview
          </h2>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div
              className="relative mx-auto size-32 shrink-0 rounded-full sm:mx-0 sm:size-40"
              style={{
                background: `conic-gradient(var(--chart-success) 0% ${donePct}%, var(--chart-secondary) ${donePct}% ${donePct + inProgressPct}%, var(--chart-primary) ${donePct + inProgressPct}% ${donePct + inProgressPct + reviewPct}%, var(--chart-muted) ${donePct + inProgressPct + reviewPct}% 100%)`,
              }}
            >
              <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-card text-center sm:inset-5">
                <p className="text-2xl font-semibold text-foreground">{totalTasks}</p>
                <p className="text-xs text-muted-foreground">Total tasks</p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-48 space-y-2 text-sm sm:mx-0 sm:w-auto sm:max-w-none">
              <Legend label={`Done: ${counts.done}`} color="bg-success" />
              <Legend label={`In Progress: ${counts.inprogress}`} color="bg-secondary" />
              <Legend label={`In Review: ${counts.inreview}`} color="bg-primary" />
              <Legend label={`To Do: ${counts.todo}`} color="bg-muted" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Throughput (Tasks by Stage)
          </h2>
          <div className="mt-6 space-y-4">
            <Bar label="Done" value={counts.done} total={Math.max(1, totalTasks)} color="bg-success" />
            <Bar label="In Progress" value={counts.inprogress} total={Math.max(1, totalTasks)} color="bg-secondary" />
            <Bar label="In Review" value={counts.inreview} total={Math.max(1, totalTasks)} color="bg-primary" />
            <Bar label="To Do" value={counts.todo} total={Math.max(1, totalTasks)} color="bg-muted" />
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Completion rate: {donePct}% | In-progress load: {inProgressPct}% | Pending: {todoPct}%
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent Activity
        </h2>
        <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {recentItems.map((task) => (
            <div key={task.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
              <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary dark:bg-primary/100/20 dark:text-primary">
                {(task.assigneeName || "U").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{task.assigneeName || "Someone"}</span> updated
                  <span className="font-medium"> {task.title}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.projectName || "No project"} | {task.status || "todo"} | {task.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown time"}
                </p>
              </div>
            </div>
          ))}
          {!recentItems.length ? <p className="text-sm text-muted-foreground">No activity yet.</p> : null}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-lg font-semibold text-foreground">Priority breakdown</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            How work is currently prioritized.
          </p>

          <div className="mt-5">
            <div className="grid h-40 grid-cols-3 items-end gap-3 rounded-xl border border-border p-3">
              {priorityRows.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end">
                    <div
                      className={`w-full rounded-md ${item.color}`}
                      style={{ height: `${Math.max(8, Math.round((item.value / maxPriority) * 100))}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
              {priorityRows.map((item) => (
                <span key={`${item.id}-legend`} className="inline-flex items-center gap-1 text-muted-foreground">
                  <span className={`inline-block size-2 rounded-full ${item.color}`} />
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-lg font-semibold text-foreground">Types of work</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
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

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-lg font-semibold text-foreground">Team workload</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Active work distribution per assignee.
          </p>
          <div className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
            {teamWorkload.map((person) => (
              <DistRow
                key={person.id}
                label={person.name}
                value={person.active}
                total={maxWorkload}
                color="bg-secondary"
                rightLabel={`${person.active} active`}
              />
            ))}
            {!teamWorkload.length ? <p className="text-sm text-muted-foreground">No team members found.</p> : null}
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
      <span className="text-foreground dark:text-muted-foreground">{label}</span>
    </div>
  );
}

function Bar({ label, value, total, color }) {
  const widthPct = Math.max(6, Math.round((value / total) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted dark:bg-surface">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
      </div>
    </div>
  );
}

function InsightCard({ title, value, subtitle, href }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-sm"
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
    </Link>
  );
}

function DistRow({ label, value, total, color, textClass = "text-primary-foreground", rightLabel }) {
  const pct = Math.round((value / Math.max(1, total)) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-foreground">
        <span className="truncate pr-2">{label}</span>
        <span className="text-xs text-muted-foreground">{rightLabel || `${pct}%`}</span>
      </div>
      <div className="h-6 rounded-md bg-muted dark:bg-surface">
        <div
          className={`h-6 rounded-md ${color} ${textClass} px-2 text-xs font-medium leading-6`}
          style={{ width: `${Math.max(10, pct)}%` }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
