"use client";

const CHIP_META = [
  { key: "overdue", label: "Overdue", tone: "rose" },
  { key: "dueToday", label: "Due today", tone: "amber" },
  { key: "blocked", label: "Blocked", tone: "rose" },
  { key: "mine", label: "Assigned to me", tone: "cyan" },
];

function toneClass(tone, active) {
  if (!active) {
    return "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800";
  }
  if (tone === "rose") return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200";
  if (tone === "amber") return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200";
  return "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-200";
}

/*
  AttentionBar props:
    - counts
    - filters
    - onToggle
    - onClear
*/
export default function AttentionBar({ counts, filters, onToggle, onClear }) {
  const hasActive = filters.overdue || filters.dueToday || filters.blocked || filters.mine || filters.dueSoon || filters.p1;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
      {CHIP_META.map((chip) => {
        const count = chip.key === "mine" ? counts.assignedToMe : counts[chip.key] || 0;
        const active = filters[chip.key];
        return (
          <button
            key={chip.key}
            type="button"
            onClick={() => onToggle(chip.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 ${toneClass(chip.tone, active)}`}
          >
            {chip.label} ({count})
          </button>
        );
      })}

      {hasActive ? (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
