"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Building2, ChevronLeft, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/Context/ThemeContext";
import { Avatar } from "./ui";

const SIDEBAR_KEY = "dashboard.sidebarCollapsed";

function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      // no-op
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {
      // no-op
    }
  }, [collapsed, ready]);

  return { collapsed, toggle: () => setCollapsed((v) => !v) };
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-cyan-200 dark:hover:ring-cyan-500/40"
      >
        <Avatar name={session?.user?.name || "User"} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-900">
          <div className="mb-2 border-b border-slate-200 pb-2 dark:border-white/10">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session?.user?.name || "User"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email || ""}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full rounded-lg px-2 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AppSidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarState();
  const effectiveCollapsed = mobileOpen ? true : collapsed;

  const item = (
    <Link
      href="/dashboard/workspaces"
      onClick={onCloseMobile}
      className={`group flex items-center rounded-xl transition ${
        pathname === "/dashboard/workspaces"
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      } ${effectiveCollapsed ? "size-10 justify-center" : "gap-2 px-3 py-2"}`}
      title={effectiveCollapsed ? "Workspaces" : undefined}
    >
      <Building2 className="size-4 shrink-0" />
      {!effectiveCollapsed ? <span className="text-sm">Workspaces</span> : null}
    </Link>
  );

  const content = (
    <div className="flex h-full flex-col overflow-visible p-3">
      <div className={`mb-3 flex items-center ${effectiveCollapsed ? "justify-center" : "justify-between"}`}>
        {!effectiveCollapsed ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Navigation</p>
        ) : null}
        <button
          type="button"
          onClick={toggle}
          className="hidden rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800 md:block"
        >
          <ChevronLeft className={`size-4 transition ${effectiveCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div className={effectiveCollapsed ? "flex justify-center" : ""}>{item}</div>
    </div>
  );

  return (
    <>
      <aside
        className={`relative z-40 hidden h-screen shrink-0 border-r border-slate-200 bg-white/90 dark:border-white/10 dark:bg-slate-950/80 md:sticky md:top-0 md:flex md:flex-col ${
          effectiveCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {content}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-slate-900/35" onClick={onCloseMobile} />
          <div className="absolute left-0 top-0 h-full w-20 border-r border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-950">
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Topbar({ onOpenSidebar }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 lg:px-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden dark:border-white/10 dark:text-slate-300"
          >
            <Menu className="size-4" />
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workspace</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create workspace, invite members, assign tasks.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mounted ? (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              {theme === "dark" ? <Sun className="size-4 text-cyan-400" /> : <Moon className="size-4" />}
            </button>
          ) : null}
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AppSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:px-7 dark:bg-slate-950/30">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
