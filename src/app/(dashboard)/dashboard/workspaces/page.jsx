"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  Cpu,
  Ellipsis,
  FlaskConical,
  Landmark,
  Megaphone,
  PenTool,
  Plus,
  Rocket,
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
  useMockStore,
} from "@/components/dashboard/mockStore";

export default function WorkspacesPage() {
  const router = useRouter();
  const { status } = useSession();
  const { loaded, loading, workspaces } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
    workspaces: state.workspaces,
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
    if (status === "authenticated")
      loadDashboard({ force: true }).catch(() => {});
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

  const workspaceIcons = [
    {
      Icon: Rocket,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    },
    {
      Icon: BriefcaseBusiness,
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      Icon: PenTool,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    },
    {
      Icon: Megaphone,
      color: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    },
    {
      Icon: FlaskConical,
      color:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    },
    {
      Icon: Cpu,
      color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
    },
    {
      Icon: Landmark,
      color:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
    },
  ];

  const pickWorkspaceIcon = (workspace) => {
    const key = workspace?.id || workspace?.name || "workspace";
    let hash = 0;
    for (let i = 0; i < key.length; i += 1)
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return workspaceIcons[hash % workspaceIcons.length];
  };

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
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Workspaces
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create a workspace, then manage everything from its dedicated
              route.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="size-4" />
            New workspace
          </button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Existing Workspaces
          </h2>
          <div className="space-y-2">
            {sortedWorkspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="group relative rounded-xl border border-slate-200 px-3 py-3 text-left hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800/40"
              >
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/w/${workspace.id}`)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="flex items-center gap-2">
                    {(() => {
                      const { Icon, color } = pickWorkspaceIcon(workspace);
                      return (
                        <span
                          className={`flex size-6 items-center justify-center rounded-md ${color}`}
                        >
                          <Icon className="size-4" />
                        </span>
                      );
                    })()}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {workspace.name}
                    </span>
                  </span>
                  <span className="pr-8 text-xs text-slate-500 dark:text-slate-400">
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
                  className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-200/70 group-hover:block dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Ellipsis className="size-4" />
                </button>

                {menuOpenFor === workspace.id ? (
                  <div
                    ref={actionsMenuRef}
                    className="absolute right-2 top-12 z-20 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-slate-900"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpenFor("");
                        toast.info(`Added ${workspace.name} to starred`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Star className="size-4" />
                      Add to starred
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpenFor("");
                        router.push(`/dashboard/w/${workspace.id}/members`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
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
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="size-4" />
                      Delete workspace
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
            {!sortedWorkspaces.length ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No workspace yet. Create your first workspace.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {onboardingOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOnboardingOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Create Workspace
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Add workspace name and optional member emails.
            </p>
            <div className="mt-4 space-y-3">
              <input
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Workspace name"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
              <textarea
                rows={3}
                value={onboardingEmails}
                onChange={(event) => setOnboardingEmails(event.target.value)}
                placeholder="member1@company.com, member2@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOnboardingOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWorkspace}
                disabled={!workspaceName.trim() || submitting}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
              >
                Create
              </button>
            </div>
            {errorText ? (
              <p className="mt-3 text-sm text-rose-600">{errorText}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45"
            onClick={() => (deleting ? null : setConfirmDeleteId(""))}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Delete workspace?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This action will remove the workspace and related projects/tasks
              permanently.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId("")}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200"
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
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Workspace"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!loaded || loading ? (
        <div className="pointer-events-none fixed inset-0 z-40 bg-transparent" />
      ) : null}
    </AppShell>
  );
}
