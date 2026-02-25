"use client";

import Link from "next/link";
import { Activity, Flag, Grid3X3, List, Plus, Search, Timer } from "lucide-react";

/*
  FilterChips props:
    - workspaceId
    - projectId
    - activeView
    - filters
    - counts
    - onToggle
    - searchQuery
    - onSearchQueryChange
    - onCreateTask
*/
export default function FilterChips({
  workspaceId,
  projectId,
  activeView,
  filters,
  counts,
  onToggle,
  searchQuery,
  onSearchQueryChange,
  onCreateTask,
}) {
  const tabs = [
    { id: "board", href: `/dashBoardTest/w/${workspaceId}/p/${projectId}`, icon: Grid3X3 },
    { id: "list", href: `/dashBoardTest/w/${workspaceId}/p/${projectId}/list`, icon: List },
    { id: "activity", href: `/dashBoardTest/w/${workspaceId}/p/${projectId}/activity`, icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm capitalize transition duration-200 ${
              activeView === tab.id
                ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <tab.icon className="size-3.5" />
            {tab.id}
          </Link>
        ))}

        <div className="relative w-full min-w-0 sm:flex-1 md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search tasks in board"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-indigo-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-start gap-2 lg:w-auto lg:justify-end">
        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          <Plus className="size-3.5" />
          New Task
        </button>
        <button
          type="button"
          onClick={() => onToggle("dueSoon")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition duration-200 ${
            filters.dueSoon
              ? "border-cyan-300 bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200 dark:ring-cyan-500/30"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Timer className="mr-1 inline size-3.5" />
          Due soon ({counts.dueSoon})
        </button>
        <button
          type="button"
          onClick={() => onToggle("p1")}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition duration-200 ${
            filters.p1
              ? "border-rose-300 bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/30"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Flag className="mr-1 inline size-3.5" />
          Priority P1 ({counts.p1})
        </button>
      </div>
    </div>
  );
}
