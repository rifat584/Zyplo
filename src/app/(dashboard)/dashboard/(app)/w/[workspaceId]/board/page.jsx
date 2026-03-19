"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Board from "@/components/board/Board";
import {
  createProject,
  loadDashboard,
  useMockStore,
  useWorkspaceAccess,
} from "@/components/dashboard/mockStore";
import {
  useWorkspaceProjectSelection,
  writeSelectedProjectId,
} from "@/components/dashboard/projectSelection";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectKey, setNewProjectKey] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [createError, setCreateError] = useState("");
  const firstProjectNameInputRef = useRef(null);
  const { isAdmin } = useWorkspaceAccess(workspaceId);

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
  const { selectedProjectId } = useWorkspaceProjectSelection(
    workspaceId,
    workspaceProjects,
  );

  useEffect(() => {
    if (!isAdmin || workspaceProjects.length) return;
    requestAnimationFrame(() => {
      firstProjectNameInputRef.current?.focus();
    });
  }, [isAdmin, workspaceProjects.length]);

  async function handleCreateFirstProject() {
    const name = newProjectName.trim();
    if (!name || !workspaceId || creatingProject || !isAdmin) return;

    try {
      setCreatingProject(true);
      setCreateError("");
      const project = await createProject(workspaceId, name, newProjectKey.trim());
      const projectId = String(project?.id || "");
      setNewProjectName("");
      setNewProjectKey("");
      if (projectId) {
        writeSelectedProjectId(workspaceId, projectId);
      }
      toast.success(`Created "${name}"`);
    } catch (error) {
      const message = error?.message || "Failed to create project";
      setCreateError(message);
      toast.error(message);
    } finally {
      setCreatingProject(false);
    }
  }

  if (!workspaceId) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-destructive">
        Invalid workspace route.
      </div>
    );
  }

  if (!loaded || loading) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!workspaceProjects.length ? (
        <div className="grid min-h-[22rem] place-items-center py-4 sm:py-6">
          {isAdmin ? (
            <section className="w-full max-w-md rounded-xl border border-border bg-card">
              <div className="px-5 py-4">
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  Create your first project
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Start by creating a project to organize tasks, timelines, and boards in this workspace.
                </p>
              </div>

              <div className="space-y-3 px-5 pb-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="first-project-name"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Project name
                  </label>
                  <input
                    ref={firstProjectNameInputRef}
                    id="first-project-name"
                    value={newProjectName}
                    onChange={(event) => {
                      setNewProjectName(event.target.value);
                      if (createError) setCreateError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleCreateFirstProject();
                      }
                    }}
                    placeholder="Project Name"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                  {!createError ? (
                    <p className="text-xs text-muted-foreground">
                      You can change this later.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="first-project-key"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Key
                  </label>
                  <input
                    id="first-project-key"
                    value={newProjectKey}
                    onChange={(event) => {
                      setNewProjectKey(event.target.value);
                      if (createError) setCreateError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleCreateFirstProject();
                      }
                    }}
                    placeholder="Project Key (Optional)"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </div>

                {createError ? (
                  <p className="text-sm text-destructive">{createError}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-end border-t border-border px-5 py-4">
                <button
                  type="button"
                  onClick={handleCreateFirstProject}
                  disabled={!newProjectName.trim() || creatingProject}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-primary text-primary-foreground shadow-none hover:scale-100 hover:bg-primary hover:shadow-none",
                  )}
                >
                  <Plus className="size-4" />
                  {creatingProject ? "Creating..." : "Create project"}
                </button>
              </div>
            </section>
          ) : (
            <section className="w-full max-w-md rounded-xl border border-border bg-card px-5 py-4">
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Create your first project
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ask a workspace admin to create the first project.
              </p>
            </section>
          )}
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
