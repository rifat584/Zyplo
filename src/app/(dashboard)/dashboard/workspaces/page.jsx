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

// --- BULLETPROOF STARRED WORKSPACES HOOK ---
const STARRED_KEY = "dashboard.starredWorkspaces";

function useStarredWorkspaces() {
  const currentUser = useMockStore((state) => state.currentUser || null);
  const [starredIds, setStarredIds] = useState([]);

  // 1. Instant Load: Read from LocalStorage so refresh works instantly
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STARRED_KEY);
      if (stored) setStarredIds(JSON.parse(stored));
    } catch {}
  }, []);

  // 2. Database Truth Sync: The DB is the ultimate source of truth.
  useEffect(() => {
    if (currentUser && Array.isArray(currentUser.starredWorkspaceIds)) {
      setStarredIds(currentUser.starredWorkspaceIds);
      try {
        localStorage.setItem(STARRED_KEY, JSON.stringify(currentUser.starredWorkspaceIds));
      } catch {}
    }
  }, [currentUser?.starredWorkspaceIds]);

  // 3. Cross-Component Sync: Keep sidebar and page in sync instantly
  useEffect(() => {
    const sync = (e) => {
      if (e.detail) setStarredIds(e.detail);
    };
    window.addEventListener("zyplo-stars-updated", sync);
    return () => window.removeEventListener("zyplo-stars-updated", sync);
  }, []);

  const toggleStar = async (workspaceId) => {
    const isCurrentlyStarred = starredIds.includes(workspaceId);
    const nextStarred = isCurrentlyStarred
      ? starredIds.filter((id) => id !== workspaceId)
      : [...starredIds, workspaceId];

    // 4. Optimistic UI Update & Save to LocalStorage
    setStarredIds(nextStarred);
    try {
      localStorage.setItem(STARRED_KEY, JSON.stringify(nextStarred));
    } catch {}
    
    window.dispatchEvent(
      new CustomEvent("zyplo-stars-updated", { detail: nextStarred })
    );

    // 5. PIGGYBACK ON THE PROFILE ROUTE (Bypasses all 404/405 errors!)
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-silent-fetch": "true", // Invisible to the global loader
        },
        body: JSON.stringify({
          starredWorkspaceIds: nextStarred,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend rejected the save: ${response.status}`);
      }

      // Force the store to quietly re-fetch to guarantee perfect sync
      await loadDashboard({ force: true, silent: true });

    } catch (error) {
      console.error("Star sync failed:", error);
      toast.error("Failed to save star to database!");
      
      // Revert the star visually if the database save failed
      setStarredIds(starredIds);
      window.dispatchEvent(
        new CustomEvent("zyplo-stars-updated", { detail: starredIds })
      );
    }
  };

  return { starredIds, toggleStar };
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

  const { starredIds, toggleStar } = useStarredWorkspaces();
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

  // --- SPLIT WORKSPACES INTO TWO GROUPS ---
  const starredWorkspaces = useMemo(() => {
    return workspaces
      .filter((w) => starredIds.includes(w.id))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [workspaces, starredIds]);

  const otherWorkspaces = useMemo(() => {
    return workspaces
      .filter((w) => !starredIds.includes(w.id))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [workspaces, starredIds]);

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
      router.push(`/dashboard/w/${workspace.id}/board`);
    } catch (error) {
      setErrorText(error?.message || "Failed to create workspace");
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to render a single workspace card to avoid duplication
  const renderWorkspaceCard = (workspace) => {
    const isAdmin = resolveWorkspaceRole(workspace, currentUser) === "admin";
    const isStarred = starredIds.includes(workspace.id);

    return (
      <div
        key={workspace.id}
        className="group relative rounded-xl border border-border px-3 py-3 text-left hover:bg-(--dashboard-hover)"
      >
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
            <span className="font-medium text-foreground flex items-center gap-2">
              {workspace.name}
              {isStarred ? (
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
              ) : null}
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
                toggleStar(workspace.id);
                toast.success(
                  isStarred
                    ? `Removed ${workspace.name} from starred`
                    : `Added ${workspace.name} to starred`
                );
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-(--dashboard-hover)"
            >
              <Star
                className={cn(
                  "size-4",
                  isStarred ? "fill-amber-400 text-amber-400" : ""
                )}
              />
              {isStarred ? "Unstar workspace" : "Add to starred"}
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
      </div>
    );
  };

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

          {/* --- STARRED SECTION (Only shows if there are starred workspaces) --- */}
          {starredWorkspaces.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Starred
              </h2>
              <div className="space-y-2">
                {starredWorkspaces.map(renderWorkspaceCard)}
              </div>
            </section>
          )}

          {/* --- OTHER WORKSPACES SECTION --- */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {starredWorkspaces.length > 0 ? "Other Workspaces" : "Existing Workspaces"}
            </h2>
            <div className="space-y-2">
              {otherWorkspaces.map(renderWorkspaceCard)}
              
              {!otherWorkspaces.length && !starredWorkspaces.length ? (
                <p className="text-sm text-muted-foreground">
                  No workspace yet. Create your first workspace.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      )}

      {/* --- MODALS BELOW --- */}
      {onboardingOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOnboardingOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <h3 className="text-foreground font-semibold">
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
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-card/45"
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