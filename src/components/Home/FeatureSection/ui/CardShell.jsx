export default function CardShell({ children, className = "" }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 ${className}`}
    >
      {children}
    </article>
  );
}
