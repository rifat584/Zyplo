"use client";

import { MoreHorizontal } from "lucide-react";
import TaskCard from "./TaskCard";

/*
  KanbanColumn props:
    - status
    - title
    - tasks
    - members
    - wip
    - onDropTask
    - onOpenTask
    - onToggleMenu
    - menuOpen
    - onRename
    - onSetWip
*/
export default function KanbanColumn({
  status,
  title,
  tasks,
  members,
  wip = 0,
  onDropTask,
  onOpenTask,
  onToggleMenu,
  menuOpen,
  onRename,
  onSetWip,
}) {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 dark:border-white/10 dark:bg-slate-900/40"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const taskId = event.dataTransfer.getData("text/task-id");
        if (taskId) onDropTask(taskId, status);
      }}
    >
      <div className="mb-3 flex items-start justify-between border-b border-slate-200 pb-2 dark:border-white/10">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">{title}</p>
          <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {tasks.length}
          </span>
          {wip ? (
            <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
              WIP {tasks.length}/{wip}
            </span>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleMenu}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <MoreHorizontal className="size-4" />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-8 z-20 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">Rename</label>
              <input
                value={title}
                onChange={(event) => onRename(event.target.value)}
                className="mb-2 h-8 w-full rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
              <label className="mb-1 block text-xs text-slate-600 dark:text-slate-300">WIP</label>
              <input
                type="number"
                min={0}
                value={wip}
                onChange={(event) => onSetWip(Number(event.target.value || 0))}
                className="h-8 w-full rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={members.find((member) => member.id === task.assignee)}
            onOpen={() => onOpenTask(task.id)}
            onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)}
          />
        ))}
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No tasks in this column
          </div>
        ) : null}
      </div>
    </div>
  );
}
