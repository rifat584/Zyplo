import { User } from "lucide-react";

export default function RolesTable({ roles }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200/80 dark:border-slate-700/80">
      <div className="grid grid-cols-[1.1fr_0.8fr_0.6fr] bg-slate-200/80 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <span>Role</span>
        <span>Boards</span>
        <span>Admin</span>
      </div>
      {roles.map((row) => (
        <div
          key={row.role}
          className="grid grid-cols-[1.1fr_0.8fr_0.6fr] items-center bg-white px-2.5 py-1.5 text-[11px] text-slate-700 transition hover:bg-cyan-50/70 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-cyan-950/30"
        >
          <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{row.role}</span>
          <span>{row.boards}</span>
          <span className={row.admin === "Yes" ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>{row.admin}</span>
        </div>
      ))}
    </div>
  );
}
