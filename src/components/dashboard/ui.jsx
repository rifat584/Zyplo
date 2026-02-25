"use client";

import { cn } from "@/lib/utils";

export function Avatar({ name, className }) {
  const letters = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-white bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-semibold text-white",
        className
      )}
    >
      {letters || "U"}
    </div>
  );
}

export function PriorityPill({ priority }) {
  const map = {
    P1: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
    P2: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    P3: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  };

  return <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", map[priority] || map.P2)}>{priority}</span>;
}

export function StatusDot({ status }) {
  const map = {
    todo: "bg-slate-400",
    inprogress: "bg-cyan-500",
    inreview: "bg-violet-500",
    done: "bg-emerald-500",
  };
  return <span className={cn("inline-block size-2 rounded-full", map[status] || map.todo)} />;
}
