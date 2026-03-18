"use client";

import { cn } from "@/lib/utils";

export function Avatar({ name, className, src = "" }) {
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
        "flex size-8 items-center justify-center overflow-hidden rounded-full border border-border bg-gradient-to-br from-primary to-secondary text-xs font-semibold text-primary-foreground",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name || "User avatar"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        letters || "U"
      )}
    </div>
  );
}
