"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fromNow } from "@/app/dashBoardTest/_lib/format";
import { getProjectStatusMeta } from "@/components/dashBoardTest/mockStore";

function Dot({ health }) {
  const className =
    health === "red"
      ? "bg-rose-500"
      : health === "yellow"
        ? "bg-amber-500"
        : "bg-emerald-500";
  return <span className={`inline-block size-2 rounded-full ${className}`} />;
}

/*
  RecentProjects props:
    - projects
    - title
*/
export default function RecentProjects({ projects = [], title = "Recent Projects" }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">Recently updated</span>
      </div>

      <div className="space-y-2">
        {projects.map((project) => {
          const meta = getProjectStatusMeta(project.id);
          const badgeText =
            meta?.overdueCount > 0
              ? `${meta.overdueCount} overdue`
              : meta?.dueSoonCount > 0
                ? `${meta.dueSoonCount} due soon`
                : "On track";

          return (
            <Link
              key={project.id}
              href={`/dashBoardTest/w/${project.workspaceId}/p/${project.id}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200 p-3 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  <Dot health={meta?.health || "green"} />
                  {project.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 dark:border-white/10 dark:bg-slate-800">
                    {project.key}
                  </span>
                  <span>{project.workspace?.name || "Workspace"}</span>
                </div>
              </div>
              <div className="ml-3 flex items-center gap-3 text-right">
                <div>
                  <p className="text-xs text-slate-600 group-hover:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-200">{badgeText}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {meta?.lastUpdatedBy || "Rifat"} • {fromNow(project.updatedAt)}
                  </p>
                </div>
                <span className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition group-hover:border-indigo-300 group-hover:text-indigo-700 dark:border-white/10 dark:text-slate-400 dark:group-hover:border-indigo-400/40 dark:group-hover:text-indigo-200">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          );
        })}

        {projects.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No recent projects yet.</p>
        ) : null}
      </div>
    </section>
  );
}
