"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CircleDot, MessageSquare, RefreshCw } from "lucide-react";
import ProjectViewHeader from "@/components/dashboard/ProjectViewHeader";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import { setLastVisited, useMockStore } from "../../../../../../_lib/mockStore";

export default function ProjectActivityPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const [filters, setFilters] = useState({
    comments: false,
    statusChanges: false,
    created: false,
    byMe: false,
  });
  const [search, setSearch] = useState("");

  const { project, activity } = useMockStore((s) => ({
    project: s.projects.find((item) => item.id === projectId) || null,
    activity: s.activity.filter((entry) => entry.projectId === projectId),
  }));

  useEffect(() => {
    if (workspaceId && projectId) setLastVisited(workspaceId, projectId, "activity");
  }, [workspaceId, projectId]);

  if (!project) return <p className="text-sm text-slate-600">Project not found.</p>;

  const meta = useMemo(() => {
    const comments = activity.filter((entry) => entry.type === "comment").length;
    const statusChanges = activity.filter((entry) => entry.type === "status_change").length;
    return { comments, statusChanges, total: activity.length };
  }, [activity]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{project.name}</h1>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            {project.key}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Timeline of comments, updates, and workflow changes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
          <CircleDot className="size-3.5" />
          {meta.total} events
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
          <MessageSquare className="size-3.5" />
          {meta.comments} comments
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
          <RefreshCw className="size-3.5" />
          {meta.statusChanges} status changes
        </span>
      </div>

      <ProjectViewHeader
        workspaceId={workspaceId}
        projectId={projectId}
        activeView="activity"
        filters={filters}
        onToggleFilter={(key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))}
        onClearFilters={() =>
          setFilters({
            comments: false,
            statusChanges: false,
            created: false,
            byMe: false,
          })
        }
        search={search}
        onSearchChange={setSearch}
      />

      <ActivityTimeline projectId={projectId} workspaceId={workspaceId} filters={filters} search={search} />
    </div>
  );
}
