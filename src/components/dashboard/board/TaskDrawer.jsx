"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { updateTask, useMockStore } from "../mockStore";

/*
  TaskDrawer props:
    - open
    - task
    - workspaceId
    - onOpenChange
*/
export default function TaskDrawer({ open, task, workspaceId, onOpenChange }) {
  const members = useMockStore((s) => s.workspaces.find((workspace) => workspace.id === workspaceId)?.members || []);
  const activity = useMockStore((s) => s.activity.filter((entry) => entry.taskId === task?.id).slice(0, 8));
  const [tab, setTab] = useState("comments");

  const [form, setForm] = useState({
    status: "todo",
    priority: "P2",
    assignee: "",
    dueDate: "",
    tags: "",
    description: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        status: task.status || "todo",
        priority: task.priority || "P2",
        assignee: task.assignee || members[0]?.id || "",
        dueDate: task.dueDate || "",
        tags: (task.tags || []).join(", "),
        description: task.description || "",
      });
    }
  }, [task, members]);

  const comments = useMemo(
    () => [
      { id: "c1", actor: "Rifat Hasan", text: "Let’s keep this in current sprint." },
      { id: "c2", actor: "Ayesha Noor", text: "I can take review after design pass." },
    ],
    []
  );

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-slate-900/35" onClick={() => onOpenChange(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{task.title}</h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <label className="text-xs text-slate-600 dark:text-slate-300">
            Status
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-slate-900"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label className="text-xs text-slate-600 dark:text-slate-300">
            Priority
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-slate-900"
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </label>

          <label className="text-xs text-slate-600 dark:text-slate-300">
            Assignee
            <select
              value={form.assignee}
              onChange={(event) => setForm((prev) => ({ ...prev, assignee: event.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-slate-900"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </label>

          <label className="text-xs text-slate-600 dark:text-slate-300">
            Due date
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-slate-900"
            />
          </label>
        </div>

        <label className="mb-3 block text-xs text-slate-600 dark:text-slate-300">
          Tags
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-slate-900"
          />
        </label>

        <label className="mb-4 block text-xs text-slate-600 dark:text-slate-300">
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
          />
        </label>

        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab("comments")}
            className={`rounded-lg px-3 py-1.5 text-xs ${tab === "comments" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
          >
            Comments
          </button>
          <button
            type="button"
            onClick={() => setTab("activity")}
            className={`rounded-lg px-3 py-1.5 text-xs ${tab === "activity" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
          >
            Activity
          </button>
        </div>

        <div className="space-y-2">
          {tab === "comments"
            ? comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-white/10">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{comment.actor}</p>
                  <p className="text-slate-600 dark:text-slate-300">{comment.text}</p>
                </div>
              ))
            : activity.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-white/10">
                  <p className="text-slate-700 dark:text-slate-200">
                    <span className="font-medium">{entry.actor}</span> {entry.message}
                  </p>
                </div>
              ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              updateTask(task.id, {
                status: form.status,
                priority: form.priority,
                assignee: form.assignee,
                dueDate: form.dueDate,
                tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
                description: form.description,
              });
              onOpenChange(false);
            }}
            className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Save
          </button>
        </div>
      </aside>
    </div>
  );
}
