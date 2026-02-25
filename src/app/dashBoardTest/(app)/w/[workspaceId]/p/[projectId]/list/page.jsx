"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import ProjectViewHeader from "@/components/dashBoardTest/ProjectViewHeader";
import TaskTable from "@/components/dashBoardTest/TaskTable";
import { setLastVisited, useMockStore } from "../../../../../../_lib/mockStore";

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function ProjectListPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const [filters, setFilters] = useState({ mine: false, p1: false, dueSoon: false, overdue: false });
  const [search, setSearch] = useState("");

  const { project, tasks } = useMockStore((s) => ({
    project: s.projects.find((item) => item.id === projectId) || null,
    tasks: s.tasks.filter((task) => task.projectId === projectId),
  }));

  useEffect(() => {
    if (workspaceId && projectId) setLastVisited(workspaceId, projectId, "list");
  }, [workspaceId, projectId]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      mine: searchParams.get("mine") === "1",
      dueSoon: searchParams.get("dueSoon") === "1",
      overdue: searchParams.get("overdue") === "1",
    }));
  }, [searchParams]);

  if (!project) return <p className="text-sm text-slate-600">Project not found.</p>;

  const meta = useMemo(() => {
    const today = startOfDay(new Date());
    const completed = tasks.filter((task) => task.status === "done").length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === "done") return false;
      const due = startOfDay(new Date(task.dueDate));
      return due < today;
    }).length;
    const open = tasks.filter((task) => task.status !== "done").length;
    return { completed, overdue, open };
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{project.name}</h1>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            {project.key}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            <ListTodo className="size-3.5" />
            {tasks.length} rows
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" />
            {meta.completed} completed
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertTriangle className="size-3.5" />
            {meta.overdue} overdue
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300">
            {meta.open} open
          </span>
        </div>
      </div>

      <ProjectViewHeader
        workspaceId={workspaceId}
        projectId={projectId}
        activeView="list"
        filters={filters}
        onToggleFilter={(key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))}
        onClearFilters={() => setFilters({ mine: false, p1: false, dueSoon: false, overdue: false })}
        search={search}
        onSearchChange={setSearch}
      />

      <TaskTable workspaceId={workspaceId} projectId={projectId} filters={filters} search={search} />
    </div>
  );
}
