import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-cyan-400/40 focus-visible:ring-2 focus-visible:ring-cyan-400/30 dark:border-white/10 dark:bg-black/20 dark:text-slate-100 dark:placeholder:text-slate-400",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
