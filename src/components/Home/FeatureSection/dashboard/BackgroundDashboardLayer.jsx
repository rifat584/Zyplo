import { motion } from "framer-motion";

export default function BackgroundDashboardLayer({ bgY }) {
  return (
    <motion.div
      style={{ y: bgY }}
      className="pointer-events-none absolute -inset-3 -z-10 hidden overflow-hidden rounded-[28px] border border-slate-300/40 bg-slate-100/60 opacity-[0.14] blur-[1.5px] [mask-image:radial-gradient(ellipse_at_center,black_62%,transparent_100%)] dark:border-slate-700/50 dark:bg-slate-900/60 lg:block"
    >
      <div className="flex h-full">
        <aside className="w-52 border-r border-slate-300/60 p-4 dark:border-slate-700/50">
          <div className="h-7 w-28 rounded-md bg-slate-300/80 dark:bg-slate-700/70" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-24 rounded bg-slate-300/80 dark:bg-slate-700/70" />
            <div className="h-3 w-20 rounded bg-slate-300/80 dark:bg-slate-700/70" />
            <div className="h-3 w-16 rounded bg-slate-300/80 dark:bg-slate-700/70" />
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex h-11 items-center justify-between border-b border-slate-300/60 px-4 dark:border-slate-700/50">
            <div className="text-[10px] text-slate-500 dark:text-slate-300">Zyplo • Web App Core</div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-slate-300/70 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-300">feature/dashboard-redesign</span>
              <span className="rounded-full border border-slate-300/70 px-1.5 py-0.5 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-300">v1.3.2</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
            <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
            <div className="h-44 rounded-xl bg-slate-300/55 dark:bg-slate-700/55" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
