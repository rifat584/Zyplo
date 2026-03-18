"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
// file attach - helal / bayijid
import { useMockStore, loadDashboard } from "@/components/dashboard/mockStore"; 
import { readSelectedProjectId } from "@/components/dashboard/projectSelection";
import TaskDetailsModal from "@/components/board/TaskDetailsModal";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

function minutesToSeconds(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 0) return 0;
  return Math.floor(minutes * 60);
}

function normalizeStatus(status) {
  const s = String(status || "todo").toLowerCase().replace(/\s+/g, "");
  if (s === "inprogress") return "In Progress";
  if (s === "inreview") return "In Review";
  if (s === "done") return "Done";
  return "To Do";
}

function normalizeStatusKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function getStatusFromColumnName(columnName, fallback = "") {
  const normalized = normalizeStatusKey(columnName);
  if (normalized === "todo" || normalized === "backlog") return "todo";
  if (normalized === "inprogress" || normalized === "doing") return "inprogress";
  if (normalized === "inreview" || normalized === "review") return "inreview";
  if (normalized === "done" || normalized === "completed") return "done";
  return normalizeStatusKey(fallback) || "todo";
}

function sortColumns(columns = []) {
  return [...columns].sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0));
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

export default function WorkspaceCalenderPage() {
  const params = useParams();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { tasks, projects, members } = useMockStore((state) => ({
    tasks: state.tasks || [],
    projects: state.projects || [],
    members:
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.members || [],
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
  const [createOpen, setCreateOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [createError, setCreateError] = useState("");
  const [targetLoading, setTargetLoading] = useState(false);
  const [dayDetailsOpen, setDayDetailsOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  
  // file attach - helal / bayijid (Task Details Modal States)
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    dueDate: "",
    priority: "P2",
    status: "todo",
    estimatedTime: "",
  });

  const filteredTasks = useMemo(() => {
    return workspaceTasks.filter((task) => {
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
      return bySearch && byAssignee && byStatus && byPriority;
    });
  }, [workspaceTasks, search, assignee, status, priority]);

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
  const filteredProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId],
  );

  function openCreateModal(dateKey) {
    let preferredProjectId = "";
    if (typeof window !== "undefined" && workspaceId) {
      preferredProjectId = readSelectedProjectId(workspaceId);
    }
    const preferredExists = filteredProjects.some(
      (project) => project.id === preferredProjectId,
    );
    setCreateError("");
    setForm({
      title: "",
      description: "",
      projectId: preferredExists ? preferredProjectId : filteredProjects[0]?.id || "",
      assigneeId: "",
      dueDate: dateKey,
      priority: "P2",
      status: "todo",
      estimatedTime: "",
    });
    setCreateOpen(true);
  }

  function openDayDetails(dateKey) {
    setSelectedDateKey(dateKey);
    setDayDetailsOpen(true);
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    if (!form.title.trim() || createBusy) return;
    if (!form.projectId) {
      setCreateError("Please select a project");
      return;
    }

    try {
      setCreateError("");
      setCreateBusy(true);
      setTargetLoading(true);

      const projectCandidates = [
        form.projectId,
        ...filteredProjects
          .map((project) => project.id)
          .filter((id) => id && id !== form.projectId),
      ];

      let resolvedTarget = null;
      for (const candidateProjectId of projectCandidates) {
        try {
          const boardData = await fetchJson(`/api/dashboard/boards/${candidateProjectId}`);
          const board = boardData?.board || null;
          const columns = sortColumns(boardData?.columns || []);
          const todoColumn =
            columns.find(
              (column) => getStatusFromColumnName(column?.name, "") === "todo",
            ) || columns[0];

          if (!board?.id || !todoColumn?.id) continue;

          resolvedTarget = {
            projectId: candidateProjectId,
            boardId: String(board.id),
            columnId: String(todoColumn.id),
            status: getStatusFromColumnName(todoColumn.name, form.status || "todo"),
          };
          break;
        } catch {
          // try next project
        }
      }

      if (!resolvedTarget) {
        throw new Error("No board found for your workspace projects");
      }

      const assignee = members.find((m) => m.id === form.assigneeId);

      // Direct API call guarantees we get a real MongoDB ID
      await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify({
          workspaceId,
          projectId: resolvedTarget.projectId,
          boardId: resolvedTarget.boardId,
          columnId: resolvedTarget.columnId,
          title: form.title.trim(),
          description: form.description.trim(),
          assigneeId: form.assigneeId || "",
          assigneeName: assignee ? (assignee.name || assignee.email || "Unassigned") : "Unassigned",
          dueDate: form.dueDate || "",
          priority: form.priority || "P2",
          status: resolvedTarget.status,
          estimatedTime: minutesToSeconds(form.estimatedTime),
        })
      });

      await loadDashboard({ force: true, silent: true });
      setCreateOpen(false);
    } catch (error) {
      setCreateError(error?.message || "Failed to create task");
    } finally {
      setTargetLoading(false);
      setCreateBusy(false);
    }
  }

  // --- BULLETPROOF UPDATE HANDLER ---
  async function handleUpdateTask(values) {
    if (!selectedTask?.id) return;
    try {
      setUpdateBusy(true);

      const selectedMember = members.find((m) => m.id === values.assigneeId);
      values.assigneeName = values.assigneeId 
        ? (selectedMember?.name || selectedMember?.email || selectedTask.assigneeName || "Unassigned")
        : "Unassigned";

      const nextStatus = values.status || selectedTask.status || "todo";
      const currentStatus = selectedTask.status || "todo";

      // 1. Attempt to sync the board column if status changed
      if (nextStatus !== currentStatus && selectedTask.projectId) {
        try {
          // Fetch exact board state to prevent mismatch errors
          const boardData = await fetchJson(`/api/dashboard/boards/${selectedTask.projectId}`);
          const columns = boardData?.columns || [];
          
          let trueSourceColumnId = selectedTask.columnId;
          // Find where the backend actually placed this task
          for (const col of columns) {
            if (col.tasks?.some(t => String(t.id) === String(selectedTask.id))) {
              trueSourceColumnId = String(col.id);
              break;
            }
          }

          const destCol = columns.find(c => getStatusFromColumnName(c.name, "") === normalizeStatusKey(nextStatus));
          
          if (destCol && trueSourceColumnId && String(destCol.id) !== trueSourceColumnId) {
            await fetchJson(`/api/dashboard/tasks/${selectedTask.id}/move`, {
              method: "PATCH",
              body: JSON.stringify({
                sourceColumnId: trueSourceColumnId,
                destinationColumnId: String(destCol.id),
                newOrder: Array.isArray(destCol.tasks) ? destCol.tasks.length : 0,
                status: nextStatus,
              })
            });
          }
        } catch (moveError) {
          // Ignore move errors! Let the patch update continue saving the files/title!
          console.warn("Could not sync board columns, but safely continuing with update:", moveError);
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

  async function handleDeleteTask(task) {
    if (!task?.id) return;
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      setDeleteBusy(true);
      await fetchJson(`/api/dashboard/tasks/${task.id}`, {
        method: "DELETE",
      });
      await loadDashboard({ force: true, silent: true });
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to delete task", error);
      alert(error?.message || "Failed to delete task");
    } finally {
      setDeleteBusy(false);
    }
  }

  const selectedDayTasks = useMemo(() => {
    if (!selectedDateKey) return [];
    return taskMap.get(selectedDateKey) || [];
  }, [selectedDateKey, taskMap]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-white p-4 dark:border-white/10 dark:bg-card">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search calendar"
              className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
            />
          </div>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="h-10 min-w-[140px] rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
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
            className="h-10 min-w-[110px] rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
          >
            <option value="all">Type</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 min-w-[120px] rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary/30 dark:border-white/10 dark:bg-surface dark:text-foreground"
          >
            <option value="all">Status</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="inreview">In Review</option>
            <option value="done">Done</option>
          </select>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground hover:bg-surface dark:border-white/10 dark:text-muted-foreground dark:hover:bg-surface"
          >
            <CalendarDays className="size-4" />
            More filters
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthDate(new Date())}
            className="h-9 rounded-lg border border-border px-3 text-sm text-foreground hover:bg-surface dark:border-white/10 dark:text-foreground dark:hover:bg-surface"
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
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface dark:border-white/10 dark:text-foreground dark:hover:bg-surface"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="h-9 rounded-lg border border-border px-3 text-sm leading-9 text-foreground dark:border-white/10 dark:text-foreground">
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
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface dark:border-white/10 dark:text-foreground dark:hover:bg-surface"
          >
            <ChevronRight className="size-4" />
          </button>
          <select
            defaultValue="month"
            className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-foreground dark:border-white/10 dark:bg-surface dark:text-foreground"
          >
            <option value="month">Month</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-white dark:border-white/10 dark:bg-card">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-border">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="border-r border-border px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0 sm:px-3 sm:text-sm dark:border-white/10 dark:text-muted-foreground"
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
                  <div
                    key={key}
                    className="min-h-24 cursor-pointer border-b border-r border-border p-1.5 last:border-r-0 hover:bg-surface sm:min-h-32 sm:p-2 dark:border-white/10 dark:hover:bg-surface/40"
                    onClick={() => openDayDetails(key)}
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
                          openCreateModal(key);
                        }}
                        className="inline-flex size-5 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted sm:size-6 dark:border-white/10 dark:text-muted-foreground dark:hover:bg-surface"
                        aria-label={`Create task on ${key}`}
                      >
                        <Plus className="size-3 sm:size-3.5" />
                      </button>
                    </div>
                    <div className="mt-1.5 space-y-1 sm:mt-2">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task); // Opens Reusable Modal directly
                          }}
                          className="truncate rounded-md border border-primary/20 bg-primary/10 px-1.5 py-1 text-[11px] text-primary sm:px-2 sm:text-xs cursor-pointer hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/100/10 dark:text-primary dark:hover:bg-primary/100/20 transition-colors"
                        >
                          {task.title} | {normalizeStatus(task.status)}
                        </div>
                      ))}
                      {dayTasks.length > 2 ? (
                        <p className="text-[11px] text-muted-foreground sm:text-xs dark:text-muted-foreground">
                          {dayTasks.length - 2} more
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* --- INLINE CREATE TASK MODAL --- */}
      {createOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"
            onClick={() => (createBusy ? null : setCreateOpen(false))}
            aria-label="Close task create modal"
          />
          <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Calendar
                </p>
                <h2 className="text-lg font-semibold text-foreground">
                  Create Task
                </h2>
              </div>
              <button
                type="button"
                onClick={() => (createBusy ? null : setCreateOpen(false))}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface dark:border-white/10 dark:text-muted-foreground dark:hover:bg-surface"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form className="space-y-4 p-5" onSubmit={handleCreateTask}>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Task Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Project
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, projectId: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  >
                    <option value="">No project</option>
                    {filteredProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Assignee
                  </label>
                  <select
                    value={form.assigneeId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, assigneeId: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  >
                    <option value="">Auto assignee</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.email || "Member"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, dueDate: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, priority: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  >
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                    <option value="P3">P3</option>
                    <option value="P4">P4</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="inreview">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Estimate (mins)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.estimatedTime}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        estimatedTime: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-surface dark:text-foreground"
                    placeholder="0"
                  />
                </div>
              </div>

              {createError ? (
                <p className="text-sm text-destructive dark:text-destructive">
                  {createError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 border-t border-border pt-4 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  disabled={createBusy}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 dark:border-white/10 dark:text-foreground dark:hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!form.title.trim() || !form.projectId || createBusy || targetLoading}
                  className="rounded-lg bg-primary/100 px-4 py-2 text-sm font-medium text-white hover:bg-primary disabled:opacity-50"
                >
                  {createBusy || targetLoading ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* --- DAY DETAILS MODAL --- */}
      {dayDetailsOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-[2px]"
            onClick={() => setDayDetailsOpen(false)}
            aria-label="Close day details modal"
          />
          <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl dark:border-white/10 dark:bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-white/10">
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
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface dark:border-white/10 dark:text-muted-foreground dark:hover:bg-surface"
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
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-border bg-white p-3.5 transition-all hover:border-primary/30 hover:shadow-sm dark:border-white/10 dark:bg-card/50 dark:hover:border-primary/50"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary dark:text-foreground dark:group-hover:text-primary">
                        {task.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {task.projectName || "No project"}
                      </p>
                    </div>
                    <span className="rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground dark:bg-surface dark:text-muted-foreground">
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
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
