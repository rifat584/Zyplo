"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useRef } from "react";
import { useMockStore, loadDashboard } from "@/components/dashboard/mockStore";
import CreateTaskLauncher from "@/components/dashboard/CreateTaskLauncher";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Calendar,
  Eye,
  Search,
  Filter,
  Trash2,
  UserPlus,
  X,
  Check,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const STATUSES = [
  { value: "todo", label: "Todo", icon: Circle, color: "text-slate-500" },
  {
    value: "inprogress",
    label: "In Progress",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    value: "inreview",
    label: "In Review",
    icon: Eye,
    color: "text-purple-500",
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
];

const PRIORITIES = [
  {
    value: "P1",
    label: "Urgent",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  {
    value: "P2",
    label: "High",
    icon: ArrowUp,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-500/10",
  },
  {
    value: "P3",
    label: "Medium",
    icon: ArrowRight,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
  },
  {
    value: "P4",
    label: "Low",
    icon: ArrowDown,
    color: "text-slate-500",
    bg: "bg-slate-50 dark:bg-slate-500/10",
  },
];

const normalizeStatusKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const getStatusFromColumnName = (columnName, fallback = "") => {
  const normalized = normalizeStatusKey(columnName);

  if (normalized === "todo" || normalized === "backlog") return "todo";
  if (normalized === "inprogress" || normalized === "doing")
    return "inprogress";
  if (normalized === "inreview" || normalized === "review") return "inreview";
  if (normalized === "done" || normalized === "completed") return "done";
  return normalizeStatusKey(fallback);
};

const findColumnByStatus = (columns = [], status = "") => {
  const target = normalizeStatusKey(status);
  if (!target) return null;
  return (
    columns.find(
      (column) =>
        normalizeStatusKey(getStatusFromColumnName(column.name, "")) === target,
    ) || null
  );
};

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

export default function TaskListView() {
  const params = useParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { allTasks, workspaceMembers } = useMockStore((state) => ({
    allTasks: state.tasks || [],
    workspaceMembers:
      (state.workspaces || []).find((workspace) => workspace.id === workspaceId)
        ?.members || [],
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // NEW: State to track which bulk action menu is open
  const [bulkDropdown, setBulkDropdown] = useState(null); 

  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    status: true,
    priority: true,
    assignee: true,
    reporter: true,
    updated: true,
    dueDate: true,
    createdAt: true,
  });

  const [localEdits, setLocalEdits] = useState({});
  const boardColumnsCacheRef = useRef(new Map());
  const [inlineEdit, setInlineEdit] = useState(null);

  const workspaceTasks = allTasks.filter((t) => t.workspaceId === workspaceId);

  const filteredTasks = useMemo(() => {
    return workspaceTasks
      .map((t) => ({ ...t, ...(localEdits[t.id] || {}) }))
      .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [workspaceTasks, searchQuery, localEdits]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleColumn = (col) => {
    setVisibleCols((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const rollbackLocalPatch = (taskId, patch) => {
    const keys = Object.keys(patch || {});
    if (!keys.length) return;

    setLocalEdits((prev) => {
      const current = { ...(prev[taskId] || {}) };
      keys.forEach((key) => delete current[key]);

      if (!Object.keys(current).length) {
        const { [taskId]: _omit, ...rest } = prev;
        return rest;
      }

      return { ...prev, [taskId]: current };
    });
  };

  const handleInlinePatch = async (task, patch) => {
    const taskId = String(task?.id || "");
    if (!taskId) return;

    const nextPatch = Object.entries(patch || {}).reduce(
      (acc, [key, value]) => {
        const currentValue = String(task?.[key] || "");
        const nextValue = String(value || "");
        if (currentValue !== nextValue) acc[key] = value;
        return acc;
      },
      {},
    );

    if (!Object.keys(nextPatch).length) {
      setActiveDropdown(null);
      return;
    }
    const updatedAt = new Date().toISOString();
    const patchWithUpdatedAt = { ...nextPatch, updatedAt };

    setLocalEdits((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        ...patchWithUpdatedAt,
      },
    }));
    setActiveDropdown(null);

    try {
      if (typeof nextPatch.status === "string") {
        const projectId = String(task?.projectId || "");
        const sourceColumnId = String(task?.columnId || "");

        if (projectId && sourceColumnId) {
          let columns = boardColumnsCacheRef.current.get(projectId);
          if (!columns) {
            const boardData = await fetchJson(
              `/api/dashboard/boards/${projectId}`,
            );
            columns = boardData?.columns || [];
            boardColumnsCacheRef.current.set(projectId, columns);
          }

          const destinationColumn = findColumnByStatus(columns, nextPatch.status);
          if (
            destinationColumn?.id &&
            String(destinationColumn.id) !== sourceColumnId
          ) {
            const moveData = await fetchJson(
              `/api/dashboard/tasks/${taskId}/move`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  sourceColumnId,
                  destinationColumnId: String(destinationColumn.id),
                  newOrder: Array.isArray(destinationColumn.tasks)
                    ? destinationColumn.tasks.length
                    : 0,
                  status: nextPatch.status,
                }),
              },
            );

            if (Array.isArray(moveData?.columns)) {
              boardColumnsCacheRef.current.set(projectId, moveData.columns);
            }
          }
        }
      }

      try {
        await fetchJson(`/api/dashboard/tasks/${taskId}`, {
          method: "PATCH",
          body: JSON.stringify(patchWithUpdatedAt),
        });
      } catch (error) {
        if (error?.message !== "Task not found") {
          throw error;
        }
      }
      loadDashboard({ force: true }).catch(() => {});
    } catch (err) {
      console.error("Failed to update task", err);
      rollbackLocalPatch(taskId, patchWithUpdatedAt);
    }
  };

  const handleInlineEdit = async (task, field, value) => {
    await handleInlinePatch(task, { [field]: value });
  };

  const openInlineEdit = (task, field, value = "") => {
    setActiveDropdown(null);
    setInlineEdit({
      taskId: String(task?.id || ""),
      field,
      value: String(value || ""),
    });
  };

  const commitInlineEdit = async (task) => {
    if (!inlineEdit || String(task?.id || "") !== inlineEdit.taskId) return;

    const { field, value } = inlineEdit;
    setInlineEdit(null);

    if (field === "title") {
      const nextTitle = String(value || "").trim();
      if (!nextTitle) return;
      await handleInlinePatch(task, { title: nextTitle });
      return;
    }

    if (field === "dueDate") {
      await handleInlinePatch(task, { dueDate: String(value || "") });
    }
  };

  // --- NEW: Bulk Handlers ---
  const handleBulkStatus = async (statusValue) => {
    setBulkDropdown(null);
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set()); // Clear selection instantly for snappy UI
    
    // Process them sequentially to reuse your existing perfect logic
    for (const id of ids) {
      const task = workspaceTasks.find((t) => t.id === id);
      if (task) {
        await handleInlinePatch(task, { status: statusValue });
      }
    }
  };

  const handleBulkAssign = async (assigneeId, assigneeName) => {
    setBulkDropdown(null);
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set()); // Clear selection instantly for snappy UI
    
    for (const id of ids) {
      const task = workspaceTasks.find((t) => t.id === id);
      if (task) {
        await handleInlinePatch(task, { assigneeId, assigneeName });
      }
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0B0F19] overflow-hidden min-h-150">
      <div className="flex flex-col border-b border-slate-200 dark:border-white/10">
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            All Tasks
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {workspaceTasks.length} tasks in this workspace
          </p>
        </div>

        <div className="flex flex-col gap-4 bg-slate-50/50 p-4 dark:bg-slate-800/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Live Search */}
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#050505] dark:text-white dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* === DISPLAY TOGGLE BUTTON === */}
            <div className="relative">
              <button
                onClick={() => setDisplayMenuOpen(!displayMenuOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Filter size={16} /> Display
              </button>

              {/* Display Dropdown */}
              {displayMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDisplayMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Visible Columns
                    </p>
                    {Object.keys(visibleCols).map((col) => (
                      <button
                        key={col}
                        onClick={() => toggleColumn(col)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 capitalize"
                      >
                        {col.replace(/([A-Z])/g, " $1").trim()}
                        {visibleCols[col] && (
                          <Check size={14} className="text-indigo-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <CreateTaskLauncher
              workspaceId={workspaceId}
              buttonClassName="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              label="Create Task"
            />
          </div>
        </div>
      </div>

      {/* === INTERACTIVE DATA GRID === */}
      <div className="overflow-x-auto pb-32 min-h-100">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium w-10">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.size > 0 &&
                    selectedIds.size === filteredTasks.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900"
                />
              </th>
              <th className="px-4 py-3 font-medium">Task Name</th>
              {visibleCols.status && (
                <th className="px-4 py-3 font-medium">Status</th>
              )}
              {visibleCols.priority && (
                <th className="px-4 py-3 font-medium">Priority</th>
              )}
              {visibleCols.assignee && (
                <th className="px-4 py-3 font-medium">Assignee</th>
              )}
              {visibleCols.reporter && (
                <th className="px-4 py-3 font-medium">Reporter</th>
              )}
              {visibleCols.updated && (
                <th className="px-4 py-3 font-medium">Updated</th>
              )}
              {visibleCols.createdAt && (
                <th className="px-4 py-3 font-medium">Created At</th>
              )}
              {visibleCols.dueDate && (
                <th className="px-4 py-3 font-medium">Due Date</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {filteredTasks.map((task) => {
              const rawStatus = (task.status || "todo")
                .toLowerCase()
                .replace(/\s+/g, "");
              const currentStatus =
                STATUSES.find((s) => s.value === rawStatus) || STATUSES[0];
              const currentPriority =
                PRIORITIES.find((p) => p.value === task.priority) ||
                PRIORITIES[2];

              return (
                <tr
                  key={task.id}
                  className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selectedIds.has(task.id) ? "bg-indigo-50/50 dark:bg-indigo-500/10" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(task.id)}
                      onChange={() => toggleSelect(task.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900"
                    />
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {inlineEdit?.taskId === task.id &&
                    inlineEdit?.field === "title" ? (
                      <input
                        autoFocus
                        value={inlineEdit.value}
                        onChange={(event) =>
                          setInlineEdit((prev) =>
                            prev
                              ? { ...prev, value: event.target.value }
                              : prev,
                          )
                        }
                        onBlur={() => commitInlineEdit(task)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            commitInlineEdit(task);
                          }
                          if (event.key === "Escape") {
                            setInlineEdit(null);
                          }
                        }}
                        className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openInlineEdit(task, "title", task.title)}
                        className="w-full text-left hover:underline"
                      >
                        {task.title}
                      </button>
                    )}
                    {task.projectName && (
                      <div className="mt-0.5 text-xs font-normal text-slate-500">
                        {task.projectName}
                      </div>
                    )}
                  </td>

                  {/* INLINE EDIT: Status */}
                  {visibleCols.status && (
                    <td className="px-4 py-4 relative">
                      {activeDropdown === `status-${task.id}` && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                      )}
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === `status-${task.id}`
                              ? null
                              : `status-${task.id}`,
                          )
                        }
                        className="flex items-center gap-2 rounded-md px-2 py-1 -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative z-20"
                      >
                        <currentStatus.icon
                          size={14}
                          className={currentStatus.color}
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {currentStatus.label}
                        </span>
                      </button>

                      {activeDropdown === `status-${task.id}` && (
                        <div className="absolute top-10 left-4 z-30 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          {STATUSES.map((s) => (
                            <button
                              key={s.value}
                              onClick={() =>
                                handleInlineEdit(task, "status", s.value)
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <s.icon size={14} className={s.color} />
                              <span className="text-slate-700 dark:text-slate-300">
                                {s.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* INLINE EDIT: Priority */}
                  {visibleCols.priority && (
                    <td className="px-4 py-4 relative">
                      {activeDropdown === `priority-${task.id}` && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                      )}
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === `priority-${task.id}`
                              ? null
                              : `priority-${task.id}`,
                          )
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:brightness-95 relative z-20 ${currentPriority.bg} ${currentPriority.color}`}
                      >
                        <currentPriority.icon size={12} />
                        {currentPriority.label}
                      </button>

                      {activeDropdown === `priority-${task.id}` && (
                        <div className="absolute top-10 left-4 z-30 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          {PRIORITIES.map((p) => (
                            <button
                              key={p.value}
                              onClick={() =>
                                handleInlineEdit(task, "priority", p.value)
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <p.icon size={14} className={p.color} />
                              <span className="text-slate-700 dark:text-slate-300">
                                {p.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Assignee */}
                  {visibleCols.assignee && (
                    <td className="px-4 py-4 relative">
                      {activeDropdown === `assignee-${task.id}` && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveDropdown(null)}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === `assignee-${task.id}`
                              ? null
                              : `assignee-${task.id}`,
                          )
                        }
                        className="relative z-20 flex w-full items-center gap-2 rounded-md px-2 py-1 -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                          {task.assigneeName
                            ? task.assigneeName.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <span className="truncate max-w-25">
                          {task.assigneeName || "Unassigned"}
                        </span>
                      </button>

                      {activeDropdown === `assignee-${task.id}` && (
                        <div className="absolute top-10 left-4 z-30 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          <button
                            type="button"
                            onClick={() =>
                              handleInlinePatch(task, {
                                assigneeId: "",
                                assigneeName: "Unassigned",
                              })
                            }
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                          >
                            <span className="text-slate-700 dark:text-slate-300">
                              Unassigned
                            </span>
                          </button>
                          {workspaceMembers.map((member) => (
                            <button
                              type="button"
                              key={member.id}
                              onClick={() =>
                                handleInlinePatch(task, {
                                  assigneeId: member.id || "",
                                  assigneeName:
                                    member.name ||
                                    member.email ||
                                    "Unassigned",
                                })
                              }
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <span className="text-slate-700 dark:text-slate-300">
                                {member.name || member.email || "Unknown"}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Reporter */}
                  {visibleCols.reporter && (
                    <td className="px-4 py-4 truncate max-w-25">
                      <span className="text-slate-500 dark:text-slate-400">
                        {task.reporterName || "Admin"}
                      </span>
                    </td>
                  )}

                  {/* Updated Date */}
                  {visibleCols.updated && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(task.updatedAt || task.createdAt)}
                    </td>
                  )}

                  {/* Created At */}
                  {visibleCols.createdAt && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(task.createdAt)}
                    </td>
                  )}

                  {/* Due Date */}
                  {visibleCols.dueDate && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {inlineEdit?.taskId === task.id &&
                      inlineEdit?.field === "dueDate" ? (
                        <input
                          autoFocus
                          type="date"
                          value={inlineEdit.value}
                          onChange={(event) =>
                            setInlineEdit((prev) =>
                              prev
                                ? { ...prev, value: event.target.value }
                                : prev,
                            )
                          }
                          onBlur={() => commitInlineEdit(task)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              commitInlineEdit(task);
                            }
                            if (event.key === "Escape") {
                              setInlineEdit(null);
                            }
                          }}
                          className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openInlineEdit(
                              task,
                              "dueDate",
                              task.dueDate ? String(task.dueDate).slice(0, 10) : "",
                            )
                          }
                          className="flex items-center gap-1.5 rounded-md px-1 py-0.5 hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                          {task.dueDate ? (
                            <>
                              <Calendar size={12} /> {formatDate(task.dueDate)}
                            </>
                          ) : (
                            "--"
                          )}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Show message if empty */}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500">
                  No tasks match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === FLOATING BULK ACTION MENU === */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          selectedIds.size > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 rounded-full border border-slate-200/50 bg-white/90 px-5 py-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/90">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4 dark:border-white/10">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white dark:bg-indigo-500">
              {selectedIds.size}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Selected
            </span>
          </div>

          <div className="flex gap-1">
            
            {/* BULK ACTION: Set Status */}
            <div className="relative">
              {bulkDropdown === "status" && (
                <div className="fixed inset-0 z-10" onClick={() => setBulkDropdown(null)} />
              )}
              <button 
                onClick={() => setBulkDropdown(bulkDropdown === "status" ? null : "status")}
                className="relative z-20 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
              >
                <Circle size={16} /> Set Status
              </button>
              
              {bulkDropdown === "status" && (
                <div className="absolute bottom-full mb-2 left-0 z-30 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleBulkStatus(s.value)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <s.icon size={14} className={s.color} />
                      <span className="text-slate-700 dark:text-slate-300">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BULK ACTION: Assign */}
            <div className="relative">
              {bulkDropdown === "assign" && (
                <div className="fixed inset-0 z-10" onClick={() => setBulkDropdown(null)} />
              )}
              <button 
                onClick={() => setBulkDropdown(bulkDropdown === "assign" ? null : "assign")}
                className="relative z-20 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
              >
                <UserPlus size={16} /> Assign
              </button>
              
              {bulkDropdown === "assign" && (
                <div className="absolute bottom-full mb-2 left-0 z-30 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                  <button
                    onClick={() => handleBulkAssign("", "Unassigned")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                  >
                    <span className="text-slate-700 dark:text-slate-300">Unassigned</span>
                  </button>
                  {workspaceMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleBulkAssign(member.id || "", member.name || member.email || "Unknown")}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <span className="text-slate-700 dark:text-slate-300">
                        {member.name || member.email || "Unknown"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BULK ACTION: Delete Placeholder */}
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 size={16} /> Delete
            </button>
          </div>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}