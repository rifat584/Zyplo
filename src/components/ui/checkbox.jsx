import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "size-4 rounded border border-slate-300 bg-white text-cyan-500 accent-cyan-500 outline-none transition-colors focus:ring-2 focus:ring-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-black/20 dark:text-cyan-400 dark:accent-cyan-400",
        className
      )}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
