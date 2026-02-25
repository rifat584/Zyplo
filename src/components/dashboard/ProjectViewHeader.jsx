"use client";

import Link from "next/link";
import { Activity, Flag, Grid3X3, List, MessageSquare, PlusCircle, Search, Timer, UserRound } from "lucide-react";

export default function ProjectViewHeader({
  workspaceId,
  projectId,
  activeView,
  filters,
  onToggleFilter,
  onClearFilters,
  search,
  onSearchChange,
}) {
  const tabs = [
    { id: "board", label: "Board", href: `/dashboard/w/${workspaceId}/p/${projectId}`, icon: Grid3X3 },
    { id: "list", label: "List", href: `/dashboard/w/${workspaceId}/p/${projectId}/list`, icon: List },
    { id: "activity", label: "Activity", href: `/dashboard/w/${workspaceId}/p/${projectId}/activity`, icon: Activity },
  ];

  const taskChips = [
    { key: "mine", label: "Assigned to me", icon: UserRound },
    { key: "p1", label: "Priority P1", icon: Flag },
    { key: "dueSoon", label: "Due soon", icon: Timer },
    { key: "overdue", label: "Overdue", icon: Timer },
  ];
  const activityChips = [
    { key: "comments", label: "Comments", icon: MessageSquare },
    { key: "statusChanges", label: "Status changes", icon: Activity },
    { key: "created", label: "Created", icon: PlusCircle },
    { key: "byMe", label: "By me", icon: UserRound },
  ];
  const chips = activeView === "activity" ? activityChips : taskChips;
  const hasActiveFilter = chips.some((chip) => Boolean(filters?.[chip.key]));
  const searchPlaceholder = activeView === "activity" ? "Search activity" : "Search tasks";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                activeView === tab.id
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="relative w-full min-w-0 lg:flex-1 lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => onToggleFilter(chip.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filters?.[chip.key]
                ? "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <chip.icon className="mr-1 inline size-3.5" />
            {chip.label}
          </button>
        ))}
        {hasActiveFilter ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
