"use client";

/*
  BoardHeader props:
    - project
*/
export default function BoardHeader({ project }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{project.name}</h1>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            {project.key}
          </span>
        </div>
      </div>
    </div>
  );
}
