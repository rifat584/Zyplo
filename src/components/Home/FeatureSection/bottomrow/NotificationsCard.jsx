import { Bell } from "lucide-react";
import CardShell from "../ui/CardShell";

export default function NotificationsCard({ toggles, minimal = false }) {
  const list = minimal ? toggles.slice(0, 3) : toggles;
  return (
    <CardShell className="p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
        <div className="relative"><Bell className="h-4 w-4 text-slate-500" /><span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-semibold text-white">3</span></div>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Notification preferences for delivery-critical updates.</p>
      <div className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
        {list.map((item) => (
          <label key={item.id} className="flex min-h-10 cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30">
            {item.label}
            <span className={`h-3 w-6 rounded-full ${item.enabled ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-600"}`} />
          </label>
        ))}
      </div>
      {!minimal && <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Channels</p><div className="mt-1 flex flex-wrap gap-1.5">{[{ label: "In-app", active: true }, { label: "Email", active: true }, { label: "Slack", active: false }].map((c) => <span key={c.label} className={`rounded-full border px-2 py-0.5 text-[11px] ${c.active ? "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300" : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>{c.label}</span>)}</div></div>}
    </CardShell>
  );
}
