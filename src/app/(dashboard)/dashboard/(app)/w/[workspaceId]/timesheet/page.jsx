"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Activity, CalendarRange, Clock3, PieChart as PieIcon, Timer, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { loadDashboard, useMockStore } from "@/components/dashboard/mockStore";

const COLORS = ["#2563eb", "#06b6d4", "#14b8a6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
const EMPTY_ARR = [];
const timesheetPanelClass =
  "relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-sm";
const timesheetInsetCardClass =
  "rounded-[24px] border border-border bg-background p-4 shadow-sm";
const timesheetMiniCardClass =
  "rounded-2xl border border-border bg-background p-3";
const timesheetTitleClass =
  "text-sm font-semibold uppercase tracking-wide text-muted-foreground";
const timesheetMutedTextClass = "text-xs text-muted-foreground";
const timesheetFilterInputClass =
  "h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";
const timesheetFilterSelectClass =
  "h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-9 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

function TimesheetPageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="h-7 w-28 rounded-full bg-muted" />
            <div className="space-y-3">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-8 w-56 rounded bg-muted" />
              <div className="h-4 w-72 max-w-full rounded bg-muted" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`timesheet-chip-skeleton-${index}`}
                  className="rounded-2xl border border-border bg-background px-4 py-3"
                >
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="mt-3 h-4 w-28 rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`timesheet-pill-skeleton-${index}`}
                  className="h-8 w-32 rounded-full border border-border bg-background"
                />
              ))}
            </div>
          </div>

          <div className={timesheetInsetCardClass}>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-3 w-14 rounded bg-muted" />
                <div className="h-6 w-36 rounded bg-muted" />
              </div>
              <div className="h-7 w-24 rounded-full bg-muted" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`timesheet-filter-skeleton-${index}`} className="space-y-2">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-11 rounded-2xl bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`timesheet-stat-skeleton-${index}`}
            className="rounded-[26px] border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-8 w-28 rounded bg-muted" />
              </div>
              <div className="size-10 rounded-2xl bg-muted" />
            </div>
            <div className="mt-3 h-3 w-32 rounded bg-muted" />
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
          <div className="h-72 rounded-2xl bg-muted" />
        </div>
        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="size-4 rounded bg-muted" />
          </div>
          <div className="h-56 rounded-2xl bg-muted" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`timesheet-legend-skeleton-${index}`} className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-14 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`timesheet-lower-skeleton-${index}`} className={timesheetPanelClass}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
            <div className="h-72 rounded-2xl bg-muted" />
          </div>
        ))}
      </section>
    </div>
  );
}

function safeDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDateOnly(value) {
  const d = safeDate(value);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateInputValue(d) {
  return toDateOnly(d || new Date());
}

function fmtSeconds(totalSeconds) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function toHours(totalSeconds) {
  return Number((Math.max(0, Number(totalSeconds) || 0) / 3600).toFixed(2));
}

function compactDate(value) {
  const d = safeDate(value);
  if (!d) return String(value || "");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }
  if (!response.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}

function TooltipCard({ active, payload, label, keyName = "seconds" }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return (
    <div className="rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{fmtSeconds(row[keyName] || 0)}</p>
    </div>
  );
}

function MetricChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FilterField({ label, icon: Icon, children }) {
  return (
    <label className="space-y-1.5 text-[11px] font-medium text-muted-foreground">
      <span className="uppercase tracking-[0.18em]">{label}</span>
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /> : null}
        {children}
      </div>
    </label>
  );
}

function StatCard({ title, value, subtitle, Icon, tone = "indigo" }) {
  const tones = {
    indigo: "bg-primary/10 text-primary",
    cyan: "bg-accent text-accent-foreground",
    emerald: "bg-secondary text-secondary-foreground",
    amber: "bg-muted text-foreground",
  };
  const toneStyles = tones[tone] || tones.indigo;

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-border bg-card p-4 shadow-sm">
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <span className={`inline-flex size-10 items-center justify-center rounded-2xl ${toneStyles}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="relative mt-3 text-xs leading-5 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function WorkspaceTimesheetPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const allProjects = useMockStore((state) => state.projects || EMPTY_ARR);
  const allTasks = useMockStore((state) => state.tasks || EMPTY_ARR);
  const allWorkspaces = useMockStore((state) => state.workspaces || EMPTY_ARR);
  const currentUser = useMockStore((state) => state.currentUser || null);
  const dashboardLoaded = useMockStore((state) => Boolean(state.loaded));
  const dashboardLoading = useMockStore((state) => Boolean(state.loading));

  const workspace = useMemo(
    () => allWorkspaces.find((w) => w.id === workspaceId) || null,
    [allWorkspaces, workspaceId],
  );
  const projects = useMemo(
    () => allProjects.filter((p) => p.workspaceId === workspaceId),
    [allProjects, workspaceId],
  );
  const tasks = useMemo(
    () => allTasks.filter((t) => t.workspaceId === workspaceId),
    [allTasks, workspaceId],
  );
  const members = workspace?.members || EMPTY_ARR;

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return dateInputValue(d);
  });
  const [endDate, setEndDate] = useState(() => dateInputValue(new Date()));
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState("");
  const [memberError, setMemberError] = useState("");

  const [timesheetRows, setTimesheetRows] = useState([]);
  const [workspaceRows, setWorkspaceRows] = useState([]);
  const [projectRows, setProjectRows] = useState([]);
  const [taskReport, setTaskReport] = useState(null);
  const [allMemberRows, setAllMemberRows] = useState([]);
  const projectFetchKey = useMemo(() => projects.map((project) => String(project.id || "")).join("|"), [projects]);
  const memberFetchKey = useMemo(
    () =>
      members
        .map((member) => `${String(member.userId || "")}:${String(member.id || "")}:${String(member.email || "")}`)
        .join("|"),
    [members],
  );

  useEffect(() => {
    loadDashboard({ force: true, silent: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProjectId && projects.length) setSelectedProjectId(projects[0].id);
  }, [projects, selectedProjectId]);

  const tasksForProject = useMemo(() => {
    if (!selectedProjectId) return [];
    return tasks.filter((t) => String(t.projectId || "") === String(selectedProjectId));
  }, [tasks, selectedProjectId]);

  useEffect(() => {
    if (!tasksForProject.length) {
      setSelectedTaskId("");
      return;
    }
    const found = tasksForProject.some((t) => t.id === selectedTaskId);
    if (!found) setSelectedTaskId(tasksForProject[0].id);
  }, [tasksForProject, selectedTaskId]);

  useEffect(() => {
    if (!workspaceId) return;
    let alive = true;
    async function run() {
      try {
        setLoading(true);
        setError("");
        const qs = new URLSearchParams();
        if (startDate) qs.set("startDate", startDate);
        if (endDate) qs.set("endDate", endDate);
        const [timesheet, workspace, project, task] = await Promise.all([
          fetchJson(`/api/dashboard/reports/timesheet?${qs.toString()}`),
          fetchJson(`/api/dashboard/reports/workspace/${workspaceId}`),
          selectedProjectId ? fetchJson(`/api/dashboard/reports/project/${selectedProjectId}`) : Promise.resolve([]),
          selectedTaskId ? fetchJson(`/api/dashboard/reports/task/${selectedTaskId}`) : Promise.resolve(null),
        ]);
        if (!alive) return;
        setTimesheetRows(Array.isArray(timesheet) ? timesheet : []);
        setWorkspaceRows(Array.isArray(workspace) ? workspace : []);
        setProjectRows(Array.isArray(project) ? project : []);
        setTaskReport(task && typeof task === "object" ? task : null);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load reports");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [workspaceId, startDate, endDate, selectedProjectId, selectedTaskId]);

  useEffect(() => {
    if (!workspaceId || !projects.length) {
      setAllMemberRows([]);
      return;
    }
    let alive = true;
    async function run() {
      try {
        setLoadingMembers(true);
        setMemberError("");
        const settled = await Promise.allSettled(
          projects.map((project) => fetchJson(`/api/dashboard/reports/project/${project.id}`)),
        );
        if (!alive) return;

        const totals = new Map();
        settled.forEach((entry) => {
          if (entry.status !== "fulfilled" || !Array.isArray(entry.value)) return;
          entry.value.forEach((row) => {
            const userId = String(row.userId || "");
            if (!userId) return;
            totals.set(userId, (totals.get(userId) || 0) + Number(row.totalTime || 0));
          });
        });

        const seen = new Set();
        const rows = [];
        members.forEach((m, index) => {
          const userId = String(m.userId || "");
          const memberId = String(m.id || "");
          const key = userId || memberId || `member-${index}`;
          if (seen.has(key)) return;
          seen.add(key);
          const seconds = userId ? Number(totals.get(userId) || 0) : 0;
          rows.push({
            key,
            userId,
            name: m.name || m.email || "Member",
            email: m.email || "",
            seconds,
            hours: toHours(seconds),
          });
        });
        totals.forEach((seconds, userId) => {
          const exists = rows.some((r) => r.userId === userId);
          if (!exists) {
            rows.push({
              key: `extra-${userId}`,
              userId,
              name: `User ${String(userId).slice(-6)}`,
              email: "",
              seconds: Number(seconds || 0),
              hours: toHours(seconds),
            });
          }
        });
        rows.sort((a, b) => b.seconds - a.seconds);
        setAllMemberRows(rows);

        if (settled.some((entry) => entry.status === "rejected")) {
          setMemberError("Some project reports failed to load. Contribution totals may be partial.");
        }
      } catch (e) {
        if (alive) setMemberError(e?.message || "Failed to load member contribution data");
      } finally {
        if (alive) setLoadingMembers(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [memberFetchKey, members, projectFetchKey, projects, workspaceId]);

  const memberNameMap = useMemo(() => {
    const map = new Map();
    members.forEach((m) => {
      const name = m.name || m.email || "Member";
      if (m.userId) map.set(String(m.userId), name);
      if (m.id) map.set(String(m.id), name);
    });
    return map;
  }, [members]);

  const trendData = useMemo(
    () =>
      timesheetRows.map((row) => ({
        label: compactDate(row.date),
        seconds: Number(row.totalTime || 0),
        hours: toHours(row.totalTime),
      })),
    [timesheetRows],
  );

  const projectTotalsPie = useMemo(() => {
    const nameMap = new Map(projects.map((p) => [String(p.id), p.name]));
    return workspaceRows
      .map((row, index) => {
        const seconds = Number(row.totalTime || 0);
        return {
          name: nameMap.get(String(row.projectId || "")) || "Unknown project",
          seconds,
          hours: toHours(seconds),
          fill: COLORS[index % COLORS.length],
        };
      })
      .filter((row) => row.seconds > 0);
  }, [workspaceRows, projects]);

  const selectedProjectContrib = useMemo(() => {
    const totals = new Map();
    projectRows.forEach((row) => {
      const userId = String(row.userId || "");
      if (!userId) return;
      totals.set(userId, Number(row.totalTime || 0));
    });
    const rows = [];
    const seen = new Set();
    members.forEach((m, index) => {
      const userId = String(m.userId || "");
      const key = userId || String(m.id || `k-${index}`);
      if (seen.has(key)) return;
      seen.add(key);
      const seconds = userId ? Number(totals.get(userId) || 0) : 0;
      rows.push({ key, name: m.name || m.email || "Member", seconds, hours: toHours(seconds) });
    });
    totals.forEach((seconds, userId) => {
      const exists = rows.some((r) => r.key === userId);
      if (!exists) {
        rows.push({
          key: userId,
          name: memberNameMap.get(userId) || `User ${String(userId).slice(-6)}`,
          seconds,
          hours: toHours(seconds),
        });
      }
    });
    return rows.sort((a, b) => b.seconds - a.seconds);
  }, [projectRows, members, memberNameMap]);

  const selectedProjectContribChart = useMemo(
    () =>
      selectedProjectContrib.map((row, index) => ({
        ...row,
        fill: COLORS[index % COLORS.length],
      })),
    [selectedProjectContrib],
  );

  const allMemberChart = useMemo(
    () => allMemberRows.map((row) => ({ name: row.name, seconds: row.seconds, hours: row.hours })),
    [allMemberRows],
  );

  const totalSeconds = timesheetRows.reduce((sum, row) => sum + Number(row.totalTime || 0), 0);
  const averagePerDay = trendData.length ? Math.floor(totalSeconds / trendData.length) : 0;
  const teamTotalSeconds = allMemberRows.reduce((sum, row) => sum + Number(row.seconds || 0), 0);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;
  const topContributor = allMemberRows[0] || null;
  const taskProgress = taskReport?.estimatedTime
    ? Math.min(100, Math.round((Number(taskReport.totalTimeSpent || 0) / Math.max(1, Number(taskReport.estimatedTime || 0))) * 100))
    : 0;
  const showInitialSkeleton =
    !dashboardLoaded ||
    dashboardLoading ||
    ((loading || loadingMembers) &&
      !error &&
      !memberError &&
      !timesheetRows.length &&
      !workspaceRows.length &&
      !projectRows.length &&
      taskReport === null &&
      !allMemberRows.length);

  if (showInitialSkeleton) {
    return <TimesheetPageSkeleton />;
  }

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="relative grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Reports Hub
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Workspace Insights</p>
              <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                Time Sheet Analytics
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Charts + member contribution overview
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricChip label="Selected Project" value={selectedProject?.name || "No project selected"} />
              <MetricChip label="Selected Task" value={selectedTask?.title || "No task selected"} />
              <MetricChip label="Top Contributor" value={topContributor?.name || "No contribution yet"} />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                Tracked {fmtSeconds(totalSeconds)}
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                Average {fmtSeconds(averagePerDay)} / day
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                Team total {fmtSeconds(teamTotalSeconds)}
              </span>
            </div>
          </div>

          <div className={timesheetInsetCardClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Filters</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">Refine the view</h3>
              </div>
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                {projects.length} projects
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <FilterField label="Start date" icon={CalendarRange}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={timesheetFilterInputClass}
                />
              </FilterField>
              <FilterField label="End date" icon={CalendarRange}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={timesheetFilterInputClass}
                />
              </FilterField>
              <FilterField label="Project" icon={PieIcon}>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className={timesheetFilterSelectClass}
                >
                  {!projects.length ? <option value="">No project</option> : null}
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
              </FilterField>
              <FilterField label="Task" icon={Clock3}>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className={timesheetFilterSelectClass}
                >
                  {!tasksForProject.length ? <option value="">No task</option> : null}
                  {tasksForProject.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
                </select>
              </FilterField>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tracked Time" value={fmtSeconds(totalSeconds)} subtitle={`${trendData.length} active day${trendData.length === 1 ? "" : "s"}`} Icon={Clock3} tone="indigo" />
        <StatCard title="Average / Day" value={fmtSeconds(averagePerDay)} subtitle="Selected date range" Icon={Timer} tone="cyan" />
        <StatCard title="Team Total" value={fmtSeconds(teamTotalSeconds)} subtitle="All workspace projects (all-time)" Icon={Users} tone="emerald" />
        <StatCard title="Current User" value={currentUser?.name || "User"} subtitle={currentUser?.email || "Account"} Icon={Activity} tone="amber" />
      </section>

      {error ? <div className="rounded-[22px] border border-rose-200/80 bg-rose-50/90 p-3.5 text-sm text-rose-700 shadow-sm backdrop-blur dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div> : null}
      {memberError ? <div className="rounded-[22px] border border-amber-200/80 bg-amber-50/90 p-3.5 text-sm text-amber-700 shadow-sm backdrop-blur dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">{memberError}</div> : null}

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className={timesheetTitleClass}>Timesheet Trend</h3>
            <span className={timesheetMutedTextClass}>Hours by day</span>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          ) : trendData.length ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v}h`} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TooltipCard keyName="seconds" />} />
                  <Area type="monotone" dataKey="hours" stroke="#4586ff" strokeWidth={2.5} fill="rgba(69, 134, 255, 0.14)" dot={{ r: 3, fill: "#4586ff" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No timesheet data for selected range.</p>
          )}
        </div>

        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className={timesheetTitleClass}>Project Distribution</h3>
            <PieIcon className="size-4 text-muted-foreground" />
          </div>
          {projectTotalsPie.length ? (
            <>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={projectTotalsPie} dataKey="hours" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={2}>
                      {projectTotalsPie.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip content={<TooltipCard keyName="seconds" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                {projectTotalsPie.map((row) => (
                  <div key={row.name} className="flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-2 text-muted-foreground">
                      <span className="inline-block size-2.5 rounded-full" style={{ background: row.fill }} />
                      <span className="truncate">{row.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{fmtSeconds(row.seconds)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No workspace project data found.</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className={timesheetTitleClass}>Selected Project Contribution</h3>
            <span className={timesheetMutedTextClass}>{selectedProject?.name || "Select project"}</span>
          </div>
          {selectedProjectContribChart.length ? (
            <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedProjectContribChart}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={102}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {selectedProjectContribChart.map((row) => (
                        <Cell key={row.key} fill={row.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipCard keyName="seconds" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {selectedProjectContribChart.map((row) => (
                  <div key={row.key} className="rounded-xl border border-border bg-background px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="inline-flex min-w-0 items-center gap-2">
                        <span className="inline-block size-2.5 rounded-full" style={{ background: row.fill }} />
                        <p className="truncate text-sm font-medium text-foreground">{row.name}</p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-foreground">{fmtSeconds(row.seconds)}</p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max((row.seconds / Math.max(1, selectedProjectContribChart[0]?.seconds || 1)) * 100, 6)}%`,
                          background: row.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No contributor data found for this project.</p>
          )}
        </div>

        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className={timesheetTitleClass}>All Members Contribution</h3>
            <span className={timesheetMutedTextClass}>All projects (all-time)</span>
          </div>
          {loadingMembers ? (
            <p className="text-sm text-muted-foreground">Loading member contribution...</p>
          ) : allMemberChart.length ? (
            <div className="h-[22rem] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allMemberChart} margin={{ top: 12, right: 12, left: -18, bottom: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.3} />
                  <XAxis dataKey="name" angle={-18} textAnchor="end" height={72} interval={0} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v}h`} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TooltipCard keyName="seconds" />} />
                  <Bar dataKey="hours" radius={[10, 10, 0, 0]} fill="#4586ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No member contribution data available.</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className={timesheetTitleClass}>Snapshot</h3>
              <p className="mt-1 text-xs text-muted-foreground">Quick glance at the strongest signals in this view.</p>
            </div>
            <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Activity className="size-4" />
            </div>
          </div>
          <div className="grid gap-3 text-sm">
            <div className="overflow-hidden rounded-[26px] border border-border bg-background p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Top Contributor</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-foreground">{topContributor?.name || "N/A"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{topContributor?.email || "No contributor data"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card px-3 py-2 text-right shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tracked</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {topContributor ? fmtSeconds(topContributor.seconds) : "No data"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={timesheetInsetCardClass}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Selected Project</p>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] font-semibold text-foreground">{selectedProject?.name || "N/A"}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(100, Math.max((projectRows.reduce((sum, row) => sum + Number(row.totalTime || 0), 0) / Math.max(1, teamTotalSeconds)) * 100, 8))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{fmtSeconds(projectRows.reduce((sum, row) => sum + Number(row.totalTime || 0), 0))}</p>
              </div>
              <div className={timesheetInsetCardClass}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Selected Task</p>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] font-semibold text-foreground">{selectedTask?.title || "N/A"}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(100, Math.max(taskProgress, 8))}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {taskReport ? `${fmtSeconds(taskReport.totalTimeSpent || 0)} spent` : "No task report"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={timesheetPanelClass}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3 className={timesheetTitleClass}>Task Report</h3>
            <Clock3 className="size-4 text-muted-foreground" />
          </div>
          {taskReport ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">{selectedTask?.title || "Selected task"}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className={timesheetMiniCardClass}>
                  <p className="text-[11px] text-muted-foreground">Estimated</p>
                  <p className="text-sm font-semibold text-foreground">{fmtSeconds(taskReport.estimatedTime)}</p>
                </div>
                <div className={timesheetMiniCardClass}>
                  <p className="text-[11px] text-muted-foreground">Spent</p>
                  <p className="text-sm font-semibold text-foreground">{fmtSeconds(taskReport.totalTimeSpent)}</p>
                </div>
                <div className={timesheetMiniCardClass}>
                  <p className="text-[11px] text-muted-foreground">Remaining</p>
                  <p className="text-sm font-semibold text-foreground">{fmtSeconds(taskReport.remainingTime)}</p>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{taskProgress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div className="h-2.5 rounded-full bg-primary" style={{ width: `${taskProgress}%` }} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Logs</p>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {(taskReport.logs || []).slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded-2xl border border-border bg-background px-3 py-2.5 text-xs shadow-sm">
                      <div className="min-w-0">
                        <p className="truncate text-foreground">
                          {log.startTime ? new Date(log.startTime).toLocaleString() : "Unknown"} - {log.endTime ? new Date(log.endTime).toLocaleString() : "Running"}
                        </p>
                        {log.description ? <p className="truncate text-muted-foreground">{log.description}</p> : null}
                      </div>
                      <span className="ml-3 font-semibold text-foreground">{fmtSeconds(log.duration)}</span>
                    </div>
                  ))}
                  {!taskReport.logs?.length ? <p className="text-sm text-muted-foreground">No task logs found.</p> : null}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a task to view task-level report.</p>
          )}
        </div>
      </section>
    </div>
  );
}
