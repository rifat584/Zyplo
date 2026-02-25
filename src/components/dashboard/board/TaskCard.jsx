"use client";

import { AlertTriangle, CalendarDays, CheckSquare, MessageSquareText } from "lucide-react";
import { Avatar } from "../ui";
import { formatDate } from "@/app/(dashboard)/dashboard/_lib/format";

function priorityClass(priority) {
  if (priority === "P1") return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200";
  if (priority === "P2") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300";
}

function dueClass(dueDate) {
  if (!dueDate) return "text-slate-500 dark:text-slate-400";
  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (dueDay < today) return "text-rose-600 dark:text-rose-300";
  const isToday = dueDay.getTime() === today.getTime();
  if (isToday) return "text-amber-600 dark:text-amber-300";
  return "text-slate-500 dark:text-slate-400";
}

/*
  TaskCard props:
    - task
    - assignee
    - onOpen
    - onDragStart
*/
export default function TaskCard({ task, assignee, onOpen, onDragStart }) {
  const dueStyle = dueClass(task.dueDate);
  const visibleTags = task.tags.slice(0, 2);
  const extraTags = Math.max(0, task.tags.length - visibleTags.length);
  const taskKey = `PMTZ-${task.id.replace(/\D+/g, "") || "0"}`;
  const isOverdue = (() => {
    if (!task.dueDate || task.status === "done") return false;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const due = new Date(task.dueDate);
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    return dueDay < today;
  })();

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onOpen}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/40"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="line-clamp-3 text-sm leading-6 font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${priorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.dueDate ? (
        <div className={`mb-2 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${dueStyle} ${isOverdue ? "border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10" : "border-slate-300 bg-white dark:border-white/10 dark:bg-slate-900"}`}>
          {isOverdue ? <AlertTriangle className="size-3.5" /> : <CalendarDays className="size-3.5" />}
          {formatDate(task.dueDate)}
        </div>
      ) : null}

      <div className="mb-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <CheckSquare className="size-3.5 text-indigo-500" />
          {taskKey}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-1">
          {visibleTags.map((tag) => (
            <span key={tag} className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600 dark:border-white/10 dark:text-slate-300">
              {tag}
            </span>
          ))}
          {extraTags > 0 ? (
            <span className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600 dark:border-white/10 dark:text-slate-300">
              +{extraTags}
            </span>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MessageSquareText className="size-3.5" />
            {task.commentsCount}
          </span>
          {assignee ? <Avatar name={assignee.name} className="size-6 text-[10px]" /> : null}
        </span>
      </div>
    </button>
  );
}
