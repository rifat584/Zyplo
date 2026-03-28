"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Ellipsis,
  GanttChartSquare,
  KanbanSquare,
  LayoutGrid,
  List,
  Menu,
  Moon,
  Plus,
  Users,
  UserCircle2,
  Settings,
  Sun,
  Star,
  Timer,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/Context/ThemeContext";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar } from "./ui";
import Logo from "../Shared/Logo/Logo";
import {
  createProject,
  deleteWorkspace,
  loadDashboard,
  markAllNotificationsRead,
  refreshNotifications,
  resolveWorkspaceRole,
  useMockStore,
  useWorkspaceAccess,
} from "./mockStore";
import {
  useWorkspaceProjectSelection,
  writeSelectedProjectId,
} from "./projectSelection";
import {
  dashboardActiveSurfaceClasses,
  dashboardChromeButtonClasses,
  dashboardContextButtonClasses,
  dashboardInlineNavItemActiveClasses,
  dashboardInlineNavItemClasses,
  dashboardMenuItemClasses,
  dashboardMenuItemDangerClasses,
  dashboardSidebarNavItemActiveClasses,
  dashboardSidebarNavItemClasses,
} from "./styles";

const SIDEBAR_KEY = "dashboard.sidebarCollapsed";
const WORKSPACE_ROUTE_LABELS = {
  timeline: "Timeline",
  board: "Board",
  calender: "Calendar",
  list: "List",
  timesheet: "Time Sheet",
  members: "Members",
  settings: "Settings",
};

const WORKSPACE_BADGE_GRADIENTS = [
  "from-primary to-secondary text-primary-foreground",
  "from-emerald-500 to-teal-400 text-white",
  "from-amber-500 to-orange-500 text-white",
  "from-rose-500 to-pink-500 text-white",
  "from-sky-500 to-cyan-400 text-white",
  "from-violet-500 to-fuchsia-500 text-white",
  "from-lime-500 to-emerald-500 text-white",
  "from-blue-500 to-indigo-500 text-white",
  "from-red-500 to-orange-400 text-white",
  "from-slate-500 to-zinc-400 text-white",
];

// --- BULLETPROOF STARRED WORKSPACES HOOK ---
const STARRED_KEY = "dashboard.starredWorkspaces";

function useStarredWorkspaces() {
  const currentUser = useMockStore((state) => state.currentUser || null);
  const [starredIds, setStarredIds] = useState([]);

  // 1. Instant Load: Read from LocalStorage so refresh works instantly
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STARRED_KEY);
      if (stored) setStarredIds(JSON.parse(stored));
    } catch {}
  }, []);

  // 2. Database Truth Sync: The DB is the ultimate source of truth.
  useEffect(() => {
    if (currentUser && Array.isArray(currentUser.starredWorkspaceIds)) {
      setStarredIds(currentUser.starredWorkspaceIds);
      try {
        localStorage.setItem(STARRED_KEY, JSON.stringify(currentUser.starredWorkspaceIds));
      } catch {}
    }
  }, [currentUser?.starredWorkspaceIds]);

  // 3. Cross-Component Sync: Keep sidebar and page in sync instantly
  useEffect(() => {
    const sync = (e) => {
      if (e.detail) setStarredIds(e.detail);
    };
    window.addEventListener("zyplo-stars-updated", sync);
    return () => window.removeEventListener("zyplo-stars-updated", sync);
  }, []);

  const toggleStar = async (workspaceId) => {
    const isCurrentlyStarred = starredIds.includes(workspaceId);
    const nextStarred = isCurrentlyStarred
      ? starredIds.filter((id) => id !== workspaceId)
      : [...starredIds, workspaceId];

    // 4. Optimistic UI Update & Save to LocalStorage
    setStarredIds(nextStarred);
    try {
      localStorage.setItem(STARRED_KEY, JSON.stringify(nextStarred));
    } catch {}
    
    window.dispatchEvent(
      new CustomEvent("zyplo-stars-updated", { detail: nextStarred })
    );

    // 5. PIGGYBACK ON THE PROFILE ROUTE (Bypasses all 404/405 errors!)
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-silent-fetch": "true", // Invisible to the global loader
        },
        body: JSON.stringify({
          starredWorkspaceIds: nextStarred,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend rejected the save: ${response.status}`);
      }

      // Force the store to quietly re-fetch to guarantee perfect sync
      await loadDashboard({ force: true, silent: true });

    } catch (error) {
      console.error("Star sync failed:", error);
      toast.error("Failed to save star to database!");
      
      // Revert the star visually if the database save failed
      setStarredIds(starredIds);
      window.dispatchEvent(
        new CustomEvent("zyplo-stars-updated", { detail: starredIds })
      );
    }
  };

  return { starredIds, toggleStar };
}

const WORKSPACE_NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    href: (id) => `/dashboard/w/${id}`,
  },
  {
    id: "timeline",
    label: "Timeline",
    icon: GanttChartSquare,
    href: (id) => `/dashboard/w/${id}/timeline`,
  },
  {
    id: "board",
    label: "Board",
    icon: KanbanSquare,
    href: (id) => `/dashboard/w/${id}/board`,
  },
  {
    id: "calender",
    label: "Calendar",
    icon: CalendarDays,
    href: (id) => `/dashboard/w/${id}/calender`,
  },
  {
    id: "list",
    label: "List",
    icon: List,
    href: (id) => `/dashboard/w/${id}/list`,
  },
  {
    id: "timesheet",
    label: "Time Sheet",
    icon: Clock3,
    href: (id) => `/dashboard/w/${id}/timesheet`,
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    href: (id) => `/dashboard/w/${id}/members`,
  },
];

function getWorkspaceBillingBadge(subscription) {
  const planId = String(subscription?.planId || "").trim().toLowerCase();
  const status = String(subscription?.status || "").trim().toLowerCase();

  if (!planId) return null;
  if (["inactive", "canceled", "incomplete_expired"].includes(status)) return null;

  const label = planId.charAt(0).toUpperCase() + planId.slice(1);

  if (["active", "trialing"].includes(status)) {
    return {
      label,
      short: label.charAt(0),
      pillClassName: "border-success/25 bg-success/10 text-success",
      chipClassName: "bg-success text-success-foreground",
    };
  }

  if (["past_due", "unpaid", "incomplete"].includes(status)) {
    return {
      label,
      short: label.charAt(0),
      pillClassName: "border-warning/25 bg-warning/10 text-warning",
      chipClassName: "bg-warning text-warning-foreground",
    };
  }

  return {
    label,
    short: label.charAt(0),
    pillClassName: "border-border bg-muted/70 text-muted-foreground",
    chipClassName: "bg-muted text-foreground",
  };
}

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

function ProjectCreateDialog({
  open,
  onClose,
  onSubmit,
  projectName,
  setProjectName,
  projectKey,
  setProjectKey,
  creatingProject,
  projectError,
}) {
  const projectNameInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      projectNameInputRef.current?.focus();
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80">
      <div className="flex min-h-full items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-md max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Create a project
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Add a focused project to this workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close project dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 px-5 pb-4">
          <div className="space-y-1.5">
            <label
              htmlFor="project-name"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              Project name
            </label>
            <input
              ref={projectNameInputRef}
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Project Name"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="project-key"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              Key
            </label>
            <input
              id="project-key"
              value={projectKey}
              onChange={(event) => setProjectKey(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Project Key (Optional)"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          {projectError ? (
            <p className="text-sm text-destructive">{projectError}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
          >
            Cancel
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSubmit}
            disabled={!projectName.trim() || creatingProject}
            className="border-primary text-primary shadow-none hover:scale-100 hover:border-primary hover:bg-primary/90 hover:text-primary-foreground hover:shadow-none dark:border-primary/90  dark:hover:bg-primary/90"
          >
            {creatingProject ? "Creating..." : "Create project"}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}

function DeleteProjectDialog({
  open,
  project,
  confirmationValue,
  setConfirmationValue,
  deletingProject,
  onClose,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !deletingProject) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, deletingProject, onClose]);

  if (!open || !project) return null;

  const projectName = String(project.name || "");
  const canDelete =
    confirmationValue.trim() === projectName.trim() && !deletingProject;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/72">
      <button
        type="button"
        aria-label="Close delete project dialog"
        onClick={() => {
          if (deletingProject) return;
          onClose();
        }}
        className="absolute inset-0"
      />

      <div className="flex min-h-full items-center justify-center px-4 py-6 sm:py-8">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-project-title"
          className="relative w-full max-w-lg max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-border/70 bg-card p-6 text-card-foreground"
        >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              <h2
                id="delete-project-title"
                className="font-heading text-lg font-semibold tracking-tight text-foreground"
              >
                Delete project &quot;{projectName}&quot;?
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                This will permanently delete this project and all associated
                data. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="delete-project-confirmation"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                Type project name to confirm
              </label>
              <input
                id="delete-project-confirmation"
                value={confirmationValue}
                onChange={(event) => setConfirmationValue(event.target.value)}
                placeholder={projectName}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-destructive/45"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                disabled={deletingProject}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!canDelete}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-destructive text-destructive-foreground shadow-none hover:scale-100 hover:bg-destructive/90 hover:shadow-none",
                )}
              >
                {deletingProject ? "Deleting..." : "Delete project"}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
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
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayEmail}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              dashboardMenuItemDangerClasses,
              "w-full rounded-lg px-2 py-2 text-left text-sm",
            )}
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
  if (h > 0)
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
        throw new Error(
          data?.error || data?.message || "Failed to fetch active timer",
        );
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
    return () =>
      window.removeEventListener("zyplo-timer-updated", onTimerUpdated);
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

  const startMs = activeTimer?.startTime
    ? new Date(activeTimer.startTime).getTime()
    : null;
  const baseDuration = Number(activeTimer?.duration || 0);
  const liveDuration =
    startMs && Number.isFinite(startMs)
      ? Math.max(
          baseDuration,
          baseDuration + Math.floor((nowMs - startMs) / 1000),
        )
      : baseDuration;
  const activeTask =
    tasks.find(
      (task) => String(task.id) === String(activeTimer?.taskId || ""),
    ) || null;
  const hasActiveTimer = Boolean(activeTimer?.id);

  const containerClasses = hasActiveTimer
    ? dashboardActiveSurfaceClasses
    : dashboardChromeButtonClasses;

  const textClasses = hasActiveTimer
    ? "text-[var(--dashboard-active-foreground)]"
    : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5",
        containerClasses,
      )}
    >
      <span
        className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold ${textClasses}`}
      >
        <Timer className="size-3.5 sm:size-4 shrink-0" />

        <span className={hasActiveTimer ? "" : "hidden sm:inline"}>
          {loading && !hasActiveTimer
            ? "..."
            : hasActiveTimer
              ? formatElapsed(liveDuration)
              : "No timer"}
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
                const response = await fetch(
                  `/api/dashboard/time/${activeTimer.id}/stop`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                  },
                );
                const text = await response.text();
                const data = parseJsonSafe(text, null);
                if (!response.ok) {
                  throw new Error(
                    data?.error || data?.message || "Failed to stop timer",
                  );
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
  const [syncingReadState, setSyncingReadState] = useState(false);
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

  useEffect(() => {
    if (!open || unreadCount === 0 || syncingReadState) return;

    let active = true;

    async function syncReadState() {
      try {
        setSyncingReadState(true);
        await markAllNotificationsRead();
      } catch (error) {
        if (active) {
          toast.error(error?.message || "Failed to update notifications");
        }
      } finally {
        if (active) setSyncingReadState(false);
      }
    }

    syncReadState().catch(() => {});

    return () => {
      active = false;
    };
  }, [open, unreadCount, syncingReadState]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          dashboardChromeButtonClasses,
          "relative rounded-lg p-1.5 sm:p-2",
        )}
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
        <div className="fixed inset-x-3 top-14 z-40 overflow-hidden rounded-xl border border-border bg-card shadow-xl sm:absolute sm:right-0 sm:left-auto sm:top-11 sm:w-[24rem] sm:max-w-[calc(100vw-2rem)]">
          <div className="border-b border-border px-3 py-2.5 sm:px-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Notifications
              </p>
              <span className="text-[11px] font-medium text-muted-foreground">
                {syncingReadState
                  ? "Updating..."
                  : unreadCount > 0
                    ? `${unreadCount} unread`
                    : "All caught up"}
              </span>
            </div>
          </div>
          <div className="max-h-[min(24rem,calc(100vh-5.5rem))] overflow-y-auto p-2 sm:max-h-80">
            {notifications.length ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "mb-1 rounded-lg border px-3 py-2.5 last:mb-0 sm:px-3 sm:py-2",
                    item.read
                      ? "border-border bg-card"
                      : dashboardActiveSurfaceClasses,
                  )}
                >
                  <p className="text-sm leading-6 text-foreground">
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        dashboardChromeButtonClasses,
        "inline-flex size-8 items-center justify-center rounded-lg sm:size-7",
      )}
    >
      {isDark ? (
        <Sun className="size-4 text-primary" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}

function formatPlanBadgeLabel(planId) {
  const normalized = String(planId || "")
    .trim()
    .toLowerCase();
  if (!normalized) return "Free";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getPlanBadgeClasses(planId) {
  const normalized = String(planId || "")
    .trim()
    .toLowerCase();
  if (normalized === "team") {
    return "border-secondary/25 bg-secondary/10 text-secondary";
  }
  if (normalized === "starter") {
    return "border-primary/25 bg-primary/10 text-primary";
  }
  if (normalized === "studio") {
    return "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  return "border-border bg-muted/70 text-muted-foreground";
}

function PlanBadge() {
  const { status: sessionStatus } = useSession();
  const [planId, setPlanId] = useState("");

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    let active = true;

    async function loadPlan() {
      try {
        const response = await fetch("/api/billing/subscription", {
          cache: "no-store",
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok || !active) return;
        setPlanId(String(data?.subscription?.planId || ""));
      } catch {
        if (!active) return;
        setPlanId("");
      }
    }

    loadPlan();
    return () => {
      active = false;
    };
  }, [sessionStatus]);

  if (sessionStatus !== "authenticated") return null;

  return (
    <span
      title="Current plan"
      className={cn(
        "inline-flex py-1.5 max-w-30 items-center rounded-full border px-2.5 text-xs font-semibold uppercase tracking-[0.14em] sm:px-3",
        getPlanBadgeClasses(planId),
      )}
    >
      <span className="truncate">{formatPlanBadgeLabel(planId)}</span>
    </span>
  );
}

function AppSidebar({ mobileOpen, onCloseMobile }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();
  const { collapsed, toggle } = useSidebarState();
  const { starredIds, toggleStar } = useStarredWorkspaces();
  const [compactWorkspaceActions, setCompactWorkspaceActions] = useState(false);
  const effectiveCollapsed = mobileOpen ? true : collapsed;
  const useCompactWorkspaceActions = effectiveCollapsed || compactWorkspaceActions;
  
  const { workspaces, currentUser, loaded } = useMockStore((state) => ({
    workspaces: state.workspaces || [],
    currentUser: state.currentUser || null,
    loaded: Boolean(state.loaded),
  }));

  const [actionsOpenFor, setActionsOpenFor] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [workspaceBilling, setWorkspaceBilling] = useState({});
  const actionsMenuRef = useRef(null);
  const toggleWorkspaceActions = (workspaceId) => {
    setActionsOpenFor((current) => (current === workspaceId ? "" : workspaceId));
  };

  const pickWorkspaceGradient = (workspace) => {
    const key = workspace?.id || workspace?.name || "workspace";
    let hash = 0;
    for (let i = 0; i < key.length; i += 1)
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return WORKSPACE_BADGE_GRADIENTS[hash % WORKSPACE_BADGE_GRADIENTS.length];
  };

  const getWorkspaceBadgeLabel = (workspace) => {
    const name = String(workspace?.name || "").trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2)
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    const compact = name.replace(/\s+/g, "");
    return (compact.slice(0, 2) || "WS").toUpperCase();
  };

  // --- SPLIT WORKSPACES INTO TWO GROUPS ---
  const starredWorkspaces = useMemo(() => {
    return workspaces
      .filter((w) => starredIds.includes(w.id))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [workspaces, starredIds]);

  const otherWorkspaces = useMemo(() => {
    return workspaces
      .filter((w) => !starredIds.includes(w.id))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [workspaces, starredIds]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!actionsOpenFor) return;
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target)
      ) {
        setActionsOpenFor("");
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [actionsOpenFor]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(
      "(max-width: 1023px), (hover: none), (pointer: coarse)",
    );

    const updateCompactWorkspaceActions = () => {
      setCompactWorkspaceActions(mediaQuery.matches);
    };

    updateCompactWorkspaceActions();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateCompactWorkspaceActions);
      return () =>
        mediaQuery.removeEventListener("change", updateCompactWorkspaceActions);
    }

    mediaQuery.addListener(updateCompactWorkspaceActions);
    return () => mediaQuery.removeListener(updateCompactWorkspaceActions);
  }, []);

  useEffect(() => {
    let alive = true;

    if (!loaded) {
      setWorkspaceBilling({});
      return undefined;
    }
    if (sessionStatus === "loading") {
      return undefined;
    }

    if (sessionStatus !== "authenticated" || !workspaces.length) {
      setWorkspaceBilling({});
      return undefined;
    }

    async function loadWorkspaceBilling() {
      const entries = await Promise.all(
        workspaces.map(async (workspace) => {
          try {
            const response = await fetch(
              `/api/billing/subscription?workspaceId=${encodeURIComponent(workspace.id)}`,
              { cache: "no-store" },
            );
            const text = await response.text();
            const data = parseJsonSafe(text, null);

            if (!response.ok) return [workspace.id, null];
            return [workspace.id, getWorkspaceBillingBadge(data?.subscription)];
          } catch {
            return [workspace.id, null];
          }
        }),
      );

      if (!alive) return;
      setWorkspaceBilling(
        Object.fromEntries(entries.filter(([, badge]) => Boolean(badge))),
      );
    }

    loadWorkspaceBilling().catch(() => {});

    return () => {
      alive = false;
    };
  }, [loaded, sessionStatus, workspaces]);
  
  const rootItem = (
    <Link
      href="/dashboard/workspaces"
      onClick={onCloseMobile}
      data-collapsed={effectiveCollapsed ? "true" : "false"}
      className={cn(
        pathname === "/dashboard/workspaces"
          ? dashboardSidebarNavItemActiveClasses
          : dashboardSidebarNavItemClasses,
        "group flex items-center rounded-xl",
        effectiveCollapsed
          ? "size-9 justify-center px-0"
          : "gap-2 py-2 pl-4 pr-3",
      )}
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
      data-collapsed={effectiveCollapsed ? "true" : "false"}
      className={cn(
        pathname === "/dashboard/profile"
          ? dashboardSidebarNavItemActiveClasses
          : dashboardSidebarNavItemClasses,
        "group flex items-center rounded-xl",
        effectiveCollapsed
          ? "size-9 justify-center px-0"
          : "gap-2 py-2 pl-4 pr-3",
      )}
      title={effectiveCollapsed ? "Profile" : undefined}
    >
      <UserCircle2 className="size-4 shrink-0" />
      {!effectiveCollapsed ? <span className="text-sm">Profile</span> : null}
    </Link>
  );

  const settingsItem = (
    <Link
      href="/dashboard/settings"
      onClick={onCloseMobile}
      data-collapsed={effectiveCollapsed ? "true" : "false"}
      className={cn(
        pathname === "/dashboard/settings"
          ? dashboardSidebarNavItemActiveClasses
          : dashboardSidebarNavItemClasses,
        "group flex items-center rounded-xl",
        effectiveCollapsed
          ? "size-9 justify-center px-0"
          : "gap-2 py-2 pl-4 pr-3",
      )}
      title={effectiveCollapsed ? "Settings" : undefined}
    >
      <Settings className="size-4 shrink-0" />
      {!effectiveCollapsed ? <span className="text-sm">Settings</span> : null}
    </Link>
  );

  // Helper to render a single workspace item in the sidebar
  const renderSidebarWorkspace = (workspace) => {
    const isAdmin = resolveWorkspaceRole(workspace, currentUser) === "admin";
    const isStarred = starredIds.includes(workspace.id);
    const badgeLabel = getWorkspaceBadgeLabel(workspace);
    const badgeGradient = pickWorkspaceGradient(workspace);
    const href = `/dashboard/w/${workspace.id}`;
    const active = pathname === href || pathname.startsWith(`${href}/`);
    const menuOpen = actionsOpenFor === workspace.id;

    return (
      <div key={workspace.id} className="group relative">
        <button
          type="button"
          onClick={() => {
            if (useCompactWorkspaceActions && active) {
              toggleWorkspaceActions(workspace.id);
              return;
            }

            setActionsOpenFor("");
            router.push(href);
            onCloseMobile?.();
          }}
          onDoubleClick={() => {
            if (!active) return;
            toggleWorkspaceActions(workspace.id);
          }}
          data-collapsed={effectiveCollapsed ? "true" : "false"}
          className={cn(
            active
              ? dashboardSidebarNavItemActiveClasses
              : dashboardSidebarNavItemClasses,
            "flex w-full items-center rounded-xl",
            effectiveCollapsed
              ? "size-9 justify-center px-0"
              : "gap-2 py-2 pl-4 pr-10",
          )}
          title={workspace.name}
        >
          <span
            className={cn(
              "relative flex shrink-0 items-center justify-center rounded-md border border-border/60 bg-linear-to-br font-sans font-semibold uppercase tracking-[0.06em]",
              "size-6 text-[11px]",
              badgeGradient,
            )}
          >
            {badgeLabel}
          </span>
          {!effectiveCollapsed ? (
            <span className="flex min-w-0 flex-1 items-center gap-2 pr-1">
              <span className="truncate text-sm">{workspace.name}</span>
              {isStarred ? (
                <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
              ) : null}
            </span>
          ) : null}
        </button>

        {!useCompactWorkspaceActions ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleWorkspaceActions(workspace.id);
            }}
            aria-label={`Workspace actions for ${workspace.name}`}
            className={cn(
              dashboardChromeButtonClasses,
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100",
            )}
          >
            <Ellipsis className="size-4" />
          </button>
        ) : null}

        {menuOpen ? (
          <div
            ref={actionsMenuRef}
            className={cn(
              "z-50 rounded-xl border border-border bg-card p-1 shadow-lg",
              useCompactWorkspaceActions
                ? mobileOpen
                  ? "fixed left-[5.5rem] top-1/2 w-[min(13rem,calc(100vw-6.5rem))] max-h-[calc(100vh-2rem)] -translate-y-1/2 overflow-y-auto"
                  : "absolute left-full top-1/2 ml-2 w-52 -translate-y-1/2"
                : "right-0 top-10",
            )}
          >
            <button
              type="button"
              onClick={() => {
                setActionsOpenFor("");
                toggleStar(workspace.id);
                toast.success(
                  isStarred
                    ? `Removed ${workspace.name} from starred`
                    : `Added ${workspace.name} to starred`
                );
              }}
              className={cn(
                dashboardMenuItemClasses,
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
              )}
            >
              <Star
                className={cn(
                  "size-4",
                  isStarred ? "fill-amber-400 text-amber-400" : ""
                )}
              />
              {isStarred ? "Unstar workspace" : "Add to starred"}
            </button>
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActionsOpenFor("");
                    onCloseMobile?.();
                    router.push(`/dashboard/w/${workspace.id}/members`);
                  }}
                  className={cn(
                    dashboardMenuItemClasses,
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                  )}
                >
                  <UserPlus className="size-4" />
                  Add people
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActionsOpenFor("");
                    onCloseMobile?.();
                    router.push(`/dashboard/w/${workspace.id}/settings`);
                  }}
                  className={cn(
                    dashboardMenuItemClasses,
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                  )}
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
                  className={cn(
                    dashboardMenuItemDangerClasses,
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                  )}
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
  };

  const workspaceItems = (
    <div
      className={cn(
        "mt-3",
        effectiveCollapsed ? "flex flex-col items-center space-y-1" : "space-y-1"
      )}
    >
      {/* STARRED SECTION */}
      {starredWorkspaces.length > 0 && (
        <div className="mb-4">
          {!effectiveCollapsed ? (
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Starred
            </p>
          ) : null}
          <div className="space-y-1">
            {starredWorkspaces.map(renderSidebarWorkspace)}
          </div>
        </div>
      )}

      {/* OTHER WORKSPACES SECTION */}
      <div>
        {!effectiveCollapsed ? (
          <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {starredWorkspaces.length > 0 ? "Your Workspaces" : "Workspaces"}
          </p>
        ) : null}
        <div className="space-y-1">
          {otherWorkspaces.map(renderSidebarWorkspace)}
        </div>
      </div>
    </div>
  );

  const skeletonContent = (
    <div
      className={cn(
        "flex h-full flex-col overflow-visible animate-pulse",
        mobileOpen ? "p-3" : effectiveCollapsed ? "p-0" : "p-3",
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-[45px] items-center",
          effectiveCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!effectiveCollapsed ? <div className="h-9 w-28 rounded bg-muted" /> : null}
        <div className="hidden h-8 w-8 rounded-lg bg-muted md:block" />
      </div>

      <div className={effectiveCollapsed ? "flex justify-center" : ""}>
        <div className={cn("rounded-xl bg-muted", effectiveCollapsed ? "size-9" : "h-9 w-full")} />
      </div>

      <div className={`mt-3 space-y-1 ${effectiveCollapsed ? "flex flex-col items-center" : ""}`}>
        {!effectiveCollapsed ? (
          <div className="mx-3 h-3 w-28 rounded bg-muted" />
        ) : null}
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`sidebar-skeleton-${index}`}
            className={cn(
              "flex items-center rounded-xl",
              effectiveCollapsed ? "size-9 justify-center px-0" : "gap-2 py-2 pl-4 pr-3",
            )}
          >
            <div className="size-6 shrink-0 rounded-md bg-muted" />
            {!effectiveCollapsed ? (
              <>
                <div className="h-4 flex-1 rounded bg-muted" />
                <div className="h-5 w-12 rounded-full bg-muted" />
              </>
            ) : null}
          </div>
        ))}
      </div>

      <div className={`${effectiveCollapsed ? "mt-auto flex justify-center pt-3" : "mt-auto pt-3"}`}>
        <div className={cn("rounded-xl bg-muted", effectiveCollapsed ? "size-9" : "h-9 w-full")} />
      </div>
    </div>
  );

  const content = (
    <div
      className={cn(
        "flex h-full flex-col overflow-visible",
        mobileOpen ? "p-3" : effectiveCollapsed ? "p-0" : "p-3",
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-11.25 items-center",
          effectiveCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          <Link href={"/"} className="flex items-center justify-center">
            <Logo
              size={25}
              showText={!effectiveCollapsed}
              className={effectiveCollapsed ? "" : "ml-2"}
            />
          </Link>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={cn(
            dashboardChromeButtonClasses,
            "hidden rounded-lg p-1.5 md:block",
          )}
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
      <div
        className={cn(
          effectiveCollapsed
            ? "mt-auto flex flex-col items-center gap-1 pt-3"
            : "mt-auto space-y-1 pt-3",
        )}
      >
        {profileItem}
        {settingsItem}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`relative z-40 hidden h-screen shrink-0 border-r border-border bg-background md:sticky md:top-0 md:flex md:flex-col ${
          effectiveCollapsed ? "md:w-12" : "md:w-64"
        }`}
      >
        {loaded ? content : skeletonContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-card/35"
            onClick={onCloseMobile}
          />
          <div className="absolute left-0 top-0 h-full w-20 border-r border-border bg-background">
            {loaded ? content : skeletonContent}
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
            <h3 className="text-lg font-semibold text-foreground">
              Delete workspace?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action will remove the workspace and related projects/tasks
              permanently.
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
                className="rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50"
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

function WorkspaceToolbar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";
  const isWorkspaceRoute = pathname.startsWith("/dashboard/w/") && workspaceId;
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [projectError, setProjectError] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationValue, setDeleteConfirmationValue] = useState("");
  const [projectPendingDelete, setProjectPendingDelete] = useState(null);
  const switcherRef = useRef(null);
  const { isAdmin } = useWorkspaceAccess(workspaceId);
  const { workspaces, projects } = useMockStore((state) => ({
    workspaces: state.workspaces || [],
    projects: state.projects || [],
  }));
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId],
  );
  const workspaceProjects = useMemo(
    () => projects.filter((item) => item.workspaceId === workspaceId),
    [projects, workspaceId],
  );
  const { selectedProject, updateProjectSelection } =
    useWorkspaceProjectSelection(workspaceId, workspaceProjects);

  useEffect(() => {
    if (!workspaceId) return;

    const projectParam = searchParams.get("project") || "";
    if (!projectParam) return;

    writeSelectedProjectId(workspaceId, projectParam);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("project");
    const query = nextParams.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams, workspaceId]);

  useEffect(() => {
    setProjectError("");
    setProjectDialogOpen(false);
    setProjectSwitcherOpen(false);
    setDeleteDialogOpen(false);
    setDeleteConfirmationValue("");
    setProjectPendingDelete(null);
    setProjectName("");
    setProjectKey("");
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event) {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setProjectSwitcherOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    function openProjectDialog() {
      if (!isAdmin) return;
      setProjectError("");
      setProjectDialogOpen(true);
    }

    window.addEventListener("zyplo-open-project-dialog", openProjectDialog);
    return () =>
      window.removeEventListener(
        "zyplo-open-project-dialog",
        openProjectDialog,
      );
  }, [isAdmin]);

  async function handleCreateProject() {
    const name = projectName.trim();
    if (!name || !workspaceId || creatingProject) return;

    try {
      setCreatingProject(true);
      setProjectError("");
      const project = await createProject(workspaceId, name, projectKey.trim());
      setProjectName("");
      setProjectKey("");
      setProjectDialogOpen(false);
      updateProjectSelection(String(project?.id || ""));
    } catch (error) {
      toast.error(error?.message || "Failed to create project");
      setProjectError(error?.message || "Failed to create project");
    } finally {
      setCreatingProject(false);
    }
  }

  async function deleteProject(projectToDelete) {
    if (!projectToDelete?.id || deletingProject) return;

    try {
      setDeletingProject(true);
      const response = await fetch(
        `/api/dashboard/projects/${projectToDelete.id}`,
        {
          method: "DELETE",
        },
      );
      const text = await response.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text ? { message: text } : null;
      }

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to delete project",
        );
      }

      await loadDashboard({ force: true });
      const remainingProjects = workspaceProjects.filter(
        (project) => String(project.id) !== String(projectToDelete.id),
      );
      updateProjectSelection(String(remainingProjects[0]?.id || ""));
      setProjectSwitcherOpen(false);
      setDeleteDialogOpen(false);
      setDeleteConfirmationValue("");
      setProjectPendingDelete(null);
      toast.success(`Deleted Project "${projectToDelete.name}"`);
    } catch (error) {
      toast.error(error?.message || "Failed to delete project");
    } finally {
      setDeletingProject(false);
    }
  }

  function handleDeleteProject() {
    if (!selectedProject?.id || deletingProject) return;
    setProjectError("");
    setProjectSwitcherOpen(false);
    setProjectPendingDelete(selectedProject);
    setDeleteConfirmationValue("");
    setDeleteDialogOpen(true);
  }

  if (!isWorkspaceRoute) return null;

  return (
    <>
      <section className="border-b border-border/80 bg-background">
        <div className="px-3 py-3 sm:px-4 md:px-6 lg:px-7">
          <div className="flex flex-col ">
            <div className="flex items-start justify-between gap-3 lg:items-center">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 text-sm ">
                <span className="min-w-0 truncate text-xl font-bold tracking-tight text-foreground">
                  {workspace?.name || "Loading workspace..."}
                </span>
                <span className="text-muted-foreground/55">/</span>

                <div ref={switcherRef} className="relative min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      setProjectSwitcherOpen((current) => !current)
                    }
                    disabled={!workspaceProjects.length}
                    aria-haspopup="menu"
                    aria-expanded={projectSwitcherOpen}
                    className={cn(
                      dashboardContextButtonClasses,
                      "inline-flex max-w-full items-center gap-1 rounded-lg px-1.5 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                  >
                    <span className="truncate font-medium">
                      {selectedProject?.name || "No project yet"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground/75 transition",
                        projectSwitcherOpen ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {projectSwitcherOpen && workspaceProjects.length ? (
                    <div className="absolute left-0 top-full z-30 mt-2 min-w-[16rem] rounded-xl border border-border bg-popover p-1 text-popover-foreground">
                      <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Switch project
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {workspaceProjects.map((project) => {
                          const active =
                            String(project.id) ===
                            String(selectedProject?.id || "");

                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => {
                                updateProjectSelection(String(project.id));
                                setProjectSwitcherOpen(false);
                              }}
                              className={cn(
                                active
                                  ? dashboardActiveSurfaceClasses
                                  : dashboardMenuItemClasses,
                                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                              )}
                            >
                              <span className="truncate">{project.name}</span>
                              {active ? (
                                <span className="ml-3 text-[12px] font-medium">
                                  Current
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      {isAdmin && selectedProject?.id ? (
                        <div className="mt-1 border-t border-border pt-1">
                          <button
                            type="button"
                            onClick={handleDeleteProject}
                            disabled={deletingProject}
                            className={cn(
                              dashboardMenuItemDangerClasses,
                              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-60",
                            )}
                          >
                            <Trash2 className="size-4" />
                            {deletingProject ? "Deleting..." : "Delete project"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              {isAdmin ? (
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProjectError("");
                      setProjectDialogOpen(true);
                    }}
                    className="shrink-0 border-primary text-primary shadow-none hover:scale-100 hover:border-primary hover:bg-primary/90 hover:text-primary-foreground hover:shadow-none dark:border-primary/90  dark:hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    New Project
                  </Button>

                  <Link
                    href={`/dashboard/w/${workspaceId}/settings`}
                    aria-label="Workspace settings"
                    className={cn(
                      dashboardContextButtonClasses,
                      "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm sm:px-3",
                    )}
                  >
                    <Settings className="size-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="-mx-1 overflow-x-auto ">
              <nav
                aria-label="Workspace navigation"
                className="-ml-2 flex min-w-max items-center gap-1"
              >
                {WORKSPACE_NAV_ITEMS.map((item) => {
                  const baseHref = item.href(workspaceId);
                  const active = pathname === baseHref;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.id}
                      href={baseHref}
                      className={cn(
                        active
                          ? dashboardInlineNavItemActiveClasses
                          : dashboardInlineNavItemClasses,
                        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <ProjectCreateDialog
        open={projectDialogOpen}
        onClose={() => {
          if (creatingProject) return;
          setProjectDialogOpen(false);
          setProjectError("");
        }}
        onSubmit={handleCreateProject}
        projectName={projectName}
        setProjectName={setProjectName}
        projectKey={projectKey}
        setProjectKey={setProjectKey}
        creatingProject={creatingProject}
        projectError={projectError}
      />

      <DeleteProjectDialog
        open={deleteDialogOpen}
        project={projectPendingDelete}
        confirmationValue={deleteConfirmationValue}
        setConfirmationValue={setDeleteConfirmationValue}
        deletingProject={deletingProject}
        onClose={() => {
          if (deletingProject) return;
          setDeleteDialogOpen(false);
          setDeleteConfirmationValue("");
          setProjectPendingDelete(null);
        }}
        onConfirm={() => deleteProject(projectPendingDelete)}
      />
    </>
  );
}

function Topbar({ onOpenSidebar }) {
  const pathname = usePathname();
  const params = useParams();
  const { workspaces, loaded } = useMockStore((state) => ({
    workspaces: state.workspaces || [],
    loaded: Boolean(state.loaded),
  }));

  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";
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
    if (pathname === "/dashboard/settings") {
      return [
        { label: "Dashboard", href: "/dashboard/workspaces" },
        { label: "Settings" },
      ];
    }
    if (pathname.startsWith("/dashboard/w/")) {
      const routeKey = pathname.split("/").filter(Boolean)[3] || "overview";
      const currentLabel =
        routeKey === "overview"
          ? "Overview"
          : WORKSPACE_ROUTE_LABELS[routeKey] || "Workspace";
      return [
        { label: "Dashboard", href: "/dashboard/workspaces" },
        {
          label: workspace?.name || "Workspace",
          href: `/dashboard/w/${workspaceId}`,
        },
        { label: currentLabel },
      ];
    }
    return [{ label: "Dashboard", href: "/dashboard/workspaces" }];
  }, [pathname, workspace?.name, workspaceId]);

  if (!loaded) {
    const isWorkspaceRoute = pathname.startsWith("/dashboard/w/");

    return (
      <div className="sticky top-0 z-30 bg-background animate-pulse">
        <header className="border-b border-border bg-background px-3 sm:px-4 lg:px-7">
          <div className="flex h-11 items-center justify-between gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 rounded-md bg-muted md:hidden" />
              <div className="flex min-w-0 items-center gap-1.5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-3 w-3 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-3 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`topbar-action-skeleton-${index}`}
                  className="h-8 w-8 rounded-lg bg-muted sm:h-9 sm:w-9"
                />
              ))}
            </div>
          </div>
        </header>

        {isWorkspaceRoute ? (
          <section className="border-b border-border/80 bg-background px-3 py-3 sm:px-4 md:px-6 lg:px-7">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3 lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-7 w-28 rounded bg-muted" />
                  <div className="h-4 w-3 rounded bg-muted" />
                  <div className="h-7 w-24 rounded bg-muted" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="h-9 w-28 rounded-lg bg-muted" />
                  <div className="h-9 w-24 rounded-lg bg-muted" />
                </div>
              </div>

              <div className="flex min-w-max items-center gap-1">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={`workspace-nav-skeleton-${index}`}
                    className="h-9 w-24 rounded-md bg-muted"
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 bg-background">
      <header className="border-b border-border bg-background px-3 sm:px-4 lg:px-7">
        <div className="flex h-11 items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className={cn(
                dashboardChromeButtonClasses,
                "shrink-0 rounded-md p-1.5 md:hidden",
              )}
            >
              <Menu className="size-4 sm:size-5" />
            </button>
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 items-center gap-1.5 text-[11px]"
              >
                {breadcrumb.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex min-w-0 items-center gap-1.5"
                  >
                    {index > 0 ? (
                      <span className="text-muted-foreground/45">/</span>
                    ) : null}
                    {item.href && index !== breadcrumb.length - 1 ? (
                      <Link
                        href={item.href}
                        className="truncate text-muted-foreground transition-colors hover:text-primary"
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

          <div className="flex shrink-0 items-center gap-2">
            <PlanBadge />
            <ThemeToggle />
            <GlobalTimerControl />
            <NotificationsMenu />
            <AvatarMenu />
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <WorkspaceToolbar />
      </Suspense>
    </div>
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

    toast.info(
      "Complete your profile to unlock a better dashboard experience.",
    );
    window.sessionStorage.setItem(key, "1");
  }, [loaded, currentUser]);

  return (
    <div className="dashboard-shell flex min-h-screen bg-base text-foreground">
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
