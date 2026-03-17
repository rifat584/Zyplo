"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { loadDashboard, useMockStore, useWorkspaceAccess } from "@/components/dashboard/mockStore";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", href: (id) => `/dashboard/w/${id}` },
  { id: "timeline", label: "Timeline", href: (id) => `/dashboard/w/${id}/timeline` },
  { id: "board", label: "Board", href: (id) => `/dashboard/w/${id}/board` },
  { id: "calender", label: "Calender", href: (id) => `/dashboard/w/${id}/calender` },
  { id: "list", label: "list", href: (id) => `/dashboard/w/${id}/list` },
  { id: "timesheet", label: "Time Sheet", href: (id) => `/dashboard/w/${id}/timesheet` },
  { id: "members", label: "Invite Users", href: (id) => `/dashboard/w/${id}/members` },
];

export default function WorkspaceLayout({ children }) {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const [moreOpen, setMoreOpen] = useState(false);
  const { isAdmin } = useWorkspaceAccess(workspaceId);

  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );
  const visibleNavItems = useMemo(
    () => NAV_ITEMS.filter((item) => (item.id === "members" ? isAdmin : true)),
    [isAdmin],
  );

  useEffect(() => {
    loadDashboard({ force: true }).catch(() => {});
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const primaryItems = visibleNavItems.slice(0, 3);
  const moreItems = visibleNavItems.slice(3);
  const isMoreActive = moreItems.some((item) => pathname === item.href(workspaceId));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-white p-4 dark:border-white/10 dark:bg-card">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          {workspace?.name || "Loading workspace..."}
        </h1>

        <div className="mt-4 hidden flex-wrap items-center gap-2 border-b border-border pb-1 dark:border-white/10 md:flex">
          {visibleNavItems.map((item) => {
            const href = item.href(workspaceId);
            const active = pathname === href;
            return (
              <Link
                key={item.id}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
                    : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 border-b border-border pb-1 dark:border-white/10 md:hidden">
          <div className="relative flex items-center gap-1 overflow-x-auto whitespace-nowrap">
            {primaryItems.map((item) => {
              const href = item.href(workspaceId);
              const active = pathname === href;
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`rounded-lg px-2.5 py-1.5 text-sm transition ${
                    active
                      ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
                      : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {moreItems.length ? (
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm transition ${
                  isMoreActive || moreOpen
                    ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
                    : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
                }`}
              >
                More
                <ChevronDown className={`size-3.5 transition ${moreOpen ? "rotate-180" : ""}`} />
              </button>
            ) : null}
          </div>

          {moreOpen ? (
            <div className="mt-2 w-56 rounded-xl border border-border bg-white p-1 shadow-lg dark:border-white/10 dark:bg-card">
              {moreItems.map((item) => {
                const href = item.href(workspaceId);
                const active = pathname === href;
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
                        : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {children}
    </div>
  );
}
