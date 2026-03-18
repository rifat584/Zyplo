"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { dashboardChromeButtonClasses } from "@/components/dashboard/styles";
import { cn } from "@/lib/utils";
import TaskCard from "./TaskCard";

function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export default function Column({
  column,
  onCreateTask,
  onTaskClick,
  disabled = false,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const tasks = useMemo(() => sortTasks(column.tasks || []), [column.tasks]);
  const itemIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <section className="w-[290px] shrink-0 rounded-2xl border border-border bg-surface/85 p-3">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {column.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {tasks.length} tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCreateTask(column.id)}
          disabled={disabled}
          className={cn(
            dashboardChromeButtonClasses,
            "inline-flex size-8 items-center justify-center rounded-lg disabled:opacity-50",
          )}
          aria-label={`Create task in ${column.name}`}
        >
          <Plus className="size-4" />
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={`max-h-[calc(100vh-16rem)] min-h-20 space-y-2 overflow-y-auto rounded-xl p-1 transition ${
          isOver ? "bg-primary/8" : ""
        }`}
      >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                onClick={() => onTaskClick?.(task)}
              />
            ))}
          </SortableContext>

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
            Drop tasks here
          </div>
        ) : null}
      </div>
    </section>
  );
}
