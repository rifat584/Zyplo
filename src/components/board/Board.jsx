"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Plus, Filter } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { loadDashboard } from "@/components/dashboard/mockStore";
import { Button } from "@/components/ui/button";
import {
  findColumnByStatus,
  getStatusFromColumnName,
  getTaskStatusLabel,
  normalizeStatusKey,
} from "@/components/dashboard/taskStatus";
import Column from "./Column";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

const toolbarFieldClasses =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 md:w-auto";
const toolbarSecondaryButtonClasses =
  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 md:w-auto";
const toolbarPopoverClasses =
  "absolute right-0 top-11 z-50 w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] space-y-3 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl";

// --- SMART BOARD SKELETON ---
function BoardSkeleton() {
  const columnTaskCounts = [3, 2, 4, 1]; // Creates a staggered, natural look

  return (
    <div className="animate-pulse space-y-4">
      {/* Filter Bar Skeleton */}
      <section className="mb-4 rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:min-w-0 md:flex-1 md:flex-row md:flex-wrap md:items-center">
            <div className="h-10 w-full rounded-lg bg-muted/80 md:w-56 lg:w-72 md:shrink-0"></div>
            <div className="h-10 w-full rounded-lg bg-muted/80 md:w-32"></div>
            <div className="h-10 w-full rounded-lg bg-muted/80 md:w-28"></div>
            <div className="h-10 w-full rounded-lg bg-muted/80 md:w-36"></div>
            <div className="h-10 w-full rounded-lg bg-muted/80 md:w-36"></div>
          </div>
          <div className="h-10 w-full rounded-lg bg-muted/80 md:w-32 md:shrink-0"></div>
        </div>
      </section>

      {/* Columns & Tasks Skeleton */}
      <section className="flex gap-3 overflow-x-hidden pb-2">
        {columnTaskCounts.map((taskCount, colIndex) => (
          <div
            key={colIndex}
            className="flex h-fit w-80 shrink-0 flex-col rounded-2xl border border-border bg-muted/40 p-3"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-muted"></div>
                <div className="h-5 w-24 rounded bg-muted"></div>
              </div>
              <div className="h-5 w-8 rounded-full bg-muted"></div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-2">
              {Array.from({ length: taskCount }).map((_, taskIndex) => (
                <div
                  key={taskIndex}
                  className="rounded-xl border border-border bg-card p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </div>
                  <div className="mb-4 h-3 w-1/2 rounded bg-muted"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-16 rounded bg-muted"></div>
                    <div className="h-6 w-6 rounded-full border-2 border-card bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function sortColumns(columns = []) {
  return [...columns].sort(
    (a, b) => Number(a.order || 0) - Number(b.order || 0),
  );
}

function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function toDateKey(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function normalizeColumns(columns = []) {
  return sortColumns(columns).map((column) => ({
    ...column,
    order: Number(column.order || 0),
    tasks: sortTasks(column.tasks || []).map((task, index) => ({
      ...task,
      columnId: column.id,
      order: index,
    })),
  }));
}

function normalizeBoardResponse(data) {
  return {
    board: data?.board || null,
    columns: normalizeColumns(data?.columns || []),
  };
}

function findTaskById(columns, taskId) {
  for (const column of columns || []) {
    const hit = (column.tasks || []).find((task) => task.id === taskId);
    if (hit) return hit;
  }
  return null;
}

function resolveDropDestination(columns, over) {
  const overData = over?.data?.current;
  if (!overData) return null;

  if (overData.type === "task") {
    const destinationColumn = columns.find(
      (column) => column.id === overData.columnId,
    );
    if (!destinationColumn) return null;
    const overIndex = (destinationColumn.tasks || []).findIndex(
      (task) => task.id === String(over.id),
    );
    return {
      destinationColumnId: destinationColumn.id,
      newOrder:
        overIndex >= 0 ? overIndex : (destinationColumn.tasks || []).length,
    };
  }

  if (overData.type === "column") {
    const destinationColumn = columns.find(
      (column) => column.id === overData.columnId,
    );
    if (!destinationColumn) return null;
    return {
      destinationColumnId: destinationColumn.id,
      newOrder: (destinationColumn.tasks || []).length,
    };
  }

  return null;
}

function moveTaskLocally(
  columns,
  { taskId, sourceColumnId, destinationColumnId, newOrder, statusToSet },
) {
  const nextColumns = normalizeColumns(columns).map((column) => ({
    ...column,
    tasks: [...(column.tasks || [])],
  }));

  const sourceColumn = nextColumns.find(
    (column) => column.id === sourceColumnId,
  );
  const destinationColumn = nextColumns.find(
    (column) => column.id === destinationColumnId,
  );

  if (!sourceColumn || !destinationColumn) return null;

  const sourceIndex = sourceColumn.tasks.findIndex(
    (task) => task.id === taskId,
  );
  if (sourceIndex < 0) return null;

  const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
  if (!movedTask) return null;

  const insertAt = Math.max(
    0,
    Math.min(Number(newOrder || 0), destinationColumn.tasks.length),
  );
  destinationColumn.tasks.splice(insertAt, 0, {
    ...movedTask,
    columnId: destinationColumnId,
    status: statusToSet || movedTask.status || "todo",
  });

  return nextColumns.map((column) => ({
    ...column,
    tasks: column.tasks.map((task, index) => ({
      ...task,
      order: index,
      columnId: column.id,
    })),
  }));
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

export default function Board({ workspaceId, projectId }) {
  const queryClient = useQueryClient();
  const boardQueryKey = useMemo(
    () => ["dashboard-board", projectId],
    [projectId],
  );

  async function refreshDashboardStore() {
    await loadDashboard({ force: true, silent: true });
  }

  const [activeTaskId, setActiveTaskId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState({
    taskName: "",
    status: "all",
    priority: "all",
    assigneeId: "all",
    reporter: "",
    updatedAt: "",
    createdAt: "",
    dueDate: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const boardQuery = useQuery({
    queryKey: boardQueryKey,
    queryFn: async () => {
      
      // 🛑 ADD THIS LINE TEMPORARILY TO TEST THE SKELETON
      // using for better skeleton
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const data = await fetchJson(`/api/dashboard/boards/${projectId}`);
      return normalizeBoardResponse(data);
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const membersQuery = useQuery({
    queryKey: ["dashboard-workspace-members", workspaceId],
    queryFn: () => 
      fetchJson("/api/dashboard/bootstrap", {
        headers: {
          "x-silent-fetch": "true" // <--- This hides it from the Global Loader!
        }
      }),
    select: (data) =>
      data?.workspaces?.find((workspace) => workspace.id === workspaceId)
        ?.members || [],
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (payload) => {
      const data = await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return data?.task;
    },
    onSuccess: async (task) => {
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current || !task) return current;
        const nextColumns = (current.columns || []).map((column) => {
          if (column.id !== task.columnId) return column;
          return { ...column, tasks: [...(column.tasks || []), task] };
        });
        return { ...current, columns: normalizeColumns(nextColumns) };
      });
      await refreshDashboardStore();
      setCreateOpen(false);
      toast.success("Task created");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to create task");
    },
  });

  const moveTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      sourceColumnId,
      destinationColumnId,
      newOrder,
      shouldSyncStatus,
      statusToSet,
    }) => {
      const moveData = await fetchJson(`/api/dashboard/tasks/${taskId}/move`, {
        method: "PATCH",
        body: JSON.stringify({ sourceColumnId, destinationColumnId, newOrder }),
      });

      let statusSyncError = null;

      if (shouldSyncStatus && statusToSet) {
        try {
          await fetchJson(`/api/dashboard/tasks/${taskId}`, {
            method: "PATCH",
            body: JSON.stringify({ status: statusToSet }),
          });
        } catch (error) {
          // Some backend variants return "Task not found" even when update succeeds.
          if (error?.message !== "Task not found") {
            statusSyncError = error;
          }
        }
      }

      return { moveData, statusSyncError };
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: boardQueryKey });
      const previous = queryClient.getQueryData(boardQueryKey);
      if (variables.optimisticData) {
        queryClient.setQueryData(boardQueryKey, variables.optimisticData);
      }
      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(boardQueryKey, context.previous);
      }
      toast.error(error?.message || "Failed to move task");
    },
    onSuccess: async (result) => {
      const data = result?.moveData;
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          columns: normalizeColumns(data?.columns || current.columns || []),
        };
      });
      await refreshDashboardStore();

      if (result?.statusSyncError) {
        toast.error(
          result.statusSyncError?.message ||
            "Task moved, but status sync failed",
        );
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, patch }) => {
      try {
        const data = await fetchJson(`/api/dashboard/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
        return data?.task || { id: taskId, ...patch };
      } catch (error) {
        if (error?.message === "Task not found") {
          return { id: taskId, ...patch };
        }
        throw error;
      }
    },
    onSuccess: async (updatedTask) => {
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current || !updatedTask?.id) return current;
        const nextColumns = (current.columns || []).map((column) => ({
          ...column,
          tasks: (column.tasks || []).map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task,
          ),
        }));
        return { ...current, columns: normalizeColumns(nextColumns) };
      });
      await refreshDashboardStore();
      toast.success("Task updated");
      setSelectedTaskId("");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update task");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await fetchJson(`/api/dashboard/tasks/${taskId}`, {
        method: "DELETE",
      });
      return taskId;
    },
    onSuccess: async (taskId) => {
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current) return current;
        const nextColumns = (current.columns || []).map((column) => ({
          ...column,
          tasks: (column.tasks || []).filter((task) => task.id !== taskId),
        }));
        return { ...current, columns: normalizeColumns(nextColumns) };
      });
      setSelectedTaskId("");
      await refreshDashboardStore();
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete task");
    },
  });

  const boardData = boardQuery.data || { board: null, columns: [] };
  const columns = boardData.columns || [];
  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: (column.tasks || []).filter((task) => {
        const byTaskName = columnFilters.taskName
          ? String(task.title || "")
              .toLowerCase()
              .includes(columnFilters.taskName.toLowerCase())
          : true;
        if (!byTaskName) return false;

        const byStatus =
          columnFilters.status === "all"
            ? true
            : normalizeStatusKey(task.status || "todo") ===
              normalizeStatusKey(columnFilters.status);
        if (!byStatus) return false;

        const byPriority =
          columnFilters.priority === "all"
            ? true
            : String(task.priority || "") === columnFilters.priority;
        if (!byPriority) return false;

        const byAssignee =
          columnFilters.assigneeId === "all"
            ? true
            : String(task.assigneeId || "") === columnFilters.assigneeId;
        if (!byAssignee) return false;

        const byReporter = columnFilters.reporter
          ? String(task.reporterName || "Unknown")
              .toLowerCase()
              .includes(columnFilters.reporter.toLowerCase())
          : true;
        if (!byReporter) return false;

        const byUpdatedAt = columnFilters.updatedAt
          ? toDateKey(task.updatedAt) === columnFilters.updatedAt
          : true;
        if (!byUpdatedAt) return false;

        const byCreatedAt = columnFilters.createdAt
          ? toDateKey(task.createdAt) === columnFilters.createdAt
          : true;
        if (!byCreatedAt) return false;

        const byDueDate = columnFilters.dueDate
          ? toDateKey(task.dueDate) === columnFilters.dueDate
          : true;

        return byDueDate;
      }),
    }));
  }, [columns, columnFilters]);
  const selectedColumn =
    columns.find((column) => column.id === selectedColumnId) ||
    columns[0] ||
    null;
  const activeTask = useMemo(
    () => findTaskById(columns, activeTaskId),
    [columns, activeTaskId],
  );
  const selectedTask = useMemo(
    () => findTaskById(columns, selectedTaskId),
    [columns, selectedTaskId],
  );

  function openCreateModal(columnId) {
    setSelectedColumnId(columnId || columns[0]?.id || "");
    setCreateOpen(true);
  }

  function openTaskDetails(task) {
    if (!task?.id) return;
    setSelectedTaskId(task.id);
  }

  function closeTaskDetails() {
    if (updateTaskMutation.isPending) return;
    setSelectedTaskId("");
  }

  function handleCreateTask(values) {
    if (!selectedColumn) return;
    const boardId = boardData?.board?.id;
    if (!boardId) return;
    const nextStatus = values.status || "todo";
    const destinationColumn = findColumnByStatus(columns, nextStatus);

    if (!destinationColumn?.id) {
      toast.error(
        `This board does not have an ${getTaskStatusLabel(nextStatus)} column.`,
      );
      return;
    }

    createTaskMutation.mutate({
      workspaceId,
      projectId,
      boardId,
      columnId: destinationColumn.id,
      title: values.title,
      description: values.description || "",
      assigneeId: values.assigneeId || "",
      dueDate: values.dueDate || "",
      priority: values.priority || "P2",
      status: nextStatus,
      attachments: values.attachments || [],
    });
  }

  function handleDragStart(event) {
    setActiveTaskId(String(event.active?.id || ""));
  }

  function handleDragEnd(event) {
    setActiveTaskId("");

    const { active, over } = event;
    if (!active || !over) return;

    const activeData = active.data?.current;
    if (activeData?.type !== "task") return;

    const current = queryClient.getQueryData(boardQueryKey);
    if (!current?.columns?.length) return;

    const sourceColumn = current.columns.find(
      (column) => column.id === activeData.columnId,
    );
    if (!sourceColumn) return;
    const movingTask = sourceColumn.tasks.find(
      (task) => task.id === String(active.id),
    );

    const drop = resolveDropDestination(current.columns, over);
    if (!drop) return;

    if (
      String(active.id) === String(over.id) &&
      activeData.columnId === drop.destinationColumnId
    ) {
      return;
    }

    const destinationColumnMeta = current.columns.find(
      (column) => column.id === drop.destinationColumnId,
    );
    const currentStatus = movingTask?.status || "todo";
    const nextStatus = getStatusFromColumnName(
      destinationColumnMeta?.name,
      currentStatus,
    );
    const shouldSyncStatus =
      activeData.columnId !== drop.destinationColumnId &&
      nextStatus !== currentStatus;

    const optimisticColumns = moveTaskLocally(current.columns, {
      taskId: String(active.id),
      sourceColumnId: activeData.columnId,
      destinationColumnId: drop.destinationColumnId,
      newOrder: drop.newOrder,
      statusToSet: nextStatus,
    });

    if (!optimisticColumns) return;

    const destinationColumn = optimisticColumns.find(
      (column) => column.id === drop.destinationColumnId,
    );
    const nextIndex =
      destinationColumn?.tasks?.findIndex(
        (task) => task.id === String(active.id),
      ) ?? drop.newOrder;

    moveTaskMutation.mutate({
      taskId: String(active.id),
      sourceColumnId: activeData.columnId,
      destinationColumnId: drop.destinationColumnId,
      newOrder: Math.max(0, nextIndex),
      shouldSyncStatus,
      statusToSet: nextStatus,
      optimisticData: {
        ...current,
        columns: optimisticColumns,
      },
    });
  }

  function handleDragCancel() {
    setActiveTaskId("");
  }

  async function handleTaskUpdate(values) {
    if (!selectedTask?.id) return;

    const members = membersQuery.data || [];
    const selectedMember = members.find(
      (member) => member.id === values.assigneeId,
    );
    const assigneeName = values.assigneeId
      ? selectedMember?.name || selectedTask.assigneeName || "Unassigned"
      : "Unassigned";

    const nextStatus = values.status || selectedTask.status || "todo";
    const sourceColumnId = selectedTask.columnId;
    const destinationColumn = findColumnByStatus(columns, nextStatus);
    const shouldMove =
      destinationColumn &&
      sourceColumnId &&
      destinationColumn.id !== sourceColumnId;

    if (shouldMove) {
      try {
        const moveData = await fetchJson(
          `/api/dashboard/tasks/${selectedTask.id}/move`,
          {
            method: "PATCH",
            body: JSON.stringify({
              sourceColumnId,
              destinationColumnId: destinationColumn.id,
              newOrder: (destinationColumn.tasks || []).length,
              status: nextStatus,
            }),
          },
        );

        queryClient.setQueryData(boardQueryKey, (current) => {
          if (!current) return current;
          return {
            ...current,
            columns: normalizeColumns(moveData?.columns || current.columns || []),
          };
        });
      } catch (error) {
        toast.error(error?.message || "Failed to move task");
        return;
      }
    }

    await updateTaskMutation.mutateAsync({
      taskId: selectedTask.id,
      patch: {
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: nextStatus,
        dueDate: values.dueDate,
        assigneeId: values.assigneeId,
        assigneeName,
        estimatedTime: values.estimatedTime,
        attachments: values.attachments || [],
      },
    });
  }

  async function handleTaskDelete() {
    if (!selectedTask?.id || deleteTaskMutation.isPending) return;
    const result = await Swal.fire({
      title: "Delete task?",
      text: `Delete "${selectedTask.title || "Untitled Task"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0f172a",
      color: "#e2e8f0",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
    });
    if (!result.isConfirmed) return;

    deleteTaskMutation.mutate(selectedTask.id);
  }

  // --- SHOW SKELETON ON LOAD ---
  if (boardQuery.isLoading) {
    return <BoardSkeleton />;
  }

  if (boardQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-500/30 dark:bg-rose-500/10">
        <p className="text-sm text-rose-700 dark:text-rose-300">
          {boardQuery.error?.message || "Failed to load board"}
        </p>
        <button
          type="button"
          onClick={() => boardQuery.refetch()}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="mb-4 rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:min-w-0 md:flex-1 md:flex-row md:flex-wrap md:items-center">
            <input
              type="text"
              value={columnFilters.taskName}
              onChange={(event) =>
                setColumnFilters((prev) => ({
                  ...prev,
                  taskName: event.target.value,
                }))
              }
              placeholder="Task Name"
              className={`${toolbarFieldClasses} md:w-56 lg:w-72 md:shrink-0`}
            />

            <select
              value={columnFilters.status}
              onChange={(event) =>
                setColumnFilters((prev) => ({
                  ...prev,
                  status: event.target.value,
                }))
              }
              className={`${toolbarFieldClasses} md:w-32`}
            >
              <option value="all">Status</option>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
            </select>

            <select
              value={columnFilters.priority}
              onChange={(event) =>
                setColumnFilters((prev) => ({
                  ...prev,
                  priority: event.target.value,
                }))
              }
              className={`${toolbarFieldClasses} md:w-28`}
            >
              <option value="all">Priority</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>

            <select
              value={columnFilters.assigneeId}
              onChange={(event) =>
                setColumnFilters((prev) => ({
                  ...prev,
                  assigneeId: event.target.value,
                }))
              }
              className={`${toolbarFieldClasses} md:w-36`}
            >
              <option value="all">Assignee</option>
              {(membersQuery.data || []).map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name || member.email || "Member"}
                </option>
              ))}
            </select>

            <div className="relative w-full md:w-auto md:shrink-0">
              <button
                type="button"
                onClick={() => setMoreFiltersOpen((prev) => !prev)}
                className={toolbarSecondaryButtonClasses}
              >
                <Filter className="size-4" />
                More filters
              </button>

              {moreFiltersOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreFiltersOpen(false)}
                  />
                  <div className={toolbarPopoverClasses}>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Reporter
                      </label>
                      <input
                        type="text"
                        value={columnFilters.reporter}
                        onChange={(event) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            reporter: event.target.value,
                          }))
                        }
                        placeholder="Filter by reporter"
                        className={`${toolbarFieldClasses} h-9 w-full md:w-full`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Updated At
                      </label>
                      <input
                        type="date"
                        value={columnFilters.updatedAt}
                        onChange={(event) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            updatedAt: event.target.value,
                          }))
                        }
                        className={`${toolbarFieldClasses} h-9 w-full md:w-full`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Created At
                      </label>
                      <input
                        type="date"
                        value={columnFilters.createdAt}
                        onChange={(event) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            createdAt: event.target.value,
                          }))
                        }
                        className={`${toolbarFieldClasses} h-9 w-full md:w-full`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={columnFilters.dueDate}
                        onChange={(event) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            dueDate: event.target.value,
                          }))
                        }
                        className={`${toolbarFieldClasses} h-9 w-full md:w-full`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => openCreateModal(columns[0]?.id || "")}
            disabled={!columns.length}
            className="w-full shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none md:w-auto md:shrink-0"
          >
            <Plus className="size-4" />
            Create Task
          </Button>
        </div>
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <section className="overflow-x-auto pb-2">
          <div className="flex min-w-full gap-3">
            {filteredColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onCreateTask={openCreateModal}
                onTaskClick={openTaskDetails}
                disabled={createTaskMutation.isPending}
              />
            ))}

            {!columns.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-400">
                No columns available for this board.
              </div>
            ) : null}
          </div>
        </section>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              columnId={activeTask.columnId}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTask}
        members={membersQuery.data || []}
        defaultStatus={
          getStatusFromColumnName(selectedColumn?.name, "todo") || "todo"
        }
        submitting={createTaskMutation.isPending}
      />

      <TaskDetailsModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        members={membersQuery.data || []}
        submitting={updateTaskMutation.isPending}
        deleting={deleteTaskMutation.isPending}
        onClose={closeTaskDetails}
        onSubmit={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </>
  );
}
