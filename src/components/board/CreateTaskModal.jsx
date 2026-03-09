"use client";

import { useEffect, useState } from "react";

const INITIAL_FORM = {
  title: "",
  description: "",
  assigneeId: "",
  dueDate: "",
  priority: "P2",
  estimatedTime: "",
};

function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function minutesToSeconds(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 0) return 0;
  return Math.floor(minutes * 60);
}

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  members = [],
  columnName = "",
  submitting = false,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [openedAt, setOpenedAt] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM);
    setOpenedAt(new Date().toISOString());
  }, [open, columnName]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !submitting) onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, submitting]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={() => (submitting ? null : onClose())}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        aria-label="Close create task modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4 dark:border-white/10 dark:bg-slate-800/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Board Task
              </p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Create Task
              </h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
              {columnName || "Unknown Column"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Updated: {formatDateTime(openedAt)}
          </p>
        </div>

        <form
          className="space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (!form.title.trim() || submitting) return;
            onSubmit({
              title: form.title.trim(),
              description: form.description.trim(),
              assigneeId: form.assigneeId,
              dueDate: form.dueDate,
              priority: form.priority,
              estimatedTime: minutesToSeconds(form.estimatedTime),
            });
          }}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="create-task-title"
              className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
            >
              Task Title
            </label>
            <input
              id="create-task-title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Enter a clear task title"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="create-task-description"
              className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="create-task-description"
              rows={4}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Describe the task context, expected outcome, or notes"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <label
                htmlFor="create-task-assignee"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Assignee
              </label>
              <select
                id="create-task-assignee"
                value={form.assigneeId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, assigneeId: event.target.value }))
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="">Auto assignee</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-task-due-date"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Due Date
              </label>
              <input
                id="create-task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-task-priority"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Priority
              </label>
              <select
                id="create-task-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, priority: event.target.value }))
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="P0">P0 (Critical)</option>
                <option value="P1">P1 (High)</option>
                <option value="P2">P2 (Medium)</option>
                <option value="P3">P3 (Low)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="create-task-estimated-time"
                className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                Estimate (mins)
              </label>
              <input
                id="create-task-estimated-time"
                type="number"
                min="0"
                value={form.estimatedTime}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    estimatedTime: event.target.value,
                  }))
                }
                placeholder="0"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || submitting}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
