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
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow dark:border-white/10 dark:bg-slate-900">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-semibold text-slate-800 dark:text-slate-100">{fmtSeconds(row[keyName] || 0)}</p>
    </div>
  );
}

function StatCard({ title, value, subtitle, Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/90">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
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
  }, [workspaceId, projectFetchKey, memberFetchKey]);

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

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 shadow-sm dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/20">
        <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 size-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Reports</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Time Sheet Analytics</h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Charts + member contribution overview</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Start date</span>
              <div className="relative">
                <CalendarRange className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100" />
              </div>
            </label>
            <label className="space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>End date</span>
              <div className="relative">
                <CalendarRange className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100" />
              </div>
            </label>
            <label className="space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Project</span>
              <div className="relative">
                <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100">
                  {!projects.length ? <option value="">No project</option> : null}
                  {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
              </div>
            </label>
            <label className="space-y-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Task</span>
              <div className="relative">
                <select value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100">
                  {!tasksForProject.length ? <option value="">No task</option> : null}
                  {tasksForProject.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
                </select>
              </div>
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <StatCard title="Tracked Time" value={fmtSeconds(totalSeconds)} subtitle={`${trendData.length} active day${trendData.length === 1 ? "" : "s"}`} Icon={Clock3} />
        <StatCard title="Average / Day" value={fmtSeconds(averagePerDay)} subtitle="Selected date range" Icon={Timer} />
        <StatCard title="Team Total" value={fmtSeconds(teamTotalSeconds)} subtitle="All workspace projects (all-time)" Icon={Users} />
        <StatCard title="Current User" value={currentUser?.name || "User"} subtitle={currentUser?.email || "Account"} Icon={Activity} />
      </section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">{error}</div> : null}
      {memberError ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">{memberError}</div> : null}

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Timesheet Trend</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Hours by day</span>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading chart...</p>
          ) : trendData.length ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v}h`} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TooltipCard keyName="seconds" />} />
                  <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={2.5} fill="url(#trendFill)" dot={{ r: 3, fill: "#2563eb" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No timesheet data for selected range.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Project Distribution</h3>
            <PieIcon className="size-4 text-slate-400" />
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
                    <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="inline-block size-2.5 rounded-full" style={{ background: row.fill }} />
                      <span className="truncate">{row.name}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{fmtSeconds(row.seconds)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No workspace project data found.</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected Project Contribution</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{selectedProject?.name || "Select project"}</span>
          </div>
          {selectedProjectContrib.length ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedProjectContrib} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.4} />
                  <XAxis type="number" tickFormatter={(v) => `${v}h`} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<TooltipCard keyName="seconds" />} />
                  <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                    {selectedProjectContrib.map((row, index) => <Cell key={row.key} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No contributor data found for this project.</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">All Members Contribution</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">All projects (all-time)</span>
          </div>
          {loadingMembers ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading member contribution...</p>
          ) : allMemberChart.length ? (
            <div className="grid gap-3 lg:grid-cols-[1fr_0.95fr]">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allMemberChart} margin={{ top: 4, right: 8, left: -12, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.35} />
                    <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v) => `${v}h`} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<TooltipCard keyName="seconds" />} />
                    <Bar dataKey="hours" radius={[6, 6, 0, 0]} fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {allMemberRows.map((row) => (
                  <div key={row.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900/70">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800 dark:text-slate-100">{row.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{row.email || "No email"}</p>
                    </div>
                    <p className="ml-2 shrink-0 font-semibold text-slate-700 dark:text-slate-200">{fmtSeconds(row.seconds)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No member contribution data available.</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Snapshot</h3>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <p className="text-xs text-slate-500 dark:text-slate-400">Top Contributor</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{topContributor?.name || "N/A"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{topContributor ? fmtSeconds(topContributor.seconds) : "No data"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <p className="text-xs text-slate-500 dark:text-slate-400">Selected Project</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{selectedProject?.name || "N/A"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{fmtSeconds(projectRows.reduce((sum, row) => sum + Number(row.totalTime || 0), 0))}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <p className="text-xs text-slate-500 dark:text-slate-400">Selected Task</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{selectedTask?.title || "N/A"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{taskReport ? `${fmtSeconds(taskReport.totalTimeSpent || 0)} spent` : "No task report"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Task Report</h3>
            <Clock3 className="size-4 text-slate-400" />
          </div>
          {taskReport ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{selectedTask?.title || "Selected task"}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Estimated</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fmtSeconds(taskReport.estimatedTime)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Spent</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fmtSeconds(taskReport.totalTimeSpent)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Remaining</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{fmtSeconds(taskReport.remainingTime)}</p>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Progress</span>
                  <span>{taskProgress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${taskProgress}%` }} />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recent Logs</p>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {(taskReport.logs || []).slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-white/10">
                      <div className="min-w-0">
                        <p className="truncate text-slate-700 dark:text-slate-200">
                          {log.startTime ? new Date(log.startTime).toLocaleString() : "Unknown"} - {log.endTime ? new Date(log.endTime).toLocaleString() : "Running"}
                        </p>
                        {log.description ? <p className="truncate text-slate-500 dark:text-slate-400">{log.description}</p> : null}
                      </div>
                      <span className="ml-3 font-semibold text-slate-700 dark:text-slate-200">{fmtSeconds(log.duration)}</span>
                    </div>
                  ))}
                  {!taskReport.logs?.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No task logs found.</p> : null}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a task to view task-level report.</p>
          )}
        </div>
      </section>
    </div>
  );
}
