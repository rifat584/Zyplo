"use client";

import { motion } from "framer-motion";
import WorkspaceCard from "./WorkspaceCard";

/*
  WorkspaceGrid props:
    - filteredWorkspaces
    - activeWorkspaceId
    - activeStatFilter
    - onChangeFilter
    - statChips
*/
export default function WorkspaceGrid({
  filteredWorkspaces,
  activeWorkspaceId,
  activeStatFilter,
  onChangeFilter,
  statChips,
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Choose Workspace</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredWorkspaces.length} workspace{filteredWorkspaces.length === 1 ? "" : "s"} shown
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onChangeFilter(chip.key)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                activeStatFilter === chip.key
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <section id="workspace-grid" className="grid gap-4 scroll-mt-24 lg:grid-cols-2">
        {filteredWorkspaces.map((item, index) => (
          <motion.div key={item.workspace.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <WorkspaceCard
              workspace={item.workspace}
              isActive={item.workspace.id === activeWorkspaceId}
              projectsCount={item.projectsCount}
              openTasksCount={item.openTasksCount}
              inProgressCount={item.inProgressCount}
              membersCount={item.membersCount}
              updatedAt={item.updatedAt}
            />
          </motion.div>
        ))}
      </section>
    </section>
  );
}
