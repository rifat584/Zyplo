"use client";

import Link from "next/link";

/*
  MyWorkWidget props:
    - myWorkPreview
*/
export default function MyWorkWidget({ myWorkPreview }) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/70">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">My Work</p>
        <Link href="/dashboard/my-work" className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          Open
        </Link>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">Assigned</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{myWorkPreview.assigned}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">Due soon</p>
          <p className="mt-1 font-semibold text-amber-600 dark:text-amber-300">{myWorkPreview.dueSoon}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">Overdue</p>
          <p className="mt-1 font-semibold text-rose-600 dark:text-rose-300">{myWorkPreview.overdue}</p>
        </div>
      </div>

      <div className="space-y-2">
        {myWorkPreview.items.length ? (
          myWorkPreview.items.map((task) => (
            <Link
              key={task.id}
              href={`/dashboard/w/${task.project?.workspaceId}/p/${task.projectId}/list`}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2 text-xs transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
            >
              <span className="truncate text-slate-700 dark:text-slate-200">{task.title}</span>
              <span className="ml-2 shrink-0 text-slate-500 dark:text-slate-400">{task.project?.key}</span>
            </Link>
          ))
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">No assigned items right now.</p>
        )}
      </div>
    </aside>
  );
}
