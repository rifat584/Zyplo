"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TaskDeleteDialog({
  open,
  taskTitle,
  count = 1,
  busy = false,
  onClose,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);
  const singleTask = Number(count) <= 1;
  const safeCount = Math.max(1, Number(count) || 1);
  const title = singleTask
    ? `Delete "${taskTitle || "Untitled task"}"?`
    : `Delete ${safeCount} tasks?`;
  const description = singleTask
    ? "This task will be permanently removed from the project. This action cannot be undone."
    : `${safeCount} tasks will be permanently removed from the project. This action cannot be undone.`;
  const confirmLabel = singleTask ? "Delete task" : "Delete tasks";

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background/72">
      <button
        type="button"
        aria-label="Close task delete dialog"
        onClick={() => {
          if (busy) return;
          onClose();
        }}
        className="absolute inset-0"
      />

      <div className="flex min-h-full items-center justify-center px-4 py-6 sm:py-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-delete-confirm-title"
          className="relative w-full max-w-lg max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-border/70 bg-card p-6 text-card-foreground"
        >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              <h2
                id="task-delete-confirm-title"
                className="font-heading text-lg font-semibold tracking-tight text-foreground"
              >
                {title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                disabled={busy}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-destructive text-destructive-foreground shadow-none hover:scale-100 hover:bg-destructive/90 hover:shadow-none",
                )}
              >
                {busy ? "Working..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
