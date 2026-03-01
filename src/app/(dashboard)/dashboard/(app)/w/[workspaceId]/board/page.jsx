"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Board from "@/components/board/Board";
import { loadDashboard, useMockStore } from "@/components/dashboard/mockStore";

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
    if (!workspaceProjects.length) {
      setSelectedProjectId("");
      return;
    }
    const stillValid = workspaceProjects.some(
      (project) => project.id === selectedProjectId,
    );
    if (!stillValid) {
      setSelectedProjectId(workspaceProjects[0]?.id || "");
    }
  }, [workspaceProjects, selectedProjectId]);

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

        <div className="w-full sm:w-72">
          <select
            value={selectedProjectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          >
            {workspaceProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </section>

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
