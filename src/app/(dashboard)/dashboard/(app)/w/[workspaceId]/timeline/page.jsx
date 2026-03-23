"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import { useMockStore } from "@/components/dashboard/mockStore";
import { useWorkspaceProjectSelection } from "@/components/dashboard/projectSelection";
import { getTaskStatusLabel, normalizeStatusKey } from "@/components/dashboard/taskStatus";
import { cn } from "@/lib/utils";

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const STATUS_BADGE_STYLES = {
  todo: "border-border/80 bg-background text-muted-foreground",
  inprogress: "border-border/80 bg-background text-foreground",
  inreview: "border-border/80 bg-background text-foreground",
  done: "border-border/80 bg-background text-foreground",
};

const PRIORITY_BADGE_STYLES = {
  P0: "border-destructive/20 bg-destructive/10 text-destructive",
  P1: "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  P2: "border-border/80 bg-background text-muted-foreground",
  P3: "border-border/80 bg-background text-muted-foreground",
};

const SECTION_HELPERS = {
  overdue: "Due date passed",
  today: "Due today",
  upcoming: "Due later",
  unscheduled: "Tasks without a due date",
};

const neutralSectionCountClass = "text-muted-foreground";

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function hasExplicitTime(value) {
  return /T\d{2}:\d{2}| \d{2}:\d{2}/.test(String(value || ""));
}

function formatShortDate(value) {
  const date = toDate(value);
  if (!date) return "";
  return DATE_LABEL_FORMATTER.format(date);
}

function formatDueTime(value) {
  const date = toDate(value);
  if (!date || !hasExplicitTime(value)) return "";
  return TIME_FORMATTER.format(date);
}

function sortTasksByDueDate(tasks = []) {
  return [...tasks].sort((a, b) => {
    const first = toDate(a?.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
    const second = toDate(b?.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
    return first - second;
  });
}

function AgendaRow({ task, showNoDueDate = false }) {
  const status = normalizeStatusKey(task?.status || "todo") || "todo";
  const priority = String(task?.priority || "P2").toUpperCase();
  const dueTime = formatDueTime(task?.dueDate);
  const dueLabel = showNoDueDate || !task?.dueDate
    ? "No due date"
    : `${formatShortDate(task?.dueDate)}`;

  return (
    <article className="rounded-xl border border-border bg-card shadow-sm shadow-black/5 dark:shadow-none">
      <div className="flex flex-col gap-2.5 px-3 py-3 sm:grid sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3 sm:px-4">
        <div className="order-2 sm:order-0">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border/80 bg-background px-2 py-1 text-[11px] font-medium text-foreground">
            <CalendarDays className="size-3.5 text-muted-foreground" />
            {dueLabel}
          </span>
          {dueTime && !showNoDueDate ? (
            <p className="mt-1 text-[11px] text-muted-foreground">{dueTime}</p>
          ) : null}
        </div>

        <div className="order-1 min-w-0 sm:order-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {task?.title || "Untitled task"}
            </h3>
            {task?.taskRef ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {task.taskRef}
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" />
              {task?.assigneeName || "Unassigned"}
            </span>
            {task?.description ? (
              <span className="max-w-full truncate">{task.description}</span>
            ) : null}
          </div>
        </div>

        <div className="order-3 flex flex-wrap items-center gap-1.5 sm:justify-end">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-medium",
              STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.todo,
            )}
          >
            {getTaskStatusLabel(status)}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold uppercase",
              PRIORITY_BADGE_STYLES[priority] || PRIORITY_BADGE_STYLES.P2,
            )}
          >
            {priority}
          </span>
        </div>
      </div>
    </article>
  );
}

function AgendaSection({ sectionId, title, count, tasks }) {
  const helper = SECTION_HELPERS[sectionId];

  return (
    <section className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        </div>
        <span className={cn("shrink-0 pt-0.5 text-xs font-medium", neutralSectionCountClass)}>
          {count} {count === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <AgendaRow
            key={task.id}
            task={task}
            showNoDueDate={sectionId === "unscheduled"}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineLoadingState() {
  return (
    <section className="space-y-5">
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-2.5">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((__, rowIndex) => (
              <div
                key={rowIndex}
                className="rounded-xl border border-border bg-card px-3 py-3 shadow-sm shadow-black/5 dark:shadow-none sm:px-4"
              >
                <div className="grid gap-2.5 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3">
                  <div className="space-y-2">
                    <div className="h-6 w-24 animate-pulse rounded-md bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="flex gap-2 sm:justify-end">
                    <div className="h-6 w-16 animate-pulse rounded-md bg-muted" />
                    <div className="h-6 w-10 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background/40 px-4 py-10 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-secondary/45 text-foreground">
        <CalendarDays className="size-4.5" />
      </div>
      <h3 className="mt-3 font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function WorkspaceTimelinePage() {
  const params = useParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";

  const referenceNow = useMemo(() => new Date(), []);

  const { loaded, loading, tasks, projects } = useMockStore((state) => ({
    loaded: Boolean(state.loaded),
    loading: Boolean(state.loading),
    tasks: state.tasks || [],
    projects: state.projects || [],
  }));

  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId],
  );
  const { selectedProject, selectedProjectId } = useWorkspaceProjectSelection(
    workspaceId,
    workspaceProjects,
  );

  const projectTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.workspaceId !== workspaceId) return false;
      if (!selectedProjectId) return false;
      return String(task.projectId || "") === selectedProjectId;
    });
  }, [tasks, workspaceId, selectedProjectId]);

  const timelineData = useMemo(() => {
    const today = startOfDay(referenceNow);
    const overdue = [];
    const dueToday = [];
    const upcoming = [];
    const unscheduled = [];

    projectTasks.forEach((task) => {
      const dueDate = toDate(task?.dueDate);
      if (!dueDate) {
        unscheduled.push(task);
        return;
      }

      const dueDay = startOfDay(dueDate);
      if (dueDay.getTime() < today.getTime()) {
        overdue.push(task);
        return;
      }

      if (dueDay.getTime() === today.getTime()) {
        dueToday.push(task);
        return;
      }

      upcoming.push(task);
    });

    const unscheduledTasks = [...unscheduled].sort((a, b) =>
      String(a?.title || "").localeCompare(String(b?.title || "")),
    );

    return {
      overdueTasks: sortTasksByDueDate(overdue),
      todayTasks: sortTasksByDueDate(dueToday),
      upcomingTasks: sortTasksByDueDate(upcoming),
      unscheduledTasks: sortTasksByDueDate(unscheduledTasks),
    };
  }, [projectTasks, referenceNow]);

  const sections = useMemo(() => {
    return [
      {
        id: "overdue",
        title: "Overdue",
        count: timelineData.overdueTasks.length,
        groups: [],
        tasks: timelineData.overdueTasks,
      },
      {
        id: "today",
        title: "Today",
        count: timelineData.todayTasks.length,
        groups: [],
        tasks: timelineData.todayTasks,
      },
      {
        id: "upcoming",
        title: "Upcoming",
        count: timelineData.upcomingTasks.length,
        groups: [],
        tasks: timelineData.upcomingTasks,
      },
      {
        id: "unscheduled",
        title: "No due date",
        count: timelineData.unscheduledTasks.length,
        groups: [],
        tasks: timelineData.unscheduledTasks,
      },
    ].filter((section) => section.count > 0);
  }, [timelineData]);

  if (!workspaceId) {
    return (
      <section className="rounded-2xl border border-destructive/20 bg-destructive/3 p-4 text-sm text-destructive">
        Invalid workspace route.
      </section>
    );
  }

  if (!loaded || loading) {
    return <TimelineLoadingState />;
  }

  if (!workspaceProjects.length) {
    return (
      <section className="overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5">
        <EmptyState
          title="No project timeline yet"
          description="Create a project first, then due dates and planned work will appear here."
        />
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {sections.length ? (
        sections.map((section) => (
          <AgendaSection
            key={section.id}
            sectionId={section.id}
            title={section.title}
            count={section.count}
            tasks={section.tasks}
          />
        ))
      ) : (
        <div>
          <EmptyState
            title="No tasks on the timeline"
            description={`Tasks in ${selectedProject?.name || "this project"} will show up here once work is created and due dates are added.`}
          />
        </div>
      )}
    </section>
  );
}
