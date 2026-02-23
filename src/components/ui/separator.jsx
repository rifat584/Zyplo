import { cn } from "@/lib/utils";

function Separator({ className, orientation = "horizontal" }) {
  return (
    <div
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-white/10",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}

export { Separator };
