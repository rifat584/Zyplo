"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ellipsis,
  Plus,
  Settings,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import AppShell from "@/components/dashboard/chrome";
import {
  createWorkspace,
  deleteWorkspace,
  getState,
  loadDashboard,
  resolveWorkspaceRole,
  useMockStore,
} from "@/components/dashboard/mockStore";

const WORKSPACE_BADGE_GRADIENTS = [
  "from-primary to-secondary text-primary-foreground",
  "from-emerald-500 to-teal-400 text-white",
  "from-amber-500 to-orange-500 text-white",
  "from-rose-500 to-pink-500 text-white",
  "from-sky-500 to-cyan-400 text-white",
  "from-violet-500 to-fuchsia-500 text-white",
  "from-lime-500 to-emerald-500 text-white",
  "from-blue-500 to-indigo-500 text-white",
  "from-red-500 to-orange-400 text-white",
  "from-slate-500 to-zinc-400 text-white",
];

function pickWorkspaceGradient(workspace) {
  const key = workspace?.id ?? workspace?.name ?? "workspace";
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return WORKSPACE_BADGE_GRADIENTS[hash % WORKSPACE_BADGE_GRADIENTS.length];
}

function getWorkspaceBadgeLabel(workspace) {
  const name = String(workspace?.name || "").trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
  }

  const compact = name.replace(/\s+/g, "");
  return (compact.slice(0, 2) || "WS").toUpperCase();
}

// --- SKELETON COMPONENT ---
function WorkspacesSkeleton() {
  return (
    <div className="mx-auto mt-6 max-w-5xl space-y-6 animate-pulse">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-md bg-muted"></div>
          <div className="h-4 w-72 rounded-md bg-muted"></div>
        </div>
        <div className="h-9 w-36 rounded-lg bg-muted"></div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-4 h-4 w-40 rounded-md bg-muted"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border px-3 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-muted"></div>
                <div className="h-5 w-32 rounded-md bg-muted"></div>
              </div>
              <div className="h-4 w-20 rounded-md bg-muted"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function WorkspacesPage() {
  const router = useRouter();
  const { status } = useSession();
  const { loaded, loading, workspaces, currentUser } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
    workspaces: state.workspaces,
    currentUser: state.currentUser,
  }));

  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [onboardingEmails, setOnboardingEmails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const actionsMenuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        await loadDashboard({ force: true });
      } catch {
        // ignore, retried below
      }
      if (cancelled) return;
      if ((getState().workspaces?.length || 0) === 0) {
        setTimeout(() => {
          if (!cancelled) loadDashboard({ force: true }).catch(() => {});
        }, 500);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadDashboard({ force: true }).catch(() => {});
    }
  }, [status]);

  useEffect(() => {
    if (!loaded) return;
    setOnboardingOpen(workspaces.length === 0);
  }, [loaded, workspaces.length]);

  const sortedWorkspaces = useMemo(
    () =>
      [...workspaces].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      ),
    [workspaces],
  );

  useEffect(() => {
    function onPointerDown(event) {
      if (!menuOpenFor) return;
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target)
      ) {
        setMenuOpenFor("");
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpenFor]);

  async function handleCreateWorkspace() {
    const name = workspaceName.trim();
    if (!name) return;

    const emails = onboardingEmails
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      setErrorText("");
      const workspace = await createWorkspace(name, emails);
      setWorkspaceName("");
      setOnboardingEmails("");
      setOnboardingOpen(false);
      router.push(`/dashboard/w/${workspace.id}`);
    } catch (error) {
      setErrorText(error?.message || "Failed to create workspace");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      {!loaded || loading ? (
        <WorkspacesSkeleton />
      ) : (
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
            <div>
              <h1 className="text-2xl mt-6 mb-2 font-semibold text-foreground">
                Workspaces
              </h1>
              <p className="text-sm text-muted-foreground">
                Create a workspace, then manage everything from its dedicated
                route.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-4" />
              New workspace
            </button>
          </div>

          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Existing Workspaces
            </h2>
            <div className="space-y-2">
              {sortedWorkspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="group relative rounded-xl border border-border px-3 py-3 text-left hover:bg-(--dashboard-hover)"
                >
                  {(() => {
                    const isAdmin = resolveWorkspaceRole(workspace, currentUser) === "admin";
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/w/${workspace.id}`)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <span className="flex items-center gap-2">
                            {(() => {
                              const badgeLabel = getWorkspaceBadgeLabel(workspace);
                              const badgeGradient = pickWorkspaceGradient(workspace);
                              return (
                                <span
                                  className={`flex size-6 items-center justify-center rounded-md border border-border bg-linear-to-br text-[11px] font-semibold uppercase tracking-[0.06em] ${badgeGradient}`}
                                >
                                  {badgeLabel}
                                </span>
                              );
                            })()}
                            <span className="font-medium text-foreground">
                              {workspace.name}
                            </span>
                          </span>
                          <span className="pr-8 text-xs text-muted-foreground">
                            {workspace.members?.length || 0} members
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setMenuOpenFor((current) =>
                              current === workspace.id ? "" : workspace.id,
                            )
                          }
                          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-(--dashboard-hover) group-hover:block cursor-pointer"
                        >
                          <Ellipsis className="size-4" />
                        </button>

                        {menuOpenFor === workspace.id ? (
                          <div
                            ref={actionsMenuRef}
                            className="absolute right-2 top-12 z-20 w-56 rounded-xl border border-border bg-card p-1 shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setMenuOpenFor("");
                                toast.info(`Added ${workspace.name} to starred`);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-(--dashboard-hover)"
                            >
                              <Star className="size-4" />
                              Add to starred
                            </button>
                            {isAdmin ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenFor("");
                                    router.push(`/dashboard/w/${workspace.id}/members`);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-(--dashboard-hover)"
                                >
                                  <UserPlus className="size-4" />
                                  Add people
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenFor("");
                                    router.push(`/dashboard/w/${workspace.id}/settings`);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-(--dashboard-hover)"
                                >
                                  <Settings className="size-4" />
                                  Workspace settings
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenFor("");
                                    setConfirmDeleteId(workspace.id);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="size-4" />
                                  Delete workspace
                                </button>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              ))}
              {!sortedWorkspaces.length ? (
                <p className="text-sm text-muted-foreground">
                  No workspace yet. Create your first workspace.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      )}

      {onboardingOpen ? (
  <div className="fixed inset-0 z-50">
    <button
      type="button"
      className="absolute inset-0 bg-black/60"
      onClick={() => setOnboardingOpen(false)}
    />
    <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <h3 className="text-base font-semibold">
        Create Workspace
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Add workspace name and optional member emails.
      </p>
      <div className="mt-4 space-y-3">
        <input
          value={workspaceName}
          onChange={(event) => setWorkspaceName(event.target.value)}
          placeholder="Workspace name"
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-ring"
        />
        <textarea
          rows={3}
          value={onboardingEmails}
          onChange={(event) => setOnboardingEmails(event.target.value)}
          placeholder="member1@company.com, member2@company.com"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOnboardingOpen(false)}
          className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreateWorkspace}
          disabled={!workspaceName.trim() || submitting}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          Create
        </button>
      </div>
      {errorText ? (
        <p className="mt-3 text-sm text-destructive">{errorText}</p>
      ) : null}
    </div>
  </div>
) : null}

{confirmDeleteId ? (
  <div className="fixed inset-0 z-50">
    <button
      type="button"
      className="absolute inset-0 bg-black/65"
      onClick={() => (deleting ? null : setConfirmDeleteId(""))}
    />
    <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <h3 className="text-lg font-semibold text-foreground">
        Delete workspace?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        This action will remove the workspace and related projects/tasks
        permanently.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setConfirmDeleteId("")}
          disabled={deleting}
          className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={async () => {
            try {
              setDeleting(true);
              const deletingId = confirmDeleteId;
              await deleteWorkspace(deletingId);
              toast.success("Workspace deleted");
              setConfirmDeleteId("");
            } catch (error) {
              toast.error(error?.message || "Failed to delete workspace");
            } finally {
              setDeleting(false);
            }
          }}
          className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Workspace"}
        </button>
      </div>
    </div>
  </div>
) : null}

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-background/45"
            onClick={() => (deleting ? null : setConfirmDeleteId(""))}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">
              Delete workspace?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action will remove the workspace and related projects/tasks
              permanently.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId("")}
                disabled={deleting}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    const deletingId = confirmDeleteId;
                    await deleteWorkspace(deletingId);
                    toast.success("Workspace deleted");
                    setConfirmDeleteId("");
                  } catch (error) {
                    toast.error(error?.message || "Failed to delete workspace");
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Workspace"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}