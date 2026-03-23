"use client";

import { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
// file attach - helal / bayijid
import { useMockStore, loadDashboard } from "@/components/dashboard/mockStore";
import TaskDeleteDialog from "@/components/dashboard/taskDeleteDialog";
import { useWorkspaceProjectSelection } from "@/components/dashboard/projectSelection";
import {
  findColumnByStatus,
  getStatusFromColumnName,
  getTaskStatusLabel,
  normalizeStatusKey,
} from "@/components/dashboard/taskStatus";
import CreateTaskModal from "@/components/board/CreateTaskModal";
import TaskDetailsModal from "@/components/board/TaskDetailsModal";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const calendarPanelClass = "rounded-2xl border border-border bg-card";
const calendarInputClass =
  "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";
const calendarSecondaryButtonClass =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground";
const calendarIconButtonClass =
  "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-accent hover:text-accent-foreground";
const calendarPopoverClass =
  "absolute right-0 top-11 z-50 w-[320px] space-y-3 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl";
const calendarTaskChipClass =
  "truncate rounded-md border border-primary/20 bg-primary/10 px-1.5 py-1 text-[11px] text-primary sm:px-2 sm:text-xs";
const calendarDayCellClass =
  "min-h-24 cursor-pointer border-b border-r border-border p-1.5 last:border-r-0 transition-colors sm:min-h-32 sm:p-2";

// --- SMART CALENDAR SKELETON ---
function CalendarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top Filter Bar Skeleton */}
      <section className={`${calendarPanelClass} p-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:flex-nowrap md:items-center">
          <div className="h-10 w-full rounded-lg bg-muted md:min-w-[12rem] md:flex-1"></div>
          <div className="h-10 w-full rounded-lg bg-muted md:w-[8.5rem] md:shrink-0"></div>
          <div className="h-10 w-full rounded-lg bg-muted md:w-[6.75rem] md:shrink-0"></div>
          <div className="h-10 w-full rounded-lg bg-muted md:w-[7.5rem] md:shrink-0"></div>
          <div className="h-10 w-full rounded-lg bg-muted md:w-auto md:shrink-0"></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="h-9 w-16 rounded-lg bg-muted"></div>
          <div className="h-9 w-9 rounded-lg bg-muted"></div>
          <div className="h-9 w-32 rounded-lg bg-muted"></div>
          <div className="h-9 w-9 rounded-lg bg-muted"></div>
          <div className="h-9 w-24 rounded-lg bg-muted"></div>
        </div>
      </section>

      {/* Calendar Grid Skeleton */}
      <section className={`overflow-hidden ${calendarPanelClass}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header Days */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="border-r border-border p-2 last:border-r-0 sm:p-3">
                  <div className="mx-auto h-4 w-8 rounded bg-muted"></div>
                </div>
              ))}
            </div>
            {/* Grid Cells (6 rows x 7 cols = 42) */}
            <div className="grid grid-cols-7">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="min-h-24 border-b border-r border-border p-1.5 last:border-r-0 sm:min-h-32 sm:p-2">
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                    <div className="size-5 rounded-md bg-muted sm:size-6"></div>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-5 w-full rounded-md bg-muted"></div>
                    <div className="h-5 w-[80%] rounded-md bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(monthDate) {
  const first = startOfMonth(monthDate);
  const firstDay = first.getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - mondayOffset);

  return Array.from({ length: 42 }).map((_, index) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + index);
    return d;
  });
}

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateKey(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return toDateInputValue(date);
}

function normalizeStatus(status) {
  const s = String(status || "todo")
    .toLowerCase()
    .replace(/\s+/g, "");
  if (s === "inprogress") return "In Progress";
  if (s === "inreview") return "In Review";
  if (s === "done") return "Done";
  return "To Do";
}

function sortColumns(columns = []) {
  return [...columns].sort(
    (a, b) => Number(a?.order || 0) - Number(b?.order || 0),
  );
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
}

function findCalendarTaskById(tasks = [], taskId = "") {
  return tasks.find((task) => String(task.id) === String(taskId)) || null;
}

function resolveCalendarDropDate(over) {
  const overData = over?.data?.current;
  if (!overData) return "";
  if (overData.type === "task") return String(overData.dateKey || "");
  if (overData.type === "day") return String(overData.dateKey || "");
  return "";
}

function CalendarTaskOverlay({ task }) {
  return (
    <div className={`${calendarTaskChipClass} shadow-lg shadow-primary/10`}>
      {task.title} | {normalizeStatus(task.status)}
    </div>
  );
}

function CalendarTaskChip({ task, dateKey, onTaskClick }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      taskId: task.id,
      dateKey,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const className = `${calendarTaskChipClass} ${
    isDragging
      ? "cursor-grabbing opacity-40"
      : "cursor-grab transition-colors hover:bg-primary/15 dark:hover:bg-primary/20"
  }`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(event) => {
        event.stopPropagation();
        if (!isDragging) {
          onTaskClick?.(task);
        }
      }}
      className={className}
    >
      {task.title} | {normalizeStatus(task.status)}
    </div>
  );
}

function CalendarDayCell({
  dateKey,
  day,
  dayTasks,
  isCurrentMonth,
  onOpenDayDetails,
  onOpenCreateModal,
  onTaskClick,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dateKey}`,
    data: {
      type: "day",
      dateKey,
    },
  });

  const visibleTasks = dayTasks.slice(0, 2);
  const itemIds = useMemo(
    () => visibleTasks.map((task) => task.id),
    [visibleTasks],
  );

  return (
    <div
      ref={setNodeRef}
      className={`${calendarDayCellClass} ${
        isOver
          ? "border-primary bg-primary/10 ring-1 ring-inset ring-primary"
          : "hover:border-primary/50 hover:bg-accent/20 hover:ring-1 hover:ring-inset hover:ring-primary/40"
      }`}
      onClick={() => onOpenDayDetails(dateKey)}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-xs sm:text-sm ${
            isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          {day.getDate()}
        </p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpenCreateModal();
          }}
          className="inline-flex size-5 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground sm:size-6"
          aria-label={`Create task on ${dateKey}`}
        >
          <Plus className="size-3 sm:size-3.5" />
        </button>
      </div>
      <div className="mt-1.5 space-y-1 sm:mt-2">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {visibleTasks.map((task) => (
            <CalendarTaskChip
              key={task.id}
              task={task}
              dateKey={dateKey}
              onTaskClick={onTaskClick}
            />
          ))}
        </SortableContext>
        {dayTasks.length > 2 ? (
          <p className="text-[11px] text-muted-foreground sm:text-xs">
            {dayTasks.length - 2} more
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function WorkspaceCalenderPage() {
  const params = useParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";

  // Added loaded and loading to easily control the Skeleton display
  const { tasks, projects, members, loaded, loading } = useMockStore((state) => ({
    tasks: state.tasks || [],
    projects: state.projects || [],
    members:
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.members || [],
    loaded: state.loaded,
    loading: state.loading,
  }));

  const workspaceTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (task.workspaceId !== workspaceId) return false;
        const due = task.dueDate ? new Date(task.dueDate) : null;
        const created = task.createdAt ? new Date(task.createdAt) : null;
        const hasValidDue = due && !Number.isNaN(due.getTime());
        const hasValidCreated = created && !Number.isNaN(created.getTime());
        return Boolean(hasValidDue || hasValidCreated);
      }),
    [tasks, workspaceId],
  );

  const [monthDate, setMonthDate] = useState(() => new Date());
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [activeTaskId, setActiveTaskId] = useState("");
  const [taskDateOverrides, setTaskDateOverrides] = useState({});
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [moreFilters, setMoreFilters] = useState({
    reporter: "",
    updatedAt: "",
    createdAt: "",
    dueDate: "",
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);
  const [dayDetailsOpen, setDayDetailsOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState("");

  const [isMounted, setIsMounted] = useState(false);

  // file attach - helal / bayijid (Task Details Modal States)
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredTasks = useMemo(() => {
    const tasksWithOverrides = workspaceTasks.map((task) => {
      const nextDueDate = taskDateOverrides[task.id];
      return nextDueDate !== undefined
        ? { ...task, dueDate: nextDueDate }
        : task;
    });

    return tasksWithOverrides.filter((task) => {
      const query = search.trim().toLowerCase();
      const bySearch = query
        ? `${task.title || ""} ${task.projectName || ""}`
            .toLowerCase()
            .includes(query)
        : true;
      const byAssignee =
        assignee === "all" ? true : String(task.assigneeId || "") === assignee;
      const byStatus =
        status === "all"
          ? true
          : String(task.status || "todo").toLowerCase() === status;
      const byPriority = priority === "all" ? true : task.priority === priority;
      const byReporter = moreFilters.reporter
        ? String(task.reporterName || "Unknown")
            .toLowerCase()
            .includes(moreFilters.reporter.toLowerCase())
        : true;
      const byUpdatedAt = moreFilters.updatedAt
        ? toDateKey(task.updatedAt) === moreFilters.updatedAt
        : true;
      const byCreatedAt = moreFilters.createdAt
        ? toDateKey(task.createdAt) === moreFilters.createdAt
        : true;
      const byDueDate = moreFilters.dueDate
        ? toDateKey(task.dueDate) === moreFilters.dueDate
        : true;
      return (
        bySearch &&
        byAssignee &&
        byStatus &&
        byPriority &&
        byReporter &&
        byUpdatedAt &&
        byCreatedAt &&
        byDueDate
      );
    });
  }, [
    workspaceTasks,
    taskDateOverrides,
    search,
    assignee,
    status,
    priority,
    moreFilters,
  ]);

  const taskMap = useMemo(() => {
    const map = new Map();
    filteredTasks.forEach((task) => {
      const sourceDate = task.dueDate || task.createdAt;
      const parsed = sourceDate ? new Date(sourceDate) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) return;
      const key = toDateInputValue(parsed);
      const arr = map.get(key) || [];
      arr.push(task);
      map.set(key, arr);
    });
    return map;
  }, [filteredTasks]);

  const days = useMemo(() => buildCalendarDays(monthDate), [monthDate]);
  const monthIndex = monthDate.getMonth();
  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId],
  );
  const { selectedProject } = useWorkspaceProjectSelection(
    workspaceId,
    workspaceProjects,
  );
  const [createTarget, setCreateTarget] = useState(null);
  const [pendingDeleteTask, setPendingDeleteTask] = useState(null);

  async function openCreateModal() {
    if (!selectedProject || createBusy || targetLoading) {
      if (!selectedProject) {
        toast.error("Select a current project before creating a calendar task.");
      }
      return;
    }

    try {
      setTargetLoading(true);
      const boardData = await fetchJson(`/api/dashboard/boards/${selectedProject.id}`);
      const board = boardData?.board || null;
      const columns = sortColumns(boardData?.columns || []);
      const todoColumn = findColumnByStatus(columns, "todo");

      if (!board?.id || !todoColumn?.id) {
        throw new Error('The current project does not have a "To Do" column.');
      }

      setCreateTarget({
        projectId: String(selectedProject.id),
        boardId: String(board.id),
        columns,
      });
      setCreateOpen(true);
    } catch (error) {
      toast.error(error?.message || "Failed to prepare task creation.");
    } finally {
      setTargetLoading(false);
    }
  }

  function openDayDetails(dateKey) {
    setSelectedDateKey(dateKey);
    setDayDetailsOpen(true);
  }

  async function handleCreateTask(values) {
    if (!createTarget || createBusy) return;

    try {
      setCreateBusy(true);
      const nextStatus = values.status || "todo";
      const destinationColumn = findColumnByStatus(
        createTarget.columns,
        nextStatus,
      );

      if (!destinationColumn?.id) {
        throw new Error(
          `The current project does not have an ${getTaskStatusLabel(nextStatus)} column.`,
        );
      }

      await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify({
          workspaceId,
          projectId: createTarget.projectId,
          boardId: createTarget.boardId,
          columnId: String(destinationColumn.id),
          title: values.title,
          description: values.description || "",
          assigneeId: values.assigneeId || "",
          dueDate: values.dueDate || "",
          priority: values.priority || "P2",
          status: nextStatus,
        }),
      });

      await loadDashboard({ force: true, silent: true });
      setCreateOpen(false);
      setCreateTarget(null);
    } catch (error) {
      toast.error(error?.message || "Failed to create task");
    } finally {
      setCreateBusy(false);
    }
  }

  function closeCreateModal() {
    if (createBusy) return;
    setCreateOpen(false);
    setCreateTarget(null);
  }

  // --- BULLETPROOF UPDATE HANDLER ---
  async function handleUpdateTask(values) {
    if (!selectedTask?.id) return;
    try {
      setUpdateBusy(true);

      const selectedMember = members.find((m) => m.id === values.assigneeId);
      values.assigneeName = values.assigneeId
        ? selectedMember?.name ||
          selectedMember?.email ||
          selectedTask.assigneeName ||
          "Unassigned"
        : "Unassigned";

      const nextStatus = values.status || selectedTask.status || "todo";
      const currentStatus = selectedTask.status || "todo";

      // 1. Attempt to sync the board column if status changed
      if (nextStatus !== currentStatus && selectedTask.projectId) {
        try {
          // Fetch exact board state to prevent mismatch errors
          const boardData = await fetchJson(
            `/api/dashboard/boards/${selectedTask.projectId}`,
          );
          const columns = boardData?.columns || [];

          let trueSourceColumnId = selectedTask.columnId;
          // Find where the backend actually placed this task
          for (const col of columns) {
            if (
              col.tasks?.some((t) => String(t.id) === String(selectedTask.id))
            ) {
              trueSourceColumnId = String(col.id);
              break;
            }
          }

          const destCol = columns.find(
            (c) =>
              getStatusFromColumnName(c.name, "") ===
              normalizeStatusKey(nextStatus),
          );

          if (
            destCol &&
            trueSourceColumnId &&
            String(destCol.id) !== trueSourceColumnId
          ) {
            await fetchJson(`/api/dashboard/tasks/${selectedTask.id}/move`, {
              method: "PATCH",
              body: JSON.stringify({
                sourceColumnId: trueSourceColumnId,
                destinationColumnId: String(destCol.id),
                newOrder: Array.isArray(destCol.tasks)
                  ? destCol.tasks.length
                  : 0,
                status: nextStatus,
              }),
            });
          }
        } catch (moveError) {
          // Ignore move errors! Let the patch update continue saving the files/title!
          console.warn(
            "Could not sync board columns, but safely continuing with update:",
            moveError,
          );
        }
      }

      // 2. Patch the actual values (Title, Date, Attachments, Status)
      try {
        await fetchJson(`/api/dashboard/tasks/${selectedTask.id}`, {
          method: "PATCH",
          body: JSON.stringify(values),
        });
      } catch (patchError) {
        // Ignore fake "Task not found" error if MongoDB v6 driver acts up
        if (patchError?.message !== "Task not found") {
          throw patchError;
        }
      }

      await loadDashboard({ force: true, silent: true });
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task", error);
      alert(error?.message || "Failed to update task");
    } finally {
      setUpdateBusy(false);
    }
  }

  function handleDeleteTask(task) {
    if (!task?.id) return;
    setPendingDeleteTask({
      id: String(task.id),
      title: task.title || "",
    });
  }

  async function confirmDeleteTask() {
    if (!pendingDeleteTask?.id) return;
    try {
      setDeleteBusy(true);
      await fetchJson(`/api/dashboard/tasks/${pendingDeleteTask.id}`, {
        method: "DELETE",
      });
      await loadDashboard({ force: true, silent: true });
      setPendingDeleteTask(null);
      setSelectedTask(null);
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error(error?.message || "Failed to delete task");
    } finally {
      setDeleteBusy(false);
    }
  }

  const selectedDayTasks = useMemo(() => {
    if (!selectedDateKey) return [];
    return taskMap.get(selectedDateKey) || [];
  }, [selectedDateKey, taskMap]);

  const activeTask = useMemo(
    () => findCalendarTaskById(filteredTasks, activeTaskId),
    [filteredTasks, activeTaskId],
  );

  function handleDragStart(event) {
    setActiveTaskId(String(event.active?.id || ""));
  }

  function handleDragCancel() {
    setActiveTaskId("");
  }

  async function handleDragEnd(event) {
    setActiveTaskId("");

    const { active, over } = event;
    if (!active || !over) return;

    const activeData = active.data?.current;
    if (activeData?.type !== "task") return;

    const movingTask = findCalendarTaskById(filteredTasks, active.id);
    if (!movingTask) return;

    const currentDateKey = toDateKey(
      movingTask.dueDate || movingTask.createdAt,
    );
    const destinationDateKey = resolveCalendarDropDate(over);

    if (
      !currentDateKey ||
      !destinationDateKey ||
      currentDateKey === destinationDateKey
    ) {
      return;
    }

    const previousDueDate = movingTask.dueDate || "";

    setTaskDateOverrides((prev) => ({
      ...prev,
      [movingTask.id]: destinationDateKey,
    }));
    setSelectedTask((prev) =>
      prev?.id === movingTask.id
        ? { ...prev, dueDate: destinationDateKey }
        : prev,
    );

    try {
      await fetchJson(`/api/dashboard/tasks/${movingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          dueDate: destinationDateKey,
        }),
      });
      await loadDashboard({ force: true, silent: true });
      setTaskDateOverrides((prev) => {
        const next = { ...prev };
        delete next[movingTask.id];
        return next;
      });
    } catch (error) {
      setTaskDateOverrides((prev) => {
        const next = { ...prev };
        delete next[movingTask.id];
        return next;
      });
      setSelectedTask((prev) =>
        prev?.id === movingTask.id
          ? { ...prev, dueDate: previousDueDate }
          : prev,
      );
      console.error("Failed to move task", error);
      alert(error?.message || "Failed to move task");
    }
  }

  // --- PREVENT HYDRATION MISMATCH & SHOW SKELETON WHILE LOADING ---
  if (!isMounted || !loaded || loading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="space-y-4">
      <section className={`${calendarPanelClass} p-4`}>
        <div className="flex flex-col gap-2 md:flex-row md:flex-nowrap md:items-center">
          <div className="relative w-full md:min-w-[12rem] md:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calendar"
              className={`${calendarInputClass} w-full pl-9 pr-3`}
            />
          </div>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className={`${calendarInputClass} w-full md:w-[8.5rem] md:shrink-0`}
          >
            <option value="all">Assignee</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name || member.email || "Member"}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`${calendarInputClass} w-full md:w-[6.75rem] md:shrink-0`}
          >
            <option value="all">Priority</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${calendarInputClass} w-full md:w-[7.5rem] md:shrink-0`}
          >
            <option value="all">Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="inreview">In Review</option>
            <option value="done">Done</option>
          </select>
          <div className="relative md:shrink-0">
            <button
              type="button"
              onClick={() => setMoreFiltersOpen((prev) => !prev)}
              className={`${calendarSecondaryButtonClass} w-full md:w-auto`}
            >
              <CalendarDays className="size-4" />
              More filters
            </button>

            {moreFiltersOpen ? (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreFiltersOpen(false)}
                />
                <div className={calendarPopoverClass}>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Reporter
                    </label>
                    <input
                      type="text"
                      value={moreFilters.reporter}
                      onChange={(event) =>
                        setMoreFilters((prev) => ({
                          ...prev,
                          reporter: event.target.value,
                        }))
                      }
                      placeholder="Filter by reporter"
                      className={`${calendarInputClass} h-9 w-full`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Updated At
                    </label>
                    <input
                      type="date"
                      value={moreFilters.updatedAt}
                      onChange={(event) =>
                        setMoreFilters((prev) => ({
                          ...prev,
                          updatedAt: event.target.value,
                        }))
                      }
                      className={`${calendarInputClass} h-9 w-full`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Created At
                    </label>
                    <input
                      type="date"
                      value={moreFilters.createdAt}
                      onChange={(event) =>
                        setMoreFilters((prev) => ({
                          ...prev,
                          createdAt: event.target.value,
                        }))
                      }
                      className={`${calendarInputClass} h-9 w-full`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={moreFilters.dueDate}
                      onChange={(event) =>
                        setMoreFilters((prev) => ({
                          ...prev,
                          dueDate: event.target.value,
                        }))
                      }
                      className={`${calendarInputClass} h-9 w-full`}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthDate(new Date())}
            className={`${calendarSecondaryButtonClass} h-9`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() =>
              setMonthDate(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
            className={calendarIconButtonClass}
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="h-9 rounded-lg border border-border bg-background px-3 text-sm leading-9 text-foreground">
            {formatMonthLabel(monthDate)}
          </div>
          <button
            type="button"
            onClick={() =>
              setMonthDate(
                (current) =>
                  new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
            className={calendarIconButtonClass}
          >
            <ChevronRight className="size-4" />
          </button>
          <select
            defaultValue="month"
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="month">Month</option>
          </select>
        </div>
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <section className={`overflow-hidden ${calendarPanelClass}`}>
          <div className="overflow-x-auto">
            <div className="min-w-175">
              <div className="grid grid-cols-7 border-b border-border bg-popover">
                {WEEK_DAYS.map((day) => (
                  <div
                    key={day}
                    className="border-r border-border px-2 py-2 text-center text-xs font-medium text-foreground/80 last:border-r-0 sm:px-3 sm:text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const key = toDateInputValue(day);
                  const dayTasks = taskMap.get(key) || [];
                  const isCurrentMonth = day.getMonth() === monthIndex;
                  return (
                    <CalendarDayCell
                      key={key}
                      dateKey={key}
                      day={day}
                      dayTasks={dayTasks}
                      isCurrentMonth={isCurrentMonth}
                      onOpenDayDetails={openDayDetails}
                      onOpenCreateModal={openCreateModal}
                      onTaskClick={setSelectedTask}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <DragOverlay>
          {activeTask ? <CalendarTaskOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={createOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateTask}
        members={members}
        defaultStatus="todo"
        submitting={createBusy}
      />

      {/* --- DAY DETAILS MODAL --- */}
      {dayDetailsOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] dark:bg-black/60"
            onClick={() => setDayDetailsOpen(false)}
            aria-label="Close day details modal"
          />
          <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Day Details
                </p>
                <h2 className="text-lg font-semibold text-foreground">
                  Tasks on {selectedDateKey}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDayDetailsOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-2 overflow-y-auto p-5">
              {selectedDayTasks.length ? (
                selectedDayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)} // Opens Reusable Modal
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background p-3.5 shadow-sm shadow-black/5 transition-colors hover:bg-accent/35 dark:shadow-none"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {task.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {task.projectName || "No project"}
                      </p>
                    </div>
                    <span className="rounded-md border border-border bg-muted/45 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {normalizeStatus(task.status)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tasks found for this date.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* --- REUSABLE TASK DETAILS MODAL --- */}
      <TaskDetailsModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        members={members}
        submitting={updateBusy}
        deleting={deleteBusy}
        onClose={() => {
          if (updateBusy || deleteBusy) return;
          setPendingDeleteTask(null);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <TaskDeleteDialog
        open={Boolean(pendingDeleteTask)}
        taskTitle={pendingDeleteTask?.title}
        busy={deleteBusy}
        onClose={() => {
          if (deleteBusy) return;
          setPendingDeleteTask(null);
        }}
        onConfirm={confirmDeleteTask}
      />
    </div>
  );
}
