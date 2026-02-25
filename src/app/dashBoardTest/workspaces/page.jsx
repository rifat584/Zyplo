"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, CircleAlert, ListTodo } from "lucide-react";
import AppShell from "@/components/dashBoardTest/AppShell";
import { ContinueCard, RecentProjects, WorkspaceGrid } from "@/components/dashBoardTest/workspaces";
import {
  getContinueContext,
  getRecentProjects,
  getWorkspaceLastUpdated,
  useMockStore,
} from "@/components/dashBoardTest/mockStore";

export default function WorkspacesPage() {
  const [activeStatFilter, setActiveStatFilter] = useState("all");

  const { workspaces, projects, tasks, lastVisited } = useMockStore((state) => ({
    workspaces: state.workspaces,
    projects: state.projects,
    tasks: state.tasks,
    lastVisited: state.lastVisited,
  }));

  const continueContext = getContinueContext();
  const recentProjects = getRecentProjects(5);
  const activeWorkspaceId = lastVisited?.workspaceId || "";
  const totalOpenTasks = tasks.filter((task) => task.status !== "done").length;
  const currentUserId = useMockStore((state) => state.currentUser.id);

  const myWorkPreview = useMemo(() => {
    const today = new Date();
    const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const mine = tasks
      .filter((task) => task.assignee === currentUserId && task.status !== "done")
      .slice(0, 5)
      .map((task) => {
        const project = projects.find((item) => item.id === task.projectId);
        return { ...task, project };
      });

    const assigned = mine.length;
    const dueSoon = mine.filter((task) => {
      if (!task.dueDate) return false;
      const due = new Date(task.dueDate);
      return due >= today && due <= dueSoonLimit;
    }).length;
    const overdue = mine.filter((task) => task.dueDate && new Date(task.dueDate) < today).length;

    return {
      assigned,
      dueSoon,
      overdue,
      items: mine.slice(0, 3),
    };
  }, [tasks, projects, currentUserId]);

  const workspaceMeta = useMemo(() => {
    return workspaces.map((workspace) => {
      const workspaceProjects = projects.filter((project) => project.workspaceId === workspace.id);
      const workspaceTasks = tasks.filter((task) => workspaceProjects.some((project) => project.id === task.projectId));
      const openTasksCount = workspaceTasks.filter((task) => task.status !== "done").length;
      const inProgressCount = workspaceTasks.filter((task) => task.status === "inprogress").length;
      const updatedAt = getWorkspaceLastUpdated(workspace.id);
      return {
        workspace,
        projectsCount: workspaceProjects.length,
        openTasksCount,
        inProgressCount,
        membersCount: workspace.members.length,
        updatedAt,
      };
    });
  }, [workspaces, projects, tasks]);

  const filteredWorkspaces = useMemo(() => {
    const byQuery = workspaceMeta;

    if (activeStatFilter === "active") {
      return byQuery.filter((item) => item.workspace.id === activeWorkspaceId);
    }
    if (activeStatFilter === "open") {
      return byQuery.filter((item) => item.openTasksCount > 0);
    }
    return byQuery;
  }, [workspaceMeta, activeStatFilter, activeWorkspaceId]);

  const statChips = [
    { key: "all", label: "All workspaces" },
    { key: "active", label: "Active" },
    { key: "open", label: "With open tasks" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Workspaces</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pick up where you left off and jump back into execution.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#workspace-grid"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
            >
              <Briefcase className="size-3.5" />
              {workspaces.length} workspaces
            </a>
            <a
              href="#recent-projects"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
            >
              <ListTodo className="size-3.5" />
              {projects.length} projects
            </a>
            <Link
              href="/dashBoardTest/my-work"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
            >
              <CircleAlert className="size-3.5" />
              {totalOpenTasks} open tasks
            </Link>
          </div>
        </div>

        <ContinueCard continueContext={continueContext} lastVisited={lastVisited} myWorkPreview={myWorkPreview} />

        <WorkspaceGrid
          filteredWorkspaces={filteredWorkspaces}
          activeWorkspaceId={activeWorkspaceId}
          activeStatFilter={activeStatFilter}
          onChangeFilter={setActiveStatFilter}
          statChips={statChips}
        />

        <div id="recent-projects" className="scroll-mt-24">
          <RecentProjects projects={recentProjects} title="Recent Projects" />
        </div>
      </div>
    </AppShell>
  );
}
