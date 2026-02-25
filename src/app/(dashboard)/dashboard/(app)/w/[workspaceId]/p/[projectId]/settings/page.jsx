"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle, KanbanSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMockStore } from "@/components/dashboard/mockStore";

export default function ProjectSettingsPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const project = useMockStore((s) => s.projects.find((item) => item.id === projectId && item.workspaceId === workspaceId) || null);
  const tasks = useMockStore((s) => s.tasks.filter((task) => task.projectId === projectId));

  const [name, setName] = useState(project?.name || "");
  const [key, setKey] = useState(project?.key || "");
  const [defaultView, setDefaultView] = useState("board");
  const [autoArchiveDays, setAutoArchiveDays] = useState("30");

  const meta = useMemo(() => {
    const open = tasks.filter((task) => task.status !== "done").length;
    const p1 = tasks.filter((task) => task.priority === "P1" && task.status !== "done").length;
    return { open, p1, total: tasks.length };
  }, [tasks]);

  if (!project) return <p className="text-sm text-slate-600 dark:text-slate-400">Project not found.</p>;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Project Settings</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Configuration</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Control naming, defaults, and workflow behavior for this project.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project key</label>
            <Input value={key} onChange={(event) => setKey(event.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Default view</label>
            <select
              value={defaultView}
              onChange={(event) => setDefaultView(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="board">Board</option>
              <option value="list">List</option>
              <option value="activity">Activity</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Auto archive done tasks</label>
            <select
              value={autoArchiveDays}
              onChange={(event) => setAutoArchiveDays(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="14">After 14 days</option>
              <option value="30">After 30 days</option>
              <option value="60">After 60 days</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
          <div className="mb-2 flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="size-4" />
            <p className="text-sm font-semibold">Danger zone</p>
          </div>
          <p className="mb-3 text-sm text-rose-700/90 dark:text-rose-300/90">
            Archiving or deleting this project would impact all related tasks and activity history.
          </p>
          <Button variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/20">
            Archive Project
          </Button>
        </div>

        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <KanbanSquare className="size-4" />
            <p className="text-sm font-semibold">Project Snapshot</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Total tasks</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{meta.total}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Open tasks</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{meta.open}</span>
            </div>
            <div className="flex items-center justify-between text-rose-700 dark:text-rose-300">
              <span>P1 remaining</span>
              <span className="font-semibold">{meta.p1}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
