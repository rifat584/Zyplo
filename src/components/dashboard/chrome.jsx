"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCheck,
  ChevronLeft,
  Ellipsis,
  Cpu,
  FlaskConical,
  Landmark,
  Megaphone,
  Menu,
  PenTool,
  UserCircle2,
  Rocket,
  Settings,
  Star,
  Timer,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "./ui";
import Logo from "../Shared/Logo/Logo";
import {
  deleteWorkspace,
  loadDashboard,
  markAllNotificationsRead,
  refreshNotifications,
  resolveWorkspaceRole,
  useMockStore,
} from "./mockStore";

const SIDEBAR_KEY = "dashboard.sidebarCollapsed";
const WORKSPACE_ROUTE_LABELS = {
  timeline: "Timeline",
  board: "Board",
  calender: "Calendar",
  list: "List",
  timesheet: "Time Sheet",
  members: "Invite Users",
  settings: "Settings",
};

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
  const currentUser = useMockStore((state) => state.currentUser || null);
  const rootRef = useRef(null);

  useEffect(() => {
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const displayName = currentUser?.name || session?.user?.name || "User";
  const displayEmail = currentUser?.email || session?.user?.email || "";
  const displayAvatarUrl = currentUser?.avatarUrl || session?.user?.image || "";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-primary/20 dark:hover:ring-primary/30"
      >
        <Avatar name={displayName} src={displayAvatarUrl} />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-56 rounded-xl border border-border bg-card p-2">
          <div className="mb-2 border-b border-border pb-2">
            <p className="text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              {displayEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full rounded-lg px-2 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

function formatNotificationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function parseJsonSafe(text, fallback = null) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function formatElapsed(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const PROFILE_COMPLETION_FIELDS = [
  "name",
  "phone",
  "roleTitle",
  "company",
  "location",
  "website",
  "avatarUrl",
  "bio",
];

function computeProfileCompletion(user) {
  if (!user) return 0;
  const completed = PROFILE_COMPLETION_FIELDS.filter((key) =>
    String(user?.[key] || "").trim(),
  ).length;
  return Math.round((completed / PROFILE_COMPLETION_FIELDS.length) * 100);
}

function GlobalTimerControl() {
  const pathname = usePathname();
  const tasks = useMockStore((state) => state.tasks || []);
  const [activeTimer, setActiveTimer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  async function fetchActiveTimer() {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/time/active", {
        method: "GET",
        cache: "no-store",
      });
      const text = await response.text();
      const data = parseJsonSafe(text, null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to fetch active timer");
      }
      setActiveTimer(data?.activeTimer || null);
    } catch {
      setActiveTimer(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActiveTimer().catch(() => {});
  }, [pathname]);

  useEffect(() => {
    function onTimerUpdated() {
      fetchActiveTimer().catch(() => {});
    }
    window.addEventListener("zyplo-timer-updated", onTimerUpdated);
    return () => window.removeEventListener("zyplo-timer-updated", onTimerUpdated);
  }, []);

  useEffect(() => {
    const poll = setInterval(() => {
      fetchActiveTimer().catch(() => {});
    }, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    if (!activeTimer) return;
    const tick = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [activeTimer]);

  const startMs = activeTimer?.startTime ? new Date(activeTimer.startTime).getTime() : null;
  const baseDuration = Number(activeTimer?.duration || 0);
  const liveDuration =
    startMs && Number.isFinite(startMs)
      ? Math.max(baseDuration, baseDuration + Math.floor((nowMs - startMs) / 1000))
      : baseDuration;
  const activeTask =
    tasks.find((task) => String(task.id) === String(activeTimer?.taskId || "")) || null;
  const hasActiveTimer = Boolean(activeTimer?.id);

  const containerClasses = hasActiveTimer 
    ? "border-primary/20 bg-primary/10" 
    : "border-border bg-surface/80";

  const textClasses = hasActiveTimer
    ? "text-primary"
    : "text-muted-foreground";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-1.5 sm:px-2 py-1 sm:py-1.5 ${containerClasses}`}>
      <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold ${textClasses}`}>
        <Timer className="size-3.5 sm:size-4 shrink-0" />
        
        <span className={hasActiveTimer ? "" : "hidden sm:inline"}>
          {loading && !hasActiveTimer ? "..." : hasActiveTimer ? formatElapsed(liveDuration) : "No timer"}
        </span>
      </span>

      {hasActiveTimer && (
        <>
          <span className="hidden max-w-20 truncate text-[11px] text-foreground md:max-w-36 md:inline dark:text-foreground">
            {activeTask?.title || "No task"}
          </span>
          <button
            type="button"
            onClick={async () => {
              if (!hasActiveTimer || stopping) return;
              try {
                setStopping(true);
                const response = await fetch(`/api/dashboard/time/${activeTimer.id}/stop`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({}),
                });
                const text = await response.text();
                const data = parseJsonSafe(text, null);
                if (!response.ok) {
                  throw new Error(data?.error || data?.message || "Failed to stop timer");
                }
                setActiveTimer(null);
                toast.success("Timer stopped");
                loadDashboard({ force: true, silent: true }).catch(() => {});
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("zyplo-timer-updated"));
                }
              } catch (error) {
                toast.error(error?.message || "Failed to stop timer");
              } finally {
                setStopping(false);
              }
            }}
            disabled={stopping || loading}
            className="rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 sm:px-2 sm:py-1 sm:text-[11px]"
          >
            {stopping ? "..." : "Stop"}
          </button>
        </>
      )}
    </div>
  );
}

function NotificationsMenu() {
  const notifications = useMockStore((state) => state.notifications || []);
  const unreadCount = notifications.filter((item) => !item.read).length;
  const [open, setOpen] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-surface sm:p-2"
        aria-label="Open notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-40 w-[92vw] max-w-sm overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-sm font-semibold text-foreground">
              Notifications
            </p>
            <button
              type="button"
              disabled={markingAllRead || unreadCount === 0}
              onClick={async () => {
                try {
                  setMarkingAllRead(true);
                  await markAllNotificationsRead();
                } catch (error) {
                  toast.error(error?.message || "Failed to mark notifications");
                } finally {
                  setMarkingAllRead(false);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {notifications.length ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`mb-1 rounded-lg border px-3 py-2 last:mb-0 ${
                    item.read
                      ? "border-border bg-card"
                      : "border-primary/20 bg-primary/10 dark:border-primary/40 dark:bg-primary/100/10"
                  }`}
                >
                  <p className="text-sm text-foreground">
                    {item.text || "Notification"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatNotificationTime(item.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-2 py-4 text-sm text-muted-foreground">
                No notifications yet.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AppSidebar({ mobileOpen, onCloseMobile }) {
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebarState();
  const effectiveCollapsed = mobileOpen ? true : collapsed;
  const { workspaces, currentUser } = useMockStore((state) => ({
    workspaces: state.workspaces || [],
    currentUser: state.currentUser || null,
  }));
  const [actionsOpenFor, setActionsOpenFor] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const actionsMenuRef = useRef(null);

  const workspaceIcons = [
    { Icon: Rocket, color: "bg-primary/10 text-primary" },
    { Icon: BriefcaseBusiness, color: "bg-success/15 text-success" },
    { Icon: PenTool, color: "bg-warning/15 text-warning" },
    { Icon: Megaphone, color: "bg-destructive/10 text-destructive" },
    { Icon: FlaskConical, color: "bg-info/15 text-info" },
    { Icon: Cpu, color: "bg-secondary/15 text-secondary" },
    { Icon: Landmark, color: "bg-accent text-accent-foreground" },
  ];

  const pickWorkspaceIcon = (workspace) => {
    const key = workspace?.id || workspace?.name || "workspace";
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return workspaceIcons[hash % workspaceIcons.length];
  };

  useEffect(() => {
    function onPointerDown(event) {
      if (!actionsOpenFor) return;
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setActionsOpenFor("");
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [actionsOpenFor]);

  const rootItem = (
    <Link
      href="/dashboard/workspaces"
      onClick={onCloseMobile}
      className={`group flex items-center rounded-xl transition ${pathname === "/dashboard/workspaces"
          ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
          : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
        } ${effectiveCollapsed ? "size-10 justify-center" : "gap-2 px-3 py-2"}`}
      title={effectiveCollapsed ? "Workspaces" : undefined}
    >
      <Building2 className="size-4 shrink-0" />
      {!effectiveCollapsed ? <span className="text-sm">Workspaces</span> : null}
    </Link>
  );

  const profileItem = (
    <Link
      href="/dashboard/profile"
      onClick={onCloseMobile}
      className={`group flex items-center rounded-xl transition ${
        pathname === "/dashboard/profile"
          ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
          : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
      } ${effectiveCollapsed ? "size-10 justify-center" : "gap-2 px-3 py-2"}`}
      title={effectiveCollapsed ? "Profile" : undefined}
    >
      <UserCircle2 className="size-4 shrink-0" />
      {!effectiveCollapsed ? <span className="text-sm">Profile</span> : null}
    </Link>
  );

  const workspaceItems = (
    <div className={`mt-3 space-y-1 ${effectiveCollapsed ? "flex flex-col items-center" : ""}`}>
      {!effectiveCollapsed ? (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Your Workspaces
        </p>
      ) : null}
      {workspaces.map((workspace) => {
        const isAdmin = resolveWorkspaceRole(workspace, currentUser) === "admin";
        const { Icon, color } = pickWorkspaceIcon(workspace);
        const href = `/dashboard/w/${workspace.id}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        const menuOpen = actionsOpenFor === workspace.id;
        return (
          <div key={workspace.id} className="group relative">
            <button
              type="button"
              onClick={() => {
                router.push(href);
                onCloseMobile?.();
              }}
              className={`flex w-full items-center rounded-xl transition cursor-pointer ${
                active
                  ? "bg-primary/10 text-primary dark:bg-primary/100/20 dark:text-primary"
                  : "text-muted-foreground hover:bg-muted dark:text-muted-foreground dark:hover:bg-surface"
              } ${effectiveCollapsed ? "size-10 justify-center" : "gap-2 px-3 py-2 pr-10"}`}
              title={workspace.name}
            >
              <span className={`flex size-5 items-center justify-center rounded-md ${color}`}>
                <Icon className="size-3.5" />
              </span>
              {!effectiveCollapsed ? <span className="truncate text-sm">{workspace.name}</span> : null}
            </button>

            {!effectiveCollapsed ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActionsOpenFor((current) => (current === workspace.id ? "" : workspace.id));
                }}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted/70 group-hover:block"
              >
                <Ellipsis className="size-4" />
              </button>
            ) : null}

            {menuOpen ? (
              <div ref={actionsMenuRef} className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-border bg-card p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setActionsOpenFor("");
                    toast.info(`Added ${workspace.name} to starred`);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-surface"
                >
                  <Star className="size-4" />
                  Add to starred
                </button>
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setActionsOpenFor("");
                        router.push(`/dashboard/w/${workspace.id}/members`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-surface"
                    >
                      <UserPlus className="size-4" />
                      Add people
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActionsOpenFor("");
                        router.push(`/dashboard/w/${workspace.id}/settings`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-surface"
                    >
                      <Settings className="size-4" />
                      Workspace settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActionsOpenFor("");
                        setConfirmDeleteId(workspace.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                      Delete workspace
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  const content = (
    <div className="flex h-full flex-col overflow-visible p-3">
      <div
        className={`mb-3 flex items-center ${effectiveCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!effectiveCollapsed ? (
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">
            <Link href={"/"}>
              <Logo size={45} className="ml-0.5" />
            </Link>
          </div>
        ) : null}
        <button
          type="button"
          onClick={toggle}
          className="hidden rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted md:block"
        >
          <ChevronLeft
            className={`size-4 transition ${effectiveCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div className={effectiveCollapsed ? "flex justify-center" : ""}>
        {rootItem}
      </div>
      {workspaceItems}
      <div className={`${effectiveCollapsed ? "mt-auto flex justify-center pt-3" : "mt-auto pt-3"}`}>
        {profileItem}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`relative z-40 hidden h-screen shrink-0 border-r border-border bg-card/90 md:sticky md:top-0 md:flex md:flex-col ${effectiveCollapsed ? "md:w-20" : "md:w-64"
          }`}
      >
        {content}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-card/35"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 h-full w-20 border-r border-border bg-background shadow-xl">
            {content}
          </div>
        </div>
      ) : null}

      {confirmDeleteId ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            className="absolute inset-0 bg-card/45"
            onClick={() => (deleting ? null : setConfirmDeleteId(""))}
          />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-foreground">Delete workspace?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action will remove the workspace and related projects/tasks permanently.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId("")}
                disabled={deleting}
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  try {
                    setDeleting(true);
                    const deletingId = confirmDeleteId;
                    await deleteWorkspace(deletingId);
                    toast.success("Workspace deleted");
                    setConfirmDeleteId("");
                    if (pathname.startsWith(`/dashboard/w/${deletingId}`)) {
                      router.push("/dashboard/workspaces");
                    }
                  } catch (error) {
                    toast.error(error?.message || "Failed to delete workspace");
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Workspace"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Topbar({ onOpenSidebar }) {
  const pathname = usePathname();
  const params = useParams();
  const workspaces = useMockStore((state) => state.workspaces || []);

  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId],
  );
  const breadcrumb = useMemo(() => {
    if (pathname === "/dashboard/workspaces") {
      return [
        { label: "Dashboard", href: "/dashboard/workspaces" },
        { label: "Workspaces" },
      ];
    }
    if (pathname === "/dashboard/profile") {
      return [
        { label: "Dashboard", href: "/dashboard/workspaces" },
        { label: "Profile" },
      ];
    }
    if (pathname.startsWith("/dashboard/w/")) {
      const routeKey = pathname.split("/").filter(Boolean)[3] || "overview";
      const currentLabel =
        routeKey === "overview" ? "Overview" : WORKSPACE_ROUTE_LABELS[routeKey] || "Workspace";
      return [
        { label: "Dashboard", href: "/dashboard/workspaces" },
        { label: workspace?.name || "Workspace", href: `/dashboard/w/${workspaceId}` },
        { label: currentLabel },
      ];
    }
    return [{ label: "Dashboard", href: "/dashboard/workspaces" }];
  }, [pathname, workspace?.name, workspaceId]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background px-3 sm:px-4 lg:px-7">
      <div className="flex h-11 items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground md:hidden"
          >
            <Menu className="size-4 sm:size-5" />
          </button>
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[11px]">
              {breadcrumb.map((item, index) => (
                <div key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                  {index > 0 ? <span className="text-muted-foreground/45">/</span> : null}
                  {item.href && index !== breadcrumb.length - 1 ? (
                    <Link
                      href={item.href}
                      className="truncate text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${
                        index === breadcrumb.length - 1
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="flex shrink-0 items-center gap-1.5">
          <GlobalTimerControl />
          <NotificationsMenu />
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, loaded } = useMockStore((state) => ({
    currentUser: state.currentUser || null,
    loaded: Boolean(state.loaded),
  }));

  useEffect(() => {
    loadDashboard({ force: true, silent: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!loaded || !currentUser?.id) return;

    const poll = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      refreshNotifications().catch(() => {});
    }, 8000);

    return () => clearInterval(poll);
  }, [loaded, currentUser?.id]);

  useEffect(() => {
    if (!loaded || !currentUser?.id) return;

    const refreshNow = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      refreshNotifications().catch(() => {});
    };

    window.addEventListener("focus", refreshNow);
    document.addEventListener("visibilitychange", refreshNow);

    return () => {
      window.removeEventListener("focus", refreshNow);
      document.removeEventListener("visibilitychange", refreshNow);
    };
  }, [loaded, currentUser?.id]);

  useEffect(() => {
    if (!loaded || !currentUser?.id) return;

    const completion = computeProfileCompletion(currentUser);
    const key = `dashboard.profile.nudge.${currentUser.id}`;

    if (completion >= 100) {
      if (typeof window !== "undefined") window.sessionStorage.removeItem(key);
      return;
    }

    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(key) === "1") return;

    toast.info("Complete your profile to unlock a better dashboard experience.");
    window.sessionStorage.setItem(key, "1");
  }, [loaded, currentUser]);

  return (
    <div className="flex min-h-screen bg-surface text-foreground dark:bg-background">
      <AppSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-0 sm:px-4 sm:pb-5 md:px-6 md:pb-6 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;
