export default function DashBoardTestAuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-white/10 dark:bg-slate-900/90 md:p-8">{children}</div>
    </div>
  );
}
