import KanbanTaskCard from "./KanbanTaskCard";

export default function KanbanColumn({
  column,
  active,
  selectedTaskId,
  reducedMotion,
  onColumnSelect,
  onTaskSelect,
}) {
  const ColumnIcon = column.icon;

  return (
    <div
      className={`rounded-xl border p-2.5 ${
        active ? "border-cyan-400 bg-cyan-50/80 dark:border-cyan-700 dark:bg-cyan-950/35" : "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80"
      }`}
    >
      <button
        type="button"
        onClick={() => onColumnSelect(column.id)}
        className="flex w-full items-center justify-between rounded-md px-1 py-0.5 text-[11px] font-semibold text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400"
      >
        <span className="inline-flex items-center gap-1">
          <ColumnIcon className="h-3.5 w-3.5" />
          {column.name} ({column.tasks.length})
        </span>
        {active && <span className="rounded-full border border-cyan-200 bg-cyan-100 px-1.5 py-0.5 text-[10px] text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">Selected</span>}
      </button>
      <div className="mt-2 space-y-2 border-t border-slate-200/80 pt-2 dark:border-slate-700/80">
        {column.tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            selected={task.id === selectedTaskId}
            reducedMotion={reducedMotion}
            onSelect={() => onTaskSelect(task.id, column.id)}
          />
        ))}
      </div>
    </div>
  );
}
