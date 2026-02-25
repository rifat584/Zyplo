"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Activity, CalendarClock, CheckSquare, ChevronLeft, Home, PanelLeft, Settings, Users, UserPlus } from "lucide-react";
import useSidebarState from "./useSidebarState";
import InviteDialog from "./dialogs/InviteDialog";
import ActiveContextCard from "./ActiveContextCard";
import { useMockStore } from "./mockStore";

const TOOLTIP_CLASS =
  "pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-[120] hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-lg group-hover:block dark:border-white/10 dark:bg-slate-900 dark:text-slate-200";

function NavItem({ href, label, icon: Icon, active, collapsed, disabled = false, onClick, badge }) {
  const className = disabled
    ? "cursor-not-allowed text-slate-400 opacity-70 dark:text-slate-600"
    : active
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";

  const body = (
    <div
      className={`group relative flex items-center rounded-xl text-sm transition ${className} ${
        collapsed ? "size-10 shrink-0 justify-center px-0 py-0" : "justify-between px-3 py-2"
      }`}
      title={collapsed ? label : undefined}
    >
      <span className={`flex items-center ${collapsed ? "justify-center" : "gap-2"}`}>
        <Icon className="size-4" />
        {!collapsed ? label : null}
      </span>
      {!collapsed && badge ? badge : null}
      {collapsed ? (
        <span className={TOOLTIP_CLASS}>
          {label}
        </span>
      ) : null}
    </div>
  );

  if (disabled) {
    return <div className={collapsed ? "w-10" : ""}>{body}</div>;
  }

  return (
    <Link href={href} onClick={onClick} className={collapsed ? "block w-10" : "block"}>
      {body}
    </Link>
  );
}

export default function AppSidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const params = useParams();
  const { collapsed, toggleCollapsed } = useSidebarState();
  const [inviteOpen, setInviteOpen] = useState(false);

  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const isGlobalPage = pathname === "/dashboard/my-work" || pathname === "/dashboard/activity";

  const { workspaces, projects, lastVisited } = useMockStore((state) => ({
    workspaces: state.workspaces,
    projects: state.projects,
    lastVisited: state.lastVisited,
  }));

  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === workspaceId) ||
    workspaces.find((workspace) => workspace.id === lastVisited?.workspaceId) ||
    workspaces[0] ||
    null;

  const activeProject =
    projects.find((project) => project.id === projectId) ||
    (pathname.includes("/p/")
      ? projects.find((project) => project.id === lastVisited?.projectId && project.workspaceId === activeWorkspace?.id) || null
      : null);
  const activeWorkspaceId = activeWorkspace?.id || "";
  const settingsHref = activeWorkspaceId
    ? projectId
      ? `/dashboard/w/${activeWorkspaceId}/p/${projectId}/settings`
      : `/dashboard/w/${activeWorkspaceId}/settings`
    : "/dashboard/workspaces";
  const membersHref = activeWorkspaceId ? `/dashboard/w/${activeWorkspaceId}/members` : "/dashboard/workspaces";

  const quickLinks = useMemo(() => {
    const activityHref = workspaceId ? `/dashboard/w/${workspaceId}/activity` : "/dashboard/activity";
    return [
      { href: "/dashboard/my-work", label: "My Work", icon: CheckSquare },
      { href: activityHref, label: "Recent Activity", icon: Activity },
      { href: "#", label: "Calendar", icon: CalendarClock, disabled: true, badge: <span className="text-[10px]">Soon</span> },
    ];
  }, [workspaceId]);

  const effectiveCollapsed = mobileOpen ? true : collapsed;

  const content = (
    <>
      <div className={`mb-3 flex items-center ${effectiveCollapsed ? "justify-center" : "justify-between"}`}>
        {!effectiveCollapsed ? <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Navigation</p> : null}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={` border group relative hidden border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800 md:block ${
            effectiveCollapsed
              ? "flex items-center justify-center rounded-xl p-2"
              : "rounded-lg p-1.5"
          }`}
        >
          {effectiveCollapsed ? <PanelLeft className="size-4" /> : <ChevronLeft className="size-4" />}
          {effectiveCollapsed ? <span className={TOOLTIP_CLASS}>Expand sidebar</span> : null}
        </button>
      </div>

      {!isGlobalPage && pathname !== "/dashboard/workspaces" ? (
        <div className="space-y-2 border-b border-slate-200 pb-4 dark:border-white/10">
          <ActiveContextCard workspace={activeWorkspace} project={activeProject} collapsed={effectiveCollapsed} />
        </div>
      ) : null}

      <div className={`space-y-1 py-4 ${effectiveCollapsed ? "flex flex-col items-center" : ""}`}>
        <NavItem href="/dashboard/workspaces" label="All Workspaces" icon={Home} active={pathname === "/dashboard/workspaces"} collapsed={effectiveCollapsed} onClick={onCloseMobile} />
      </div>

      <div className={`space-y-1 ${effectiveCollapsed ? "flex flex-col items-center" : ""}`}>
        {!effectiveCollapsed ? <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick Links</p> : null}
        {quickLinks.map((item) => (
          <NavItem key={item.label} href={item.href} label={item.label} icon={item.icon} active={!item.disabled && pathname === item.href} collapsed={effectiveCollapsed} disabled={item.disabled} badge={item.badge} onClick={onCloseMobile} />
        ))}
      </div>

      <div className={`mt-auto space-y-1 border-t border-slate-200 pt-4 dark:border-white/10 ${effectiveCollapsed ? "flex flex-col items-center" : ""}`}>
        {activeWorkspace ? (
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className={`group relative rounded-xl border border-slate-200 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800 ${
              effectiveCollapsed
                ? "flex size-10 items-center justify-center px-0 py-0"
                : "flex w-full items-center gap-2 px-3 py-2"
            }`}
          >
            <UserPlus className="size-4" />
            {!effectiveCollapsed ? "Invite" : null}
            {effectiveCollapsed ? <span className={TOOLTIP_CLASS}>Invite</span> : null}
          </button>
        ) : null}
        <NavItem href={membersHref} label="Members" icon={Users} active={pathname.endsWith("/members")} collapsed={effectiveCollapsed} onClick={onCloseMobile} />
        <NavItem href={settingsHref} label="Settings" icon={Settings} active={pathname.endsWith("/settings")} collapsed={effectiveCollapsed} onClick={onCloseMobile} />
      </div>
    </>
  );

  return (
    <>
      <aside className={`relative z-40 hidden h-screen shrink-0 border-r border-slate-200 bg-white/90 p-3 dark:border-white/10 dark:bg-slate-950/80 md:sticky md:top-0 md:flex md:flex-col md:overflow-visible ${effectiveCollapsed ? "md:w-20" : "md:w-72"}`}>
        <div className="flex h-full flex-col overflow-visible">
          {content}
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/35" onClick={onCloseMobile} />
          <div className="absolute left-0 top-0 h-full w-20 border-r border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-950">
            {content}
          </div>
        </div>
      ) : null}

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} workspaceId={activeWorkspaceId} />
    </>
  );
}
