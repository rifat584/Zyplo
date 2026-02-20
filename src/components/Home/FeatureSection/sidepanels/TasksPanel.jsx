import { CalendarDays } from "lucide-react";
import CardShell from "../ui/CardShell";

export default function TasksPanel({ tasks, selectedTaskId, onSelectTask }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tasks</h3>
        <CalendarDays className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Keep work crisp. No orphan to-dos.</p>
      <div className="mt-3 space-y-1.5">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelectTask(task.id, task.columnId)}
            className={`min-h-10 w-full rounded-lg border px-2 py-1.5 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              task.id === selectedTaskId
                ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
                : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            <span className="block truncate">{task.title}</span>
          </button>
        ))}
      </div>
    </CardShell>
  );
}
