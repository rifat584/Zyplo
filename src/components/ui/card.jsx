import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return <div className={cn("rounded-2xl border", className)} {...props} />;
}

function CardHeader({ className, ...props }) {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-xl font-semibold text-slate-900 dark:text-white", className)} {...props} />;
}

function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-600 dark:text-slate-300", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
