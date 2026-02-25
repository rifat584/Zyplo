"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { BoardHeader, FilterChips, KanbanBoard, TaskDrawer } from "@/components/dashBoardTest/board";
import CreateTaskDialog from "@/components/dashBoardTest/dialogs/CreateTaskDialog";
import {
  getBoardAttentionCounts,
  moveTask,
  setLastVisited,
  useMockStore,
} from "@/components/dashBoardTest/mockStore";

const DEFAULT_COLUMNS = {
  todo: { title: "To Do", wip: 5 },
  inprogress: { title: "In Progress", wip: 4 },
  inreview: { title: "In Review", wip: 3 },
  done: { title: "Done", wip: 0 },
};

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function applyFilters(tasks, filters, searchQuery) {
  const now = new Date();
  const today = startOfDay(now);
  const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const q = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    const due = task.dueDate ? new Date(task.dueDate) : null;
    const dueDay = due ? startOfDay(due) : null;
    if (filters.p1 && task.priority !== "P1") return false;
    if (filters.dueSoon) {
      if (!dueDay) return false;
      if (dueDay < today || dueDay > dueSoonLimit) return false;
    }
    if (q) {
      const content = `${task.title} ${(task.tags || []).join(" ")} ${task.description || ""}`.toLowerCase();
      if (!content.includes(q)) return false;
    }
    return true;
  });
}

export default function ProjectBoardPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const [filters, setFilters] = useState({
    p1: false,
    dueSoon: false,
  });
  const [columnConfig, setColumnConfig] = useState(DEFAULT_COLUMNS);
  const [menuOpen, setMenuOpen] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const { project, tasks, members } = useMockStore((state) => ({
    project: state.projects.find((item) => item.id === projectId) || null,
    tasks: state.tasks.filter((task) => task.projectId === projectId),
    members: state.workspaces.find((workspace) => workspace.id === workspaceId)?.members || [],
  }));

  useEffect(() => {
    if (workspaceId && projectId) {
      setLastVisited(workspaceId, projectId, "board");
    }
  }, [workspaceId, projectId]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(timer);
  }, [projectId]);

  const attentionCounts = getBoardAttentionCounts(projectId);

  const filteredTasks = useMemo(() => applyFilters(tasks, filters, searchQuery), [tasks, filters, searchQuery]);
  const grouped = useMemo(
    () => ({
      todo: filteredTasks.filter((task) => task.status === "todo"),
      inprogress: filteredTasks.filter((task) => task.status === "inprogress"),
      inreview: filteredTasks.filter((task) => task.status === "inreview"),
      done: filteredTasks.filter((task) => task.status === "done"),
    }),
    [filteredTasks]
  );

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  if (!project) return <p className="text-sm text-slate-600">Project not found.</p>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <BoardHeader project={project} />

      {/* Filters */}
      <FilterChips
        workspaceId={workspaceId}
        projectId={projectId}
        activeView="board"
        filters={filters}
        counts={attentionCounts}
        onToggle={(key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onCreateTask={() => setCreateOpen(true)}
      />

      {/* Columns */}
      <KanbanBoard
        loading={loading}
        columnConfig={columnConfig}
        grouped={grouped}
        members={members}
        moveTask={moveTask}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setSelectedTaskId={setSelectedTaskId}
        setColumnConfig={setColumnConfig}
      />

      {/* Task card */}
      <TaskDrawer
        open={Boolean(selectedTask)}
        task={selectedTask}
        workspaceId={workspaceId}
        onOpenChange={() => setSelectedTaskId("")}
      />

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        projectId={projectId}
      />
    </div>
  );
}
