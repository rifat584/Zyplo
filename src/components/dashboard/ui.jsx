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
