import { BookText, CalendarDays, CircleDot } from "lucide-react";

function Avatar({ initials }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {initials}
    </span>
  );
}

export default function SelectedTaskPanel({ task, compact = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected task</p>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{task.comments} comments</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
      {!compact && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{task.description}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{task.priority}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"><CalendarDays className="h-3 w-3" />{task.due}</span>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">{task.status}</span>
      </div>
      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Assignees</p>
        <div className="mt-1 flex items-center gap-1.5">
          {task.assignees.map((initials) => <Avatar key={initials} initials={initials} />)}
        </div>
      </div>
      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><BookText className="h-3 w-3" />Docs: API pagination notes</span>
      </div>
      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Activity History</p>
        <ul className="mt-1 space-y-1 text-xs text-slate-600 dark:text-slate-300">
          {task.activity.slice(0, 3).map((item) => (
            <li key={item} className="flex items-start gap-1"><CircleDot className="mt-0.5 h-3 w-3 text-cyan-600 dark:text-cyan-400" />{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
