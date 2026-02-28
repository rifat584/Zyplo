"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/dashboard/chrome";
import { createWorkspace, getState, loadDashboard, useMockStore } from "@/components/dashboard/mockStore";

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
    if (status === "authenticated") loadDashboard({ force: true }).catch(() => {});
  }, [status]);

  useEffect(() => {
    if (!loaded) return;
    setOnboardingOpen(workspaces.length === 0);
  }, [loaded, workspaces.length]);

  const sortedWorkspaces = useMemo(
    () => [...workspaces].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [workspaces]
  );

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
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Workspaces</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create a workspace, then manage everything from its dedicated route.
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
              <button
                key={workspace.id}
                type="button"
                onClick={() => router.push(`/dashboard/w/${workspace.id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800/40"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">{workspace.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{workspace.members?.length || 0} members</span>
              </button>
            ))}
            {!sortedWorkspaces.length ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No workspace yet. Create your first workspace.</p>
            ) : null}
          </div>
        </section>
      </div>

      {onboardingOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={() => setOnboardingOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create Workspace</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Add workspace name and optional member emails.</p>
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
            {errorText ? <p className="mt-3 text-sm text-rose-600">{errorText}</p> : null}
          </div>
        </div>
      ) : null}

      {!loaded || loading ? <div className="pointer-events-none fixed inset-0 z-40 bg-transparent" /> : null}
    </AppShell>
  );
}
