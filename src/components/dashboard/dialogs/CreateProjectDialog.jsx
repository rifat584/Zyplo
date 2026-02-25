"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, useMockStore } from "../mockStore";

export default function CreateProjectDialog({ open, onOpenChange, workspaceId, onCreated }) {
  const workspaces = useMockStore((s) => s.workspaces);
  const defaultWorkspace = useMemo(() => workspaceId || workspaces[0]?.id || "", [workspaceId, workspaces]);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(defaultWorkspace);
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("blank");

  useEffect(() => {
    if (open) {
      setSelectedWorkspaceId(defaultWorkspace);
      setName("");
      setTemplate("blank");
    }
  }, [open, defaultWorkspace]);

  const key = (name || "PRJ")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 4) || "PRJ";

  const submit = (event) => {
    event.preventDefault();
    if (!selectedWorkspaceId || !name.trim()) return;

    const project = createProject(selectedWorkspaceId, { name: name.trim(), key, template });
    onOpenChange(false);
    onCreated?.(project, selectedWorkspaceId);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/35"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create Project</h3>
              <button type="button" onClick={() => onOpenChange(false)} className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="size-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {!workspaceId ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace</label>
                  <select
                    value={selectedWorkspaceId}
                    onChange={(event) => setSelectedWorkspaceId(event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {workspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project name</label>
                <Input value={name} onChange={(event) => setName(event.target.value)} required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Key (auto)</label>
                <Input value={key} readOnly />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Template</label>
                <select
                  value={template}
                  onChange={(event) => setTemplate(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="blank">Blank</option>
                  <option value="kanban">Kanban Starter</option>
                  <option value="sprint">Sprint Planning</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
