"use client";

import { useEffect, useState } from "react";
import {
  getSafeTaskStatus,
  TASK_STATUS_OPTIONS,
} from "@/components/dashboard/taskStatus";

const INITIAL_FORM = {
  title: "",
  description: "",
  assigneeId: "",
  dueDate: "",
  priority: "P2",
  status: "todo",
};

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  members = [],
  defaultStatus = "todo",
  submitting = false,
}) {
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    status: getSafeTaskStatus(defaultStatus),
  });

  useEffect(() => {
    if (!open) return;

    const frameId = requestAnimationFrame(() => {
      setForm({
        ...INITIAL_FORM,
        status: getSafeTaskStatus(defaultStatus),
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [defaultStatus, open]);

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
        className="absolute inset-0 bg-background/72"
        aria-label="Close create task modal"
      />

      <div className="absolute left-1/2 top-1/2 w-[96vw] max-w-2xl max-h-[92vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="border-b border-border bg-surface/70 px-4 py-3 sm:px-5 sm:py-4">
          <h2 className="text-lg font-semibold text-foreground">Create Task</h2>
        </div>

        <form
          className="max-h-[calc(92vh-5rem)] space-y-4 overflow-y-auto p-4 sm:p-5"
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
          <div className="space-y-1.5">
            <label
              htmlFor="create-task-title"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
              className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="create-task-description"
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-1.5">
              <label
                htmlFor="create-task-assignee"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Assignee
              </label>
              <select
                id="create-task-assignee"
                value={form.assigneeId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, assigneeId: event.target.value }))
                }
                className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
                className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="create-task-priority"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Priority
              </label>
              <select
                id="create-task-priority"
                value={form.priority}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, priority: event.target.value }))
                }
                className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="P0">P0 (Critical)</option>
                <option value="P1">P1 (High)</option>
                <option value="P2">P2 (Medium)</option>
                <option value="P3">P3 (Low)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="create-task-status"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Status
              </label>
              <select
                id="create-task-status"
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {TASK_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
