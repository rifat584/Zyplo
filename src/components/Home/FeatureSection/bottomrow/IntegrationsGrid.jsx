import { Puzzle } from "lucide-react";

export default function IntegrationsGrid({ integrations }) {
  return (
    <div className="mt-3 border-t border-slate-200 pt-2.5 dark:border-slate-700">
      <div className="mb-2.5">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Integrations</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">6 connected · 2 pending</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {integrations.map((name) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-[11px] font-semibold text-slate-500 opacity-75 grayscale transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:shadow-[0_8px_20px_rgba(34,211,238,0.16)]"
          >
            {name === "+12" ? <span className="text-[11px] font-semibold">+12</span> : <Puzzle className="h-4 w-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
