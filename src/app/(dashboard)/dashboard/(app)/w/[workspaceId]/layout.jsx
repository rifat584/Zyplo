"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { loadDashboard, useMockStore } from "@/components/dashboard/mockStore";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", href: (id) => `/dashboard/w/${id}` },
  { id: "timeline", label: "Timeline", href: (id) => `/dashboard/w/${id}/timeline` },
  { id: "board", label: "Board", href: (id) => `/dashboard/w/${id}/board` },
  { id: "members", label: "Invite Users", href: (id) => `/dashboard/w/${id}/members` },
];

export default function WorkspaceLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );

  useEffect(() => {
    loadDashboard({ force: true }).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {workspace?.name || "Loading workspace..."}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-1 dark:border-white/10">
          {NAV_ITEMS.map((item) => {
            const href = item.href(workspaceId);
            const active = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </section>

      {children}
    </div>
  );
}
