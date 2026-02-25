"use client";

import KanbanColumn from "./KanbanColumn";

/*
  KanbanBoard props:
    - loading
    - columnConfig
    - grouped
    - members
    - moveTask
    - menuOpen
    - setMenuOpen
    - setSelectedTaskId
    - setColumnConfig
*/
export default function KanbanBoard({
  loading,
  columnConfig,
  grouped,
  members,
  moveTask,
  menuOpen,
  setMenuOpen,
  setSelectedTaskId,
  setColumnConfig,
}) {
  if (loading) {
    return (
      <div className="grid gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="animate-pulse rounded-xl border border-slate-200 bg-slate-100/80 p-3 dark:border-white/10 dark:bg-slate-900/40">
            <div className="mb-3 h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {Object.entries(columnConfig).map(([status, config]) => (
        <KanbanColumn
          key={status}
          status={status}
          title={config.title}
          tasks={grouped[status]}
          members={members}
          wip={config.wip}
          onDropTask={(taskId, toStatus) => moveTask(taskId, toStatus)}
          onOpenTask={(taskId) => setSelectedTaskId(taskId)}
          onToggleMenu={() => setMenuOpen((prev) => (prev === status ? "" : status))}
          menuOpen={menuOpen === status}
          onRename={(title) =>
            setColumnConfig((prev) => ({
              ...prev,
              [status]: { ...prev[status], title: title || prev[status].title },
            }))
          }
          onSetWip={(wip) =>
            setColumnConfig((prev) => ({
              ...prev,
              [status]: { ...prev[status], wip },
            }))
          }
        />
      ))}
    </div>
  );
}
