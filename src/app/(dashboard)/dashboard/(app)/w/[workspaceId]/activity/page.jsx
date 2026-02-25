"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCheck, CircleDot, Clock3, Search } from "lucide-react";
import { getRecentWorkspaceActivity, useMockStore } from "../../../../_lib/mockStore";
import { formatDateTime, fromNow } from "../../../../_lib/format";

function getEventTone(type) {
  if (type === "comment") {
    return {
      dot: "bg-cyan-500",
      chip: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300",
      label: "Comment",
    };
  }
  if (type === "status_change") {
    return {
      dot: "bg-indigo-500",
      chip: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
      label: "Status",
    };
  }
  if (type === "create_task") {
    return {
      dot: "bg-emerald-500",
      chip: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
      label: "Task created",
    };
  }
  return {
    dot: "bg-slate-400",
    chip: "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300",
    label: "Update",
  };
}

function getDayLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const yesterdayNormalized = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime();
  if (normalized === todayNormalized) return "Today";
  if (normalized === yesterdayNormalized) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function WorkspaceActivityPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);
  const projects = useMockStore((s) => s.projects.filter((project) => project.workspaceId === workspaceId));
  const activity = getRecentWorkspaceActivity(workspaceId, 100);
  const projectsById = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      map[project.id] = project;
    });
    return map;
  }, [projects]);

  const enriched = useMemo(() => {
    return activity
      .map((entry) => {
        const project = projectsById[entry.projectId] || null;
        const tone = getEventTone(entry.type);
        const searchText = `${entry.actor} ${entry.message} ${project?.name || ""} ${project?.key || ""}`.toLowerCase();
        return {
          ...entry,
          project,
          tone,
          searchText,
          href: project ? `/dashboard/w/${workspaceId}/p/${project.id}/activity` : `/dashboard/w/${workspaceId}`,
        };
      })
      .filter((entry) => {
        if (typeFilter !== "all" && entry.type !== typeFilter) return false;
        if (projectFilter !== "all" && entry.projectId !== projectFilter) return false;
        if (query.trim() && !entry.searchText.includes(query.toLowerCase().trim())) return false;
        return true;
      });
  }, [activity, projectFilter, projectsById, query, typeFilter, workspaceId]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayCount = activity.filter((entry) => new Date(entry.createdAt).getTime() >= todayStart).length;
    return {
      total: activity.length,
      today: todayCount,
      status: activity.filter((entry) => entry.type === "status_change").length,
      comments: activity.filter((entry) => entry.type === "comment").length,
    };
  }, [activity]);

  const grouped = useMemo(() => {
    const map = {};
    enriched.forEach((entry) => {
      const key = getDayLabel(entry.createdAt);
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return Object.entries(map);
  }, [enriched]);

  const eventFilters = [
    { key: "all", label: "All" },
    { key: "status_change", label: "Status changes" },
    { key: "comment", label: "Comments" },
    { key: "create_task", label: "Created tasks" },
  ];

  if (!workspace) return <p className="text-sm text-slate-600 dark:text-slate-400">Workspace not found.</p>;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{workspace.name} Activity</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Updates across all projects in this workspace.</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            <Clock3 className="size-3.5" />
            Updated {activity.length ? fromNow(activity[0].createdAt) : "now"}
          </span>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total events</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.today}</p>
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
            <p className="text-xs text-indigo-700 dark:text-indigo-300">Status changes</p>
            <p className="mt-1 text-lg font-semibold text-indigo-700 dark:text-indigo-300">{stats.status}</p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-500/30 dark:bg-cyan-500/10">
            <p className="text-xs text-cyan-700 dark:text-cyan-300">Comments</p>
            <p className="mt-1 text-lg font-semibold text-cyan-700 dark:text-cyan-300">{stats.comments}</p>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full min-w-0 sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by person, action, project key"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
          {eventFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setTypeFilter(filter.key)}
              className={`rounded-full border px-3 py-1 text-xs ${
                typeFilter === filter.key
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setProjectFilter("all")}
            className={`rounded-full border px-3 py-1 text-xs ${
              projectFilter === "all"
                ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            All projects
          </button>
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setProjectFilter(project.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                projectFilter === project.id
                  ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {project.key}
            </button>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Timeline</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{enriched.length} events</span>
        </div>

        {grouped.length ? (
          <div className="space-y-5">
            {grouped.map(([day, entries]) => (
              <div key={day}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{day}</p>
                <div className="relative space-y-2 pl-5">
                  <div className="absolute bottom-0 left-1.5 top-1 w-px bg-slate-200 dark:bg-white/10" />
                  {entries.map((entry, index) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                      <div className="relative">
                        <span className={`absolute -left-5 top-4 size-2 rounded-full ${entry.tone.dot}`} />
                        <Link
                          href={entry.href}
                          className="block rounded-xl border border-slate-200 p-3 transition hover:border-indigo-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800"
                        >
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] ${entry.tone.chip}`}>{entry.tone.label}</span>
                            {entry.project ? (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
                                {entry.project.name} · {entry.project.key}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm text-slate-800 dark:text-slate-100">
                            <span className="font-semibold">{entry.actor}</span> {entry.message}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{formatDateTime(entry.createdAt)}</span>
                            <CircleDot className="size-3" />
                            <span>{fromNow(entry.createdAt)}</span>
                          </div>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
            <CheckCheck className="mx-auto mb-2 size-5 text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-400">No activity matches your current filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
