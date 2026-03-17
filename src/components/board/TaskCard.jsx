"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paperclip } from "lucide-react"; 

const PRIORITY_STYLES = {
  P0: "bg-destructive/10 text-destructive dark:bg-destructive/100/20 dark:text-destructive",
  P1: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  P2: "bg-cyan-100 text-secondary dark:bg-cyan-500/20 dark:text-secondary",
  P3: "bg-muted text-foreground dark:bg-slate-700 dark:text-muted-foreground",
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
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium text-foreground">{task.title}</p>
          {task?.taskRef ? (
            <p className="mt-1">
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:bg-white/10 dark:text-muted-foreground">
                {task.taskRef}
              </span>
            </p>
          ) : null}
        </div>
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
            PRIORITY_STYLES[priority] || PRIORITY_STYLES.P2
          }`}
        >
          {priority}
        </span>
      </div>

      {task.description ? (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground dark:text-muted-foreground">{task.description}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">{task.assigneeName || "Unassigned"}</span>
        
        <div className="flex items-center gap-2">
          {/* Show paperclip if attachments exist */}
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-1 font-medium">
              <Paperclip size={12} /> {task.attachments.length}
            </span>
          )}
          <span className="whitespace-nowrap">{formatDueDate(task.dueDate)}</span>
        </div>
      </div>
    </>
  );
}

function SortableTaskCard({ task, columnId, onClick }) {
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
      onClick={() => {
        if (!isDragging && onClick) onClick();
      }}
      className={`touch-none rounded-xl border border-border bg-white p-3 shadow-sm dark:border-white/10 dark:bg-card ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <CardBody task={task} />
    </article>
  );
}

export default function TaskCard({
  task,
  columnId,
  isDragOverlay = false,
  onClick,
}) {
  if (isDragOverlay) {
    return (
      <article className="rounded-xl border border-border bg-white p-3 shadow-lg dark:border-white/10 dark:bg-card">
        <CardBody task={task} />
      </article>
    );
  }

  return <SortableTaskCard task={task} columnId={columnId} onClick={onClick} />;
}
