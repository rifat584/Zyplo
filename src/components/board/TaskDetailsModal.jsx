"use client";

import { useEffect, useMemo, useState } from "react";

const PRIORITY_OPTIONS = [
  { value: "P0", label: "P0 (Critical)" },
  { value: "P1", label: "P1 (High)" },
  { value: "P2", label: "P2 (Medium)" },
  { value: "P3", label: "P3 (Low)" },
];

const BASE_STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  assigneeId: "",
  dueDate: "",
  priority: "P2",
  status: "todo",
};

function toDateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function TaskDetailsModal({
  open,
  task,
  members = [],
  submitting = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open || !task) return;
    setForm({
      title: String(task.title || ""),
      description: String(task.description || ""),
      assigneeId: String(task.assigneeId || ""),
      dueDate: toDateInputValue(task.dueDate),
      priority: String(task.priority || "P2").toUpperCase(),
      status: String(task.status || "todo"),
    });
  }, [open, task]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !submitting) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open, submitting]);

  const statusOptions = useMemo(() => {
    const current = String(form.status || "");
    if (!current) return BASE_STATUS_OPTIONS;
    const exists = BASE_STATUS_OPTIONS.some((item) => item.value === current);
    if (exists) return BASE_STATUS_OPTIONS;
    return [...BASE_STATUS_OPTIONS, { value: current, label: current }];
  }, [form.status]);

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={() => (submitting ? null : onClose())}
        className="absolute inset-0 bg-slate-950/45"
        aria-label="Close task details modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Task Details
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {task.title || "Untitled Task"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Created: {formatDateTime(task.createdAt)}
          </p>
        </div>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!form.title.trim() || submitting) return;
            onSubmit({
              title: form.title.trim(),
              description: form.description.trim(),
              assigneeId: form.assigneeId,
              dueDate: form.dueDate,
              priority: form.priority,
              status: form.status,
            });
          }}
        >
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            placeholder="Task title"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            required
          />

          <textarea
            rows={5}
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            placeholder="Description"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <select
              value={form.assigneeId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, assigneeId: event.target.value }))
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, dueDate: event.target.value }))
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            />

            <select
              value={form.priority}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, priority: event.target.value }))
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              {PRIORITY_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, status: event.target.value }))
              }
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
            <p>Task ID: {task.id}</p>
            <p>Project: {task.projectName || "Unknown Project"}</p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 disabled:opacity-50 dark:border-white/10 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || submitting}
              className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
