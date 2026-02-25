"use client";

import { useMemo, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Building2, ChevronDown, FolderKanban } from "lucide-react";
import { getProjectsByWorkspace, useMockStore } from "./mockStore";

function ContextMenu({ open, items, onPick, align = "left" }) {
  if (!open) return null;

  return (
    <div
      className={`absolute top-10 z-40 w-64 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-slate-900 ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onPick(item.id)}
          className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${
            item.active
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          }`}
        >
          <span className="truncate">{item.label}</span>
          {item.meta ? <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">{item.meta}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default function ContextChips() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const { workspaces, projects, lastVisited } = useMockStore((state) => ({
    workspaces: state.workspaces,
    projects: state.projects,
    lastVisited: state.lastVisited,
  }));

  const activeWorkspace = useMemo(() => {
    if (workspaceId) return workspaces.find((item) => item.id === workspaceId) || null;
    if (lastVisited?.workspaceId) return workspaces.find((item) => item.id === lastVisited.workspaceId) || null;
    return workspaces[0] || null;
  }, [workspaceId, lastVisited, workspaces]);

  const activeProject = useMemo(() => {
    if (!projectId) return null;
    return projects.find((item) => item.id === projectId) || null;
  }, [projectId, projects]);

  const workspaceItems = workspaces.map((workspace) => ({
    id: workspace.id,
    label: workspace.name,
    meta: workspace.slug,
    active: activeWorkspace?.id === workspace.id,
  }));

  const projectItems = projects
    .filter((project) => project.workspaceId === activeWorkspace?.id)
    .map((project) => ({
      id: project.id,
      label: project.name,
      meta: project.key,
      active: activeProject?.id === project.id,
    }));

  const onSwitchWorkspace = (nextWorkspaceId) => {
    setWorkspaceOpen(false);
    const nextProjects = getProjectsByWorkspace(nextWorkspaceId);

    if (pathname.includes("/p/") && nextProjects.length > 0) {
      router.push(`/dashboard/w/${nextWorkspaceId}/p/${nextProjects[0].id}`);
      return;
    }

    router.push(`/dashboard/w/${nextWorkspaceId}`);
  };

  const onSwitchProject = (nextProjectId) => {
    if (!activeWorkspace) return;
    setProjectOpen(false);

    if (pathname.endsWith("/list")) {
      router.push(`/dashboard/w/${activeWorkspace.id}/p/${nextProjectId}/list`);
      return;
    }
    if (pathname.endsWith("/activity")) {
      router.push(`/dashboard/w/${activeWorkspace.id}/p/${nextProjectId}/activity`);
      return;
    }
    router.push(`/dashboard/w/${activeWorkspace.id}/p/${nextProjectId}`);
  };

  const isProjectRoute = pathname.includes("/p/");
  const isGlobalPage = pathname === "/dashboard/my-work" || pathname === "/dashboard/activity";

  return (
    <div className="min-w-0">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        Currently In
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {pathname === "/dashboard/workspaces" ? (
          <>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Workspaces</span>
          </>
        ) : isGlobalPage ? (
          <>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {pathname === "/dashboard/my-work" ? "My Work" : "Activity"}
            </span>
          </>
        ) : (
          <>
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkspaceOpen((value) => !value)}
                className="inline-flex max-w-[260px] items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200"
              >
                <Building2 className="size-4 shrink-0" />
                <span className="truncate">{activeWorkspace?.name || "Workspace"}</span>
                <ChevronDown className="size-3.5 shrink-0" />
              </button>
              <ContextMenu open={workspaceOpen} items={workspaceItems} onPick={onSwitchWorkspace} />
            </div>

            {isProjectRoute ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProjectOpen((value) => !value)}
                  className="inline-flex max-w-[260px] items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
                >
                  <FolderKanban className="size-4 shrink-0" />
                  <span className="truncate">{activeProject?.name || "Project"}</span>
                  <ChevronDown className="size-3.5 shrink-0" />
                </button>
                <ContextMenu open={projectOpen} items={projectItems} onPick={onSwitchProject} />
              </div>
            ) : null}
          </>
        )}
      </div>

    </div>
  );
}
