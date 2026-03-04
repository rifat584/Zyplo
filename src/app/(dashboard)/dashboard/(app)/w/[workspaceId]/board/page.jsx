"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Board from "@/components/board/Board";
import {
  createProject,
  loadDashboard,
  useMockStore,
} from "@/components/dashboard/mockStore";

const PROJECT_SELECTION_KEY_PREFIX = "dashboard.selectedProject.";

function getProjectSelectionKey(workspaceId) {
  return `${PROJECT_SELECTION_KEY_PREFIX}${workspaceId}`;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export default function WorkspaceBoardPage() {
  const params = useParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";
  const [queryClient] = useState(() => createQueryClient());
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { loaded, loading, projects } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
    projects: state.projects || [],
  }));

  useEffect(() => {
    loadDashboard({ force: true }).catch(() => {});
  }, []);

  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId],
  );

  useEffect(() => {
    if (!workspaceId) return;
    try {
      const saved = window.localStorage.getItem(getProjectSelectionKey(workspaceId));
      if (saved) setSelectedProjectId(saved);
    } catch {
      // no-op
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceProjects.length) {
      setSelectedProjectId("");
      return;
    }
    const stillValid = workspaceProjects.some(
      (project) => project.id === selectedProjectId,
    );
    if (!stillValid) {
      try {
        const saved = window.localStorage.getItem(
          getProjectSelectionKey(workspaceId),
        );
        const savedStillValid = workspaceProjects.some(
          (project) => project.id === saved,
        );
        if (savedStillValid) {
          setSelectedProjectId(saved || "");
          return;
        }
      } catch {
        // no-op
      }
      setSelectedProjectId(workspaceProjects[0]?.id || "");
    }
  }, [workspaceId, workspaceProjects, selectedProjectId]);

  useEffect(() => {
    if (!workspaceId || !selectedProjectId) return;
    try {
      window.localStorage.setItem(
        getProjectSelectionKey(workspaceId),
        selectedProjectId,
      );
    } catch {
      // no-op
    }
  }, [workspaceId, selectedProjectId]);

  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
        Invalid workspace route.
      </div>
    );
  }

  if (!loaded || loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
        Loading board...
      </div>
    );
  }

  async function handleCreateProject() {
    const name = projectName.trim();
    if (!name || !workspaceId) return;

    try {
      setCreateError("");
      setCreatingProject(true);
      const project = await createProject(workspaceId, name, projectKey.trim());
      setProjectName("");
      setProjectKey("");
      setSelectedProjectId(project?.id || "");
      setShowCreateForm(false);
    } catch (error) {
      setCreateError(error?.message || "Failed to create project");
    } finally {
      setCreatingProject(false);
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <section className="mb-4 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Workspace Board
          </p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Select Project
          </h2>
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2">
          <div className="w-full sm:w-72">
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              disabled={!workspaceProjects.length}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 disabled:opacity-60 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              {workspaceProjects.length ? (
                workspaceProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))
              ) : (
                <option value="">No projects yet</option>
              )}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setCreateError("");
              setShowCreateForm((current) => !current);
            }}
            className="inline-flex items-center h-10 rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white hover:bg-indigo-600"
          >
            {showCreateForm ? "Cancel" : "New Project"}
          </button>
        </div>
      </section>

      {showCreateForm || !workspaceProjects.length ? (
        <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Create Project
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Add a new project to this workspace.
          </p>
          <div className="mt-4 space-y-3">
            <input
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="Project name"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            />
            <input
              value={projectKey}
              onChange={(event) => setProjectKey(event.target.value)}
              placeholder="Project key (optional)"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleCreateProject}
              disabled={!projectName.trim() || creatingProject}
              className="inline-flex rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {creatingProject ? "Creating..." : "Create Project"}
            </button>
            {createError ? (
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {createError}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {!workspaceProjects.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            No Project Found
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a project first, then open the board.
          </p>
          <div className="mt-4">
            <Link
              href={`/dashboard/w/${workspaceId}`}
              className="inline-flex rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
            >
              Go to Workspace Overview
            </Link>
          </div>
        </div>
      ) : null}

      {selectedProjectId ? (
        <Board
          key={selectedProjectId}
          workspaceId={workspaceId}
          projectId={selectedProjectId}
        />
      ) : null}
    </QueryClientProvider>
  );
}
