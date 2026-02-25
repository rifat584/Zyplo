"use client";

import Link from "next/link";
import { Building2, FolderKanban, ArrowRight } from "lucide-react";

const TOOLTIP_CLASS =
  "pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-[120] hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-lg group-hover:block dark:border-white/10 dark:bg-slate-900 dark:text-slate-200";

function initialFromName(name) {
  return (name || "W")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}

export default function ActiveContextCard({ workspace, project, collapsed = false }) {
  if (!workspace) return null;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Link
          href={`/dashboard/w/${workspace.id}`}
          title={`Active workspace: ${workspace.name}`}
          className="group relative flex size-10 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-200"
        >
          <Building2 className="size-4" />
          <span className={TOOLTIP_CLASS}>
            {workspace.name}
          </span>
        </Link>

        {project ? (
          <Link
            href={`/dashboard/w/${workspace.id}/p/${project.id}`}
            title={`Active project: ${project.name}`}
            className="group relative flex size-10 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200"
          >
            <FolderKanban className="size-4" />
            <span className={TOOLTIP_CLASS}>
              {project.name}
            </span>
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-500/30 dark:bg-cyan-500/10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          Active Workspace
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-semibold text-white">
            {initialFromName(workspace.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{workspace.name}</p>
            <p className="truncate text-xs text-slate-600 dark:text-slate-400">{workspace.slug}</p>
          </div>
        </div>
      </div>

      {project ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Active Project
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <FolderKanban className="size-3.5 text-indigo-600 dark:text-indigo-300" />
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{project.key}</p>
            </div>
            <Link
              href={`/dashboard/w/${workspace.id}/p/${project.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
            >
              Board
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
