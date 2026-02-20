import { motion } from "framer-motion";
import { GitPullRequest } from "lucide-react";
import CardShell from "../ui/CardShell";
import { EASE } from "../data";

export default function ActivityPanel({ activityItems, reducedMotion }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Activity History</h3>
        <GitPullRequest className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Audit trail without the noise.</p>
      <div className="mt-3 space-y-1.5 text-xs">
        {activityItems.map((item) => (
          <p key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {item}
          </p>
        ))}
        <motion.p
          animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0], y: [-8, 0, 0, -5] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, repeatDelay: 1.2, ease: EASE }}
          className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200"
        >
          New: Rifat linked org roles matrix.
        </motion.p>
      </div>
    </CardShell>
  );
}
