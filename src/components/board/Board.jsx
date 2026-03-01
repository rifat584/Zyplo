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
import { RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import Column from "./Column";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";

function sortColumns(columns = []) {
  return [...columns].sort(
    (a, b) => Number(a.order || 0) - Number(b.order || 0),
  );
}

function sortTasks(tasks = []) {
  return [...tasks].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function getStatusFromColumnName(columnName, fallback = "") {
  const normalized = String(columnName || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (normalized === "todo" || normalized === "backlog") return "todo";
  if (normalized === "inprogress" || normalized === "doing")
    return "inprogress";
  if (normalized === "inreview" || normalized === "review") return "inreview";
  if (normalized === "done" || normalized === "completed") return "done";
  return fallback;
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

  const [activeTaskId, setActiveTaskId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const boardQuery = useQuery({
    queryKey: boardQueryKey,
    queryFn: async () => {
      const data = await fetchJson(`/api/dashboard/boards/${projectId}`);
      return normalizeBoardResponse(data);
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const membersQuery = useQuery({
    queryKey: ["dashboard-workspace-members", workspaceId],
    queryFn: () => fetchJson("/api/dashboard/bootstrap"),
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
    onSuccess: (task) => {
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current || !task) return current;
        const nextColumns = (current.columns || []).map((column) => {
          if (column.id !== task.columnId) return column;
          return { ...column, tasks: [...(column.tasks || []), task] };
        });
        return { ...current, columns: normalizeColumns(nextColumns) };
      });
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
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
    onSuccess: (result) => {
      const data = result?.moveData;
      queryClient.setQueryData(boardQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          columns: normalizeColumns(data?.columns || current.columns || []),
        };
      });

      if (result?.statusSyncError) {
        toast.error(
          result.statusSyncError?.message ||
            "Task moved, but status sync failed",
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    },
  });

  const boardData = boardQuery.data || { board: null, columns: [] };
  const columns = boardData.columns || [];
  const selectedColumn =
    columns.find((column) => column.id === selectedColumnId) ||
    columns[0] ||
    null;
  const activeTask = useMemo(
    () => findTaskById(columns, activeTaskId),
    [columns, activeTaskId],
  );

  function openCreateModal(columnId) {
    setSelectedColumnId(columnId || columns[0]?.id || "");
    setCreateOpen(true);
  }

  function handleCreateTask(values) {
    if (!selectedColumn) return;
    const boardId = boardData?.board?.id;
    if (!boardId) return;

    createTaskMutation.mutate({
      workspaceId,
      projectId,
      boardId,
      columnId: selectedColumn.id,
      title: values.title,
      description: values.description || "",
      assigneeId: values.assigneeId || "",
      dueDate: values.dueDate || "",
      priority: values.priority || "P2",
      status: getStatusFromColumnName(selectedColumn.name, "todo") || "todo",
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

  if (boardQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Loading board...
        </p>
      </div>
    );
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
      <section className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project Board
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {boardData?.board?.name || "Kanban Board"}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(columns[0]?.id || "")}
          disabled={!columns.length}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          <Plus className="size-4" />
          Create Task
        </button>
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
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onCreateTask={openCreateModal}
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
        columnName={selectedColumn?.name || ""}
        submitting={createTaskMutation.isPending}
      />
    </>
  );
}
