"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useMockStore, useWorkspaceAccess } from "@/components/dashboard/mockStore";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const { isAdmin } = useWorkspaceAccess(workspaceId);
  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );

  const [name, setName] = useState(workspace?.name || "");

  if (!isAdmin) {
    return (
      <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          Workspace Settings
        </h2>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          You do not have access to workspace settings.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Workspace Settings
      </h2>

      <div className="space-y-1">
        <label className="text-xs text-slate-500 dark:text-slate-400">Workspace Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Rename is UI-only right now. Tell me and I will wire backend update endpoint.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-300">
        <p>Workspace ID: {workspaceId}</p>
        <p>Members: {workspace?.members?.length || 0}</p>
      </div>
    </section>
  );
}
