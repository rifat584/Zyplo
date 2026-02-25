"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMockStore } from "./mockStore";

export default function CommandPalette({ open, onOpenChange, workspaceId, projectId, onCreateTask }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const workspaces = useMockStore((s) => s.workspaces);
  const projects = useMockStore((s) => s.projects);

  const actions = useMemo(() => {
    const base = [
      {
        id: "my-work",
        label: "Go to My Work",
        run: () => router.push("/dashBoardTest/my-work"),
      },
      {
        id: "workspaces",
        label: "Go to Workspaces",
        run: () => router.push("/dashBoardTest/workspaces"),
      },
    ];

    if (workspaceId && projectId) {
      base.unshift({
        id: "create-task",
        label: "Create task in current project",
        run: () => onCreateTask?.(),
      });
    }

    workspaces.forEach((workspace) => {
      base.push({
        id: `ws-${workspace.id}`,
        label: `Jump to workspace: ${workspace.name}`,
        run: () => router.push(`/dashBoardTest/w/${workspace.id}`),
      });
    });

    projects.forEach((project) => {
      base.push({
        id: `pr-${project.id}`,
        label: `Jump to project: ${project.name}`,
        run: () => router.push(`/dashBoardTest/w/${project.workspaceId}/p/${project.id}`),
      });
    });

    return base;
  }, [router, workspaces, projects, workspaceId, projectId, onCreateTask]);

  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-50 bg-slate-900/40"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed left-1/2 top-[10%] z-[60] max-h-[80vh] w-[92vw] max-w-2xl -translate-x-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Command Palette</p>
              <button type="button" onClick={() => onOpenChange(false)} className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="size-4 text-slate-500" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search actions"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="max-h-80 space-y-1 overflow-y-auto">
              {filtered.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    action.run();
                    onOpenChange(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {action.label}
                </button>
              ))}
              {filtered.length === 0 ? <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No results.</p> : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
