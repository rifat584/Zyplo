"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Paperclip, UserRound } from "lucide-react";
import { dashboardTaskCardClasses } from "@/components/dashboard/styles";

const PRIORITY_STYLES = {
  P0: "border-destructive/15 bg-destructive/10 text-destructive",
  P1: "border-warning/20 bg-warning/15 text-warning",
  P2: "border-info/15 bg-info/12 text-info",
  P3: "border-border bg-muted/70 text-muted-foreground",
};

const PRIORITY_LABELS = {
  P0: "P0",
  P1: "P1",
  P2: "P2",
  P3: "P3",
};

function formatDueDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function MetaItem({ icon: Icon, value, className = "" }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-1.5 text-[11px] ${className}`}>
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate font-medium text-foreground">{value}</span>
    </span>
  );
}

function CardBody({ task }) {
  const priority = String(task.priority || "P2").toUpperCase();
  const priorityLabel = PRIORITY_LABELS[priority] || "P2";
  const assigneeName = task.assigneeName || "Unassigned";
  const dueDateLabel = formatDueDate(task.dueDate);
  const attachmentCount = Number(task.attachments?.length || 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
            {task.title}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase ${
            PRIORITY_STYLES[priority] || PRIORITY_STYLES.P2
          }`}
        >
          {priorityLabel}
        </span>
      </div>

      {task.description ? (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {task.description}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-muted-foreground">
        <MetaItem
          icon={UserRound}
          value={assigneeName}
          className="max-w-[52%]"
        />

        <div className="flex shrink-0 items-center gap-2.5">
          {attachmentCount > 0 ? (
            <MetaItem
              icon={Paperclip}
              value={String(attachmentCount)}
            />
          ) : null}
          <MetaItem icon={CalendarDays} value={dueDateLabel} />
        </div>
      </div>
    </div>
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
      className={`${dashboardTaskCardClasses} h-[146px] touch-none cursor-pointer rounded-xl border p-3 ${
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
      <article className={`${dashboardTaskCardClasses} h-[146px] rounded-xl border p-3 shadow-sm`}>
        <CardBody task={task} />
      </article>
    );
  }

  return <SortableTaskCard task={task} columnId={columnId} onClick={onClick} />;
}
