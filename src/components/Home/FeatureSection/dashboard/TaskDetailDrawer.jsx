import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "../data";

export default function TaskDetailDrawer({
  open,
  reducedMotion,
  task,
  onClose,
  mobile = false,
}) {
  if (!mobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8, x: 24 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, x: 18 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: EASE }}
            className="absolute bottom-4 right-4 w-[330px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
              <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Close selected task drawer"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{task.description}</p>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-3 sm:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={reducedMotion ? { y: 0 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reducedMotion ? { y: 0, opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: EASE }}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
              <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-300" aria-label="Close selected task details"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">{task.description}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
