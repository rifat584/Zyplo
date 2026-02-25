"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bell, FolderPlus, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/Context/ThemeContext";
import BreadcrumbNav from "./BreadcrumbNav";
import ContextChips from "./ContextChips";
import AvatarMenu from "./AvatarMenu";
import NotificationsSheet from "./NotificationsSheet";
import CommandPalette from "./CommandPalette";
import CreateWorkspaceDialog from "./dialogs/CreateWorkspaceDialog";
import CreateTaskDialog from "./dialogs/CreateTaskDialog";
import { useMockStore } from "./mockStore";

export default function Topbar({ onOpenSidebar }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { theme, setTheme } = useTheme();

  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const unreadCount = useMockStore((s) => s.notifications.filter((n) => !n.read).length);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isWorkspaceSelector = pathname === "/dashboard/workspaces";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="grid grid-cols-1 items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-7">
          <div className="min-w-0">
            <div className="flex items-start gap-2 md:pl-1">
              <button type="button" onClick={onOpenSidebar} className="mt-0.5 rounded-lg border border-slate-200 p-2 text-slate-600 md:hidden dark:border-white/10 dark:text-slate-300">
                <Menu className="size-4" />
              </button>

              <ContextChips />
            </div>
          </div>

          <div className="hidden items-center justify-center gap-2 md:flex">
            <div className="relative w-[min(52vw,560px)]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-9 pr-16 text-left text-sm text-slate-500 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
              >
                Search tasks, projects, people
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] dark:border-white/10 dark:bg-slate-800">Ctrl+K</span>
              </button>
            </div>
            {isWorkspaceSelector ? (
              <button
                type="button"
                onClick={() => setWorkspaceDialogOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
              >
                <FolderPlus className="size-4" />
                Create workspace
              </button>
            ) : null}
          </div>

          <div className="hidden items-center justify-end gap-2 md:flex">
            {mounted ? (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                {theme === "dark" ? <Sun className="size-4 text-cyan-400" /> : <Moon className="size-4" />}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <Bell className="size-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            <AvatarMenu />
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 pb-3 md:hidden">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="relative h-10 flex-1 rounded-xl border border-slate-200 bg-white pl-9 pr-12 text-left text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            Search tasks, projects, people
            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] dark:border-white/10 dark:bg-slate-800">
              K
            </span>
          </button>
          {isWorkspaceSelector ? (
            <button
              type="button"
              onClick={() => setWorkspaceDialogOpen(true)}
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-lg bg-indigo-500 px-3 text-sm font-medium text-white"
            >
              <FolderPlus className="size-4" />
              Create
            </button>
          ) : null}
          {mounted ? (
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-white/10 dark:text-slate-300"
            >
              {theme === "dark" ? <Sun className="size-4 text-cyan-400" /> : <Moon className="size-4" />}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-white/10 dark:text-slate-300"
          >
            <Bell className="size-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>
        </div>

        {pathname !== "/dashboard/workspaces" ? (
          <div className="flex h-14 items-center gap-2 px-4 lg:px-7">
            <div className="min-w-0 flex-1">
              <BreadcrumbNav />
            </div>
          </div>
        ) : null}
      </header>

      <NotificationsSheet open={notificationsOpen} onOpenChange={setNotificationsOpen} />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        workspaceId={workspaceId}
        projectId={projectId}
        onCreateTask={() => setTaskDialogOpen(true)}
      />

      <CreateWorkspaceDialog
        open={workspaceDialogOpen}
        onOpenChange={setWorkspaceDialogOpen}
        onCreated={(workspace) => router.push(`/dashboard/w/${workspace.id}`)}
      />

      <CreateTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </>
  );
}
