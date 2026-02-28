"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMockStore } from "@/components/dashboard/mockStore";

export default function WorkspaceTimelinePage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const tasks = useMockStore((state) => state.tasks || []);

  const items = useMemo(() => {
    return [...tasks]
      .filter((task) => task.workspaceId === workspaceId)
      .sort((a, b) => {
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return ad - bd;
      });
  }, [tasks, workspaceId]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Timeline</h2>
      <div className="space-y-2">
        {items.map((task) => (
          <div key={task.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10">
            <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {task.dueDate ? `Due ${task.dueDate}` : "No due date"} | {task.status || "todo"} | {task.projectName || "No project"}
            </p>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No tasks to show in timeline.</p> : null}
      </div>
    </section>
  );
}
