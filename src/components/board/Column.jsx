"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";

function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export default function Column({ column, onCreateTask, disabled = false }) {
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
    <section className="w-[290px] shrink-0 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-slate-900/70">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {column.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {tasks.length} tasks
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCreateTask(column.id)}
          disabled={disabled}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label={`Create task in ${column.name}`}
        >
          <Plus className="size-4" />
        </button>
      </header>

      <div
        ref={setNodeRef}
        className={`max-h-[calc(100vh-16rem)] min-h-20 space-y-2 overflow-y-auto rounded-xl p-1 transition ${
          isOver ? "bg-cyan-50 dark:bg-cyan-500/10" : ""
        }`}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))}
        </SortableContext>

        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-3 text-center text-xs text-slate-500 dark:border-white/15 dark:text-slate-400">
            Drop tasks here
          </div>
        ) : null}
      </div>
    </section>
  );
}
