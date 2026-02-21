import { Dot } from "lucide-react";

function PreviewPanel() {
  return (
    <section className="relative row-start-1 flex h-[150px] items-center px-4 py-4 sm:h-[170px] sm:px-6 md:row-auto md:h-auto md:px-10 md:py-10">
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(99,102,241,0.18),transparent_48%),radial-gradient(circle_at_86%_85%,rgba(34,211,238,0.12),transparent_44%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:26px_26px] opacity-20" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_8px)] opacity-20" />

        <div className="absolute left-4 top-4 md:left-6 md:top-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Zyplo</p>
          <p className="mt-1 text-sm text-slate-300">Calm focus for high-output teams</p>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden w-64 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/25 p-3.5 shadow-lg shadow-black/30 backdrop-blur-md sm:block md:w-72 md:animate-in md:fade-in md:slide-in-from-bottom-2 md:duration-500">
          <p className="text-sm font-medium text-white">Focus mode</p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
            <li className="leading-relaxed">Single-task workflow enabled</li>
            <li className="leading-relaxed">Notifications muted for 25 minutes</li>
            <li className="leading-relaxed">Context notes pinned to current task</li>
          </ul>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-200">
            <Dot className="size-4 animate-pulse" />
            Timer running
          </div>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] tracking-[0.14em] text-slate-500 md:bottom-5 md:right-6">
          <span className="inline-flex items-center gap-1 uppercase">
            <span className="size-1 rounded-full bg-indigo-400/70" />
            Sync stable
          </span>
        </div>

        <div className="absolute bottom-3 left-4 sm:left-6 md:bottom-5">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <span className="size-1.5 rounded-full bg-cyan-400/70" />
            Ambient workspace preview
          </span>
        </div>
      </div>
    </section>
  );
}

export default PreviewPanel;
