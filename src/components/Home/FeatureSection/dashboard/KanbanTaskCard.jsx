import { motion } from "framer-motion";
import { CalendarDays, MessageSquare } from "lucide-react";
import { EASE } from "../data";

export default function KanbanTaskCard({ task, selected, reducedMotion, onSelect }) {
  const priorityClass =
    task.priority === "High"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
      : task.priority === "Med"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={reducedMotion ? {} : { y: -2, boxShadow: "0 8px 20px rgba(15,23,42,0.08)" }}
      transition={{ duration: reducedMotion ? 0 : 0.2, ease: EASE }}
      className={`w-full rounded-xl border p-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
        selected ? "border-cyan-400 bg-cyan-50/90 dark:border-cyan-700 dark:bg-cyan-950/35" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className={`rounded-full border px-1.5 py-0.5 ${priorityClass}`}>{task.priority}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><CalendarDays className="h-3 w-3" />{task.due}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><MessageSquare className="h-3 w-3" />{task.comments}</span>
      </div>
    </motion.button>
  );
}
