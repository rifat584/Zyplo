"use client";

import { useParams } from "next/navigation";
import { AlertTriangle, Globe2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "../../../../_lib/mockStore";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);

  if (!workspace) return <p className="text-sm text-slate-600">Workspace not found.</p>;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Workspace Settings</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">General Configuration</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Update workspace identity and defaults.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace name</label>
            <Input defaultValue={workspace.name} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
            <Input defaultValue={workspace.slug} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Timezone</label>
            <Input defaultValue="UTC+06:00" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Week starts on</label>
            <Input defaultValue="Monday" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Default language</label>
            <Input defaultValue="English (US)" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Public URL</label>
            <Input defaultValue={`${workspace.slug}.zyplo.app`} />
          </div>
        </div>

        <Button>Save changes</Button>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Shield className="size-3.5" />
            Security
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">SSO and 2FA are enforced for admins in this test workspace.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Globe2 className="size-3.5" />
            Domain
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Workspace URL: <span className="font-medium text-slate-800 dark:text-slate-100">{workspace.slug}.zyplo.app</span></p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
          <p className="mb-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">
            <AlertTriangle className="size-3.5" />
            Danger Zone
          </p>
          <p className="mb-3 text-sm text-rose-700/90 dark:text-rose-200">Archiving will lock writes and hide the workspace from default views.</p>
          <Button variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/20">
            Archive Workspace
          </Button>
        </div>
      </aside>
    </div>
  );
}
