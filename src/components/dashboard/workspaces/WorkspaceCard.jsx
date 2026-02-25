"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FolderKanban } from "lucide-react";
import { Avatar } from "@/components/dashboard/ui";
import { fromNow } from "@/app/(dashboard)/dashboard/_lib/format";

/*
  WorkspaceCard props:
    - workspace
    - isActive
    - projectsCount
    - openTasksCount
    - inProgressCount
    - membersCount
    - updatedAt
*/
export default function WorkspaceCard({
  workspace,
  isActive = false,
  projectsCount,
  openTasksCount,
  inProgressCount,
  membersCount = 0,
  updatedAt,
}) {
  const visibleMembers = workspace.members.slice(0, 3);
  const overflow = Math.max(0, workspace.members.length - visibleMembers.length);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/dashboard/w/${workspace.id}`}
        className={`group relative block rounded-2xl border bg-white p-5 transition duration-200 hover:shadow-md dark:bg-slate-900 ${
          isActive
            ? "border-indigo-200 shadow-sm dark:border-indigo-500/30"
            : "border-slate-200 hover:border-indigo-300 dark:border-white/10 dark:hover:border-indigo-400/40"
        }`}
      >
        {isActive ? <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-indigo-500/90" /> : null}

        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{workspace.name}</h3>
              {isActive ? (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                  Active
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{workspace.slug}</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
            {updatedAt ? `Updated ${fromNow(updatedAt)}` : "No updates"}
          </span>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex -space-x-2">
            {visibleMembers.map((member) => (
              <Avatar key={member.id} name={member.name} className="size-8 border-2 border-white text-[10px]" />
            ))}
            {overflow > 0 ? (
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                +{overflow}
              </span>
            ) : null}
          </div>
          <p className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FolderKanban className="size-3.5" />
            {projectsCount} projects
          </p>
        </div>

        <div className="mb-4 border-t border-slate-200 pt-3 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
          {membersCount} members • {openTasksCount} open • {inProgressCount} in progress
        </div>

        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition group-hover:border-indigo-300 group-hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:group-hover:border-indigo-400/40 dark:group-hover:text-indigo-200">
          Open Workspace
          <ArrowRight className="size-4" />
        </span>
      </Link>
    </motion.div>
  );
}
