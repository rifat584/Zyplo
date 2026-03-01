"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRIORITY_STYLES = {
  P0: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
  P1: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  P2: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
  P3: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

function formatDueDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function CardBody({ task }) {
  const priority = String(task.priority || "P2").toUpperCase();

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            PRIORITY_STYLES[priority] || PRIORITY_STYLES.P2
          }`}
        >
          {priority}
        </span>
      </div>

      {task.description ? (
        <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{task.description}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="truncate">{task.assigneeName || "Unassigned"}</span>
        <span className="whitespace-nowrap">{formatDueDate(task.dueDate)}</span>
      </div>
    </>
  );
}

function SortableTaskCard({ task, columnId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      taskId: task.id,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-900 ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <CardBody task={task} />
    </article>
  );
}

export default function TaskCard({ task, columnId, isDragOverlay = false }) {
  if (isDragOverlay) {
    return (
      <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-slate-900">
        <CardBody task={task} />
      </article>
    );
  }

  return <SortableTaskCard task={task} columnId={columnId} />;
}
