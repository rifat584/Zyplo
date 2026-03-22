"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMockStore, useWorkspaceAccess } from "@/components/dashboard/mockStore";

function formatConnectedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const { isAdmin } = useWorkspaceAccess(workspaceId);
  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );

  const [name, setName] = useState(workspace?.name || "");
  const [githubStatus, setGithubStatus] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState("");
  const [githubDisconnecting, setGithubDisconnecting] = useState(false);

  useEffect(() => {
    setName(workspace?.name || "");
  }, [workspace?.name]);

  const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "";
  const connectUrl = useMemo(() => {
    if (!appSlug || !workspaceId) return "";
    return `https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(workspaceId)}`;
  }, [appSlug, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !isAdmin) return;
    let alive = true;

    async function loadGithubStatus() {
      try {
        setGithubLoading(true);
        setGithubError("");

        const res = await fetch(
          `/api/dashboard/github/status?workspaceId=${encodeURIComponent(workspaceId)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const message = String(data?.error || data?.message || "").trim();
          throw new Error(message || "Failed to load GitHub status.");
        }

        if (!alive) return;
        setGithubStatus(data);
      } catch (err) {
        if (!alive) return;
        setGithubError(String(err?.message || "Failed to load GitHub status."));
      } finally {
        if (alive) setGithubLoading(false);
      }
    }

    loadGithubStatus();
    return () => {
      alive = false;
    };
  }, [workspaceId, isAdmin]);

  async function refreshGithubStatus() {
    if (!workspaceId || !isAdmin) return;
    try {
      setGithubLoading(true);
      setGithubError("");
      const res = await fetch(
        `/api/dashboard/github/status?workspaceId=${encodeURIComponent(workspaceId)}`,
        { cache: "no-store" },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = String(data?.error || data?.message || "").trim();
        throw new Error(message || "Failed to load GitHub status.");
      }
      setGithubStatus(data);
    } catch (err) {
      setGithubError(String(err?.message || "Failed to load GitHub status."));
    } finally {
      setGithubLoading(false);
    }
  }

  async function disconnectGithub() {
    if (!workspaceId || !isAdmin || githubDisconnecting) return;
    setGithubDisconnecting(true);
    setGithubError("");
    try {
      const res = await fetch("/api/dashboard/github/disconnect", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message = String(data?.error || data?.message || "").trim();
        throw new Error(message || "Failed to disconnect GitHub.");
      }
      await refreshGithubStatus();
    } catch (err) {
      setGithubError(String(err?.message || "Failed to disconnect GitHub."));
    } finally {
      setGithubDisconnecting(false);
    }
  }

  if (!isAdmin) {
    return (
      <section className="space-y-4 rounded-2xl border border-warning/25 bg-warning/10 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warning">
          Workspace Settings
        </h2>
        <p className="text-sm text-warning">
          You do not have access to workspace settings.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-4 dark:border-white/10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Workspace Settings
      </h2>

      {(() => {
        const githubParam = String(searchParams.get("github") || "");
        if (githubParam === "connected") {
          return (
            <div className="rounded-xl border border-success/25 bg-success/10 p-3 text-sm text-success">
              GitHub connected successfully.
            </div>
          );
        }
        if (githubParam === "cancelled") {
          return (
            <div className="rounded-xl border border-border bg-muted/50 p-3 text-sm text-foreground">
              GitHub connection was cancelled.
            </div>
          );
        }
        if (githubParam === "error") {
          return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive">
              GitHub connection failed. Please try again.
            </div>
          );
        }
        return null;
      })()}

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Workspace Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none dark:border-white/10 dark:bg-surface dark:text-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Rename is UI-only right now. Tell me and I will wire backend update endpoint.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-3 text-xs text-muted-foreground dark:border-white/10 dark:bg-surface/40">
        <p>Workspace ID: {workspaceId}</p>
        <p>Members: {workspace?.members?.length || 0}</p>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border p-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-card dark:bg-white/10">
            <svg viewBox="0 0 24 24" fill="white" className="size-4">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              GitHub
            </p>
            <p className="text-xs text-muted-foreground">
              {githubLoading
                ? "Checking connection..."
                : githubStatus?.connected
                  ? "Connected · activity will appear on tasks"
                  : "Not connected"}
            </p>
            {!githubLoading && githubStatus?.connectedAt ? (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Connected at: {formatConnectedAt(githubStatus.connectedAt)}
              </p>
            ) : null}
            {!githubLoading && githubError ? (
              <p className="mt-1 text-[11px] text-destructive dark:text-destructive">
                {githubError}
              </p>
            ) : null}
          </div>
        </div>

        {githubStatus?.connected ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Connected
            </span>
            <button
              type="button"
              onClick={disconnectGithub}
              disabled={githubDisconnecting || githubLoading}
              className="cursor-pointer rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/100/15"
            >
              {githubDisconnecting ? "Disconnecting..." : "Disconnect"}
            </button>
          </div>
        ) : (
          <a
            href={connectUrl || "#"}
            aria-disabled={!connectUrl}
            onClick={(event) => {
              if (!connectUrl) event.preventDefault();
            }}
            className={[
              "cursor-pointer rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary dark:bg-primary dark:hover:bg-primary",
              !connectUrl ? "cursor-not-allowed opacity-50 pointer-events-none" : "",
            ].join(" ")}
            title={!appSlug ? "NEXT_PUBLIC_GITHUB_APP_SLUG is missing" : undefined}
          >
            Connect GitHub
          </a>
        )}
      </div>
    </section>
  );
}
