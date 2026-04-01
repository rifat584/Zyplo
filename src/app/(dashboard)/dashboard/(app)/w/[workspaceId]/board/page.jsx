"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Board, { BoardSkeleton } from "@/components/board/Board";
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
import { Button } from "@/components/ui/button";
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
  const [kickstarting, setKickstarting] = useState(false); // AI State
  const firstProjectNameInputRef = useRef(null);
  const { isAdmin } = useWorkspaceAccess(workspaceId);

  const { loaded, loading, projects } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
    projects: state.projects || [],
  }));

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

  // --- AI Kickstart Handler (Triggered purely via the global listener now!) ---
  const handleAIKickstart = useCallback(async () => {
    if (!selectedProjectId || kickstarting) return;
    
    try {
      setKickstarting(true);
      toast.loading("🤖 AI is analyzing project and building backlog...", { id: "ai-kickstart" });
      
      const response = await fetch(`/api/dashboard/tasks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-silent-fetch": "true" 
        },
        body: JSON.stringify({ 
          isAiKickstart: true, 
          projectId: selectedProjectId 
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI tasks");
      }

      // 1. Force the global store to reload (Sidebar, Calendar, etc.)
      // Refresh store data without recreating the live socket session.
      await loadDashboard({ force: true, silent: true, preserveSocketToken: true });
      
      // 2. Force the React Query cache to clear so the Board instantly renders the new tasks!
      await queryClient.invalidateQueries();

      toast.success("✨ Project Backlog Generated!", { id: "ai-kickstart" });
    } catch (error) {
      toast.error(error.message || "AI Generation failed.", { id: "ai-kickstart" });
    } finally {
      setKickstarting(false);
    }
  }, [selectedProjectId, kickstarting, queryClient]);

  // --- MAGIC LISTENER: Connects this page to the Topbar button in chrome.jsx ---
  useEffect(() => {
    const onGlobalKickstart = (e) => {
      // Only trigger if the workspace matches and we aren't already generating
      if (e.detail?.workspaceId === workspaceId && !kickstarting) {
        handleAIKickstart();
      }
    };

    window.addEventListener("zyplo-open-ai-kickstart", onGlobalKickstart);
    return () => window.removeEventListener("zyplo-open-ai-kickstart", onGlobalKickstart);
  }, [workspaceId, kickstarting, handleAIKickstart]);


  if (!workspaceId) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-destructive">
        Invalid workspace route.
      </div>
    );
  }

  if (!loaded || loading) {
    return <BoardSkeleton />;
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCreateFirstProject}
                  disabled={!newProjectName.trim() || creatingProject}
                  className="border-secondary/50 bg-secondary/20 text-secondary shadow-none hover:scale-100 hover:border-secondary/60 hover:bg-secondary/30 hover:text-secondary hover:shadow-none dark:border-secondary/45 dark:bg-secondary/24 dark:hover:bg-secondary/34"
                >
                  <Plus className="size-4" />
                  {creatingProject ? "Creating..." : "Create project"}
                </Button>
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
        <div className="flex flex-col h-full relative">
          <Board
            key={selectedProjectId}
            workspaceId={workspaceId}
            projectId={selectedProjectId}
          />
        </div>
      ) : null}
    </QueryClientProvider>
  );
}
