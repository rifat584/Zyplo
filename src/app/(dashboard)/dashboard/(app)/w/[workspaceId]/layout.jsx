"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Clock3,
  GanttChartSquare,
  KanbanSquare,
  LayoutGrid,
  List,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
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
import {
  dashboardActiveSurfaceClasses,
  dashboardContextButtonClasses,
  dashboardInlineNavItemActiveClasses,
  dashboardInlineNavItemClasses,
  dashboardMenuItemClasses,
  dashboardMenuItemDangerClasses,
} from "@/components/dashboard/styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid, href: (id) => `/dashboard/w/${id}` },
  { id: "timeline", label: "Timeline", icon: GanttChartSquare, href: (id) => `/dashboard/w/${id}/timeline` },
  { id: "board", label: "Board", icon: KanbanSquare, href: (id) => `/dashboard/w/${id}/board` },
  { id: "calender", label: "Calendar", icon: CalendarDays, href: (id) => `/dashboard/w/${id}/calender` },
  { id: "list", label: "List", icon: List, href: (id) => `/dashboard/w/${id}/list` },
  { id: "timesheet", label: "Time Sheet", icon: Clock3, href: (id) => `/dashboard/w/${id}/timesheet` },
];

function ProjectCreateDialog({
  open,
  onClose,
  onSubmit,
  projectName,
  setProjectName,
  projectKey,
  setProjectKey,
  creatingProject,
  projectError,
}) {
  const projectNameInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      projectNameInputRef.current?.focus();
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-[12vh]">
      <div className="w-full max-w-md rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Create a project
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add a focused project to this workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close project dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 px-5 pb-4">
          <div className="space-y-1.5">
            <label
              htmlFor="project-name"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              Project name
            </label>
            <input
              ref={projectNameInputRef}
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Project Name"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="project-key"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              Key
            </label>
            <input
              id="project-key"
              value={projectKey}
              onChange={(event) => setProjectKey(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Project Key (Optional)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          {projectError ? (
            <p className="text-sm text-destructive">{projectError}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!projectName.trim() || creatingProject}
            className={cn(buttonVariants({ size: "sm" }), "bg-primary text-primary-foreground shadow-none hover:scale-100 hover:bg-primary hover:shadow-none")}
          >
            {creatingProject ? "Creating..." : "Create project"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteProjectDialog({
  open,
  project,
  confirmationValue,
  setConfirmationValue,
  deletingProject,
  onClose,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !deletingProject) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, deletingProject, onClose]);

  if (!open || !project) return null;

  const projectName = String(project.name || "");
  const canDelete =
    confirmationValue.trim() === projectName.trim() && !deletingProject;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/72 px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close delete project dialog"
        onClick={() => {
          if (deletingProject) return;
          onClose();
        }}
        className="absolute inset-0"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="relative w-full max-w-lg rounded-xl border border-border/70 bg-card p-6 text-card-foreground"
      >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              <h2
                id="delete-project-title"
                className="font-heading text-lg font-semibold tracking-tight text-foreground"
              >
                Delete project “{projectName}”?
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                This will permanently delete this project and all associated data. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="delete-project-confirmation"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                Type project name to confirm
              </label>
              <input
                id="delete-project-confirmation"
                value={confirmationValue}
                onChange={(event) => setConfirmationValue(event.target.value)}
                placeholder={projectName}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-destructive/45"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                disabled={deletingProject}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!canDelete}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-destructive text-destructive-foreground shadow-none hover:scale-100 hover:bg-destructive/90 hover:shadow-none",
                )}
              >
                {deletingProject ? "Deleting..." : "Delete project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [projectError, setProjectError] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationValue, setDeleteConfirmationValue] = useState("");
  const [projectPendingDelete, setProjectPendingDelete] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const switcherRef = useRef(null);
  const { isAdmin } = useWorkspaceAccess(workspaceId);

  const workspaces = useMockStore((state) => state.workspaces || []);
  const projects = useMockStore((state) => state.projects || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId],
  );
  const workspaceProjects = useMemo(
    () => projects.filter((item) => item.workspaceId === workspaceId),
    [projects, workspaceId],
  );
  const { selectedProject, updateProjectSelection } =
    useWorkspaceProjectSelection(workspaceId, workspaceProjects);

  useEffect(() => {
    loadDashboard({ force: true }).catch(() => {});
  }, []);

  useEffect(() => {
    const projectParam = searchParams.get("project") || "";
    if (!workspaceId || !projectParam) return;

    writeSelectedProjectId(workspaceId, projectParam);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("project");
    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams, workspaceId]);

  useEffect(() => {
    setProjectError("");
    setProjectDialogOpen(false);
    setProjectSwitcherOpen(false);
    setDeleteDialogOpen(false);
    setDeleteConfirmationValue("");
    setProjectPendingDelete(null);
    setProjectName("");
    setProjectKey("");
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event) {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(event.target)
      ) {
        setProjectSwitcherOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    function openProjectDialog() {
      if (!isAdmin) return;
      setProjectError("");
      setProjectDialogOpen(true);
    }

    window.addEventListener("zyplo-open-project-dialog", openProjectDialog);
    return () =>
      window.removeEventListener("zyplo-open-project-dialog", openProjectDialog);
  }, [isAdmin]);

  useEffect(() => {
    const main = document.querySelector("main");
    let previousScrollY = main.scrollTop;
    let timeoutId;

    const onScroll = () => {
      const currentScrollY = main.scrollTop;
      setHeaderVisible(currentScrollY <= previousScrollY);
      previousScrollY = currentScrollY;
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setHeaderVisible(true);
      }, 150);
    };

    main.addEventListener("scroll", onScroll);

    return () => {
      main.removeEventListener("scroll", onScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  async function handleCreateProject() {
    const name = projectName.trim();
    if (!name || !workspaceId || creatingProject) return;

    try {
      setCreatingProject(true);
      setProjectError("");
      const project = await createProject(workspaceId, name, projectKey.trim());
      setProjectName("");
      setProjectKey("");
      setProjectDialogOpen(false);
      updateProjectSelection(String(project?.id || ""));
    } catch (error) {
      setProjectError(error?.message || "Failed to create project");
    } finally {
      setCreatingProject(false);
    }
  }

  async function deleteProject(projectToDelete) {
    if (!projectToDelete?.id || deletingProject) return;
    try {
      setDeletingProject(true);
      const response = await fetch(`/api/dashboard/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text ? { message: text } : null;
      }
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to delete project");
      }

      await loadDashboard({ force: true });
      const remaining = workspaceProjects.filter(
        (project) => String(project.id) !== String(projectToDelete.id),
      );
      updateProjectSelection(String(remaining[0]?.id || ""));
      setProjectSwitcherOpen(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmationValue("");
      setProjectPendingDelete(null);
      toast.success(`Deleted Project "${projectToDelete.name}"`);
    } catch (error) {
      toast.error(error?.message || "Failed to delete project");
    } finally {
      setDeletingProject(false);
    }
  }

  function handleDeleteProject() {
    if (!selectedProject?.id || deletingProject) return;
    setProjectError("");
    setProjectSwitcherOpen(false);
    setProjectPendingDelete(selectedProject);
    setDeleteConfirmationValue("");
    setDeleteDialogOpen(true);
  }

  return (
    <>
      <motion.div
        animate={{ y: headerVisible ? 0 : "-100%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="sticky top-0 z-20 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-7"
      >
        <section className="border-b border-border/80 bg-background">
          <div className="px-3 py-1 sm:px-4 md:px-6 lg:px-7">
          {/* grandparent of left-right*/}
          <div className="flex flex-col"> 
              {/* Direct parent of left-right*/}
            <div className="flex flex-col gap-3  lg:flex-row lg:items-center lg:justify-between pt-2">

              {/* left side workspace name & project */}
              <div className="flex min-w-0 items-center flex-wrap gap-x-1.5 gap-y-1 text-sm">
                <span className="min-w-0 truncate text-xl font-bold tracking-tight text-foreground">
                  {workspace?.name || "Loading workspace..."}
                </span>
                <span className="text-muted-foreground/55">/</span>

                <div ref={switcherRef} className="relative min-w-0">
                  <button
                    type="button"
                    onClick={() => setProjectSwitcherOpen((current) => !current)}
                    disabled={!workspaceProjects.length}
                    aria-haspopup="menu"
                    aria-expanded={projectSwitcherOpen}
                    className={cn(
                      dashboardContextButtonClasses,
                      "inline-flex max-w-full items-center gap-1 rounded-lg px-1.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                  >
                    <span className="truncate font-medium">
                      {selectedProject?.name || "No project yet"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground/75 transition",
                        projectSwitcherOpen ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {projectSwitcherOpen && workspaceProjects.length ? (
                    <div className="absolute left-0 top-full z-30 mt-2 min-w-[16rem] rounded-xl border border-border bg-popover p-1 text-popover-foreground">
                      <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Switch project
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {workspaceProjects.map((project) => {
                          const active =
                            String(project.id) === String(selectedProject?.id || "");
                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => {
                                updateProjectSelection(String(project.id));
                                setProjectSwitcherOpen(false);
                              }}
                              className={cn(
                                active
                                  ? dashboardActiveSurfaceClasses
                                  : dashboardMenuItemClasses,
                                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                              )}
                            >
                              <span className="truncate">{project.name}</span>
                              {active ? (
                                <span className="ml-3 text-[12px] font-medium">
                                  Current
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      {isAdmin && selectedProject?.id ? (
                        <div className="mt-1 border-t border-border pt-1">
                          <button
                            type="button"
                            onClick={handleDeleteProject}
                            disabled={deletingProject}
                            className={cn(
                              dashboardMenuItemDangerClasses,
                              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60",
                            )}
                          >
                            <Trash2 className="size-4" />
                            {deletingProject ? "Deleting..." : "Delete project"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

{/* right side settings &  new project*/}
{isAdmin ? (
              <div className="flex items-center gap-2 lg:justify-end">
                
                  <button
                    type="button"
                    onClick={() => {
                      setProjectError("");
                      setProjectDialogOpen(true);
                    }}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none",
                    )}
                  >
                    <Plus className="size-4" />
                    New Project
                  </button>
                

                <Link
                  href={`/dashboard/w/${workspaceId}/settings`}
                  className={cn(
                    dashboardContextButtonClasses,
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm",
                  )}
                >
                  <Settings className="size-4" />
                  Settings
                </Link>
              </div>
): null}
            </div>

                <div className="-mx-1 overflow-x-auto">
              <nav
                aria-label="Workspace navigation"
                className="flex min-w-max items-center gap-1 -ml-2"
              >
                {NAV_ITEMS.map((item) => {
                  const baseHref = item.href(workspaceId);
                  const active = pathname === baseHref;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={baseHref}
                      className={cn(
                        active
                          ? dashboardInlineNavItemActiveClasses
                          : dashboardInlineNavItemClasses,
                        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          </div>
        </section>
      </motion.div>

      <div className="pt-4 sm:pt-5">{children}</div>

      <ProjectCreateDialog
        open={projectDialogOpen}
        onClose={() => {
          if (creatingProject) return;
          setProjectDialogOpen(false);
          setProjectError("");
        }}
        onSubmit={handleCreateProject}
        projectName={projectName}
        setProjectName={setProjectName}
        projectKey={projectKey}
        setProjectKey={setProjectKey}
        creatingProject={creatingProject}
        projectError={projectError}
      />

      <DeleteProjectDialog
        open={deleteDialogOpen}
        project={projectPendingDelete}
        confirmationValue={deleteConfirmationValue}
        setConfirmationValue={setDeleteConfirmationValue}
        deletingProject={deletingProject}
        onClose={() => {
          if (deletingProject) return;
          setDeleteDialogOpen(false);
          setDeleteConfirmationValue("");
          setProjectPendingDelete(null);
        }}
        onConfirm={() => deleteProject(projectPendingDelete)}
      />
    </>
  );
}
