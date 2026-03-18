"use client";

import { useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { loadDashboard, useMockStore } from "@/components/dashboard/mockStore";
import { useWorkspaceProjectSelection } from "@/components/dashboard/projectSelection";
import CreateTaskModal from "@/components/board/CreateTaskModal";

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

export default function CreateTaskLauncher({
  workspaceId,
  projectId = "",
  buttonClassName = "",
  label = "Create Task",
  onCreated,
}) {
  const { projects, workspaces } = useMockStore((state) => ({
    projects: state.projects || [],
    workspaces: state.workspaces || [],
  }));

  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId],
  );
  const members = useMemo(
    () =>
      workspaces.find((workspace) => workspace.id === workspaceId)?.members || [],
    [workspaces, workspaceId],
  );

  const [open, setOpen] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState(null);
  const boardCacheRef = useRef(new Map());
  const { selectedProject: storedSelectedProject } =
    useWorkspaceProjectSelection(workspaceId, workspaceProjects);
  const selectedProject = useMemo(() => {
    if (!projectId) return storedSelectedProject;
    return (
      workspaceProjects.find((project) => String(project.id) === String(projectId)) ||
      null
    );
  }, [projectId, storedSelectedProject, workspaceProjects]);

  async function resolveCreateTarget(project) {
    const cached = boardCacheRef.current.get(project.id);
    if (cached) return cached;

    const boardData = await fetchJson(`/api/dashboard/boards/${project.id}`);
    const board = boardData?.board || null;
    const columns = sortColumns(boardData?.columns || []);
    const todoColumn =
      columns.find(
        (column) => getStatusFromColumnName(column?.name, "") === "todo",
      ) || columns[0];

    if (!board?.id || !todoColumn?.id) {
      throw new Error("No board column available for this project");
    }

    const nextTarget = {
      projectId: project.id,
      projectName: project.name || "",
      boardId: String(board.id),
      columnId: String(todoColumn.id),
      columnName: String(todoColumn.name || "To Do"),
    };
    boardCacheRef.current.set(project.id, nextTarget);
    return nextTarget;
  }

  async function handleOpen() {
    if (!selectedProject || loadingTarget || submitting) return;
    try {
      setLoadingTarget(true);
      const resolved = await resolveCreateTarget(selectedProject);
      setTarget(resolved);
      setOpen(true);
    } catch (error) {
      console.error("Failed to prepare create-task modal", error);
    } finally {
      setLoadingTarget(false);
    }
  }

  async function handleCreate(values) {
    if (!target || submitting) return;

    try {
      setSubmitting(true);
      const payload = {
        workspaceId,
        projectId: target.projectId,
        boardId: target.boardId,
        columnId: target.columnId,
        title: values.title,
        description: values.description || "",
        assigneeId: values.assigneeId || "",
        dueDate: values.dueDate || "",
        priority: values.priority || "P2",
        status: getStatusFromColumnName(target.columnName, "todo"),
        estimatedTime: values.estimatedTime || 0,
      };

      const data = await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadDashboard({ force: true });
      setOpen(false);
      onCreated?.(data?.task || null);
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!selectedProject || loadingTarget || submitting}
        className={buttonClassName}
      >
        <Plus size={16} /> {loadingTarget ? "Loading..." : label}
      </button>

      <CreateTaskModal
        open={open}
        onClose={() => (submitting ? null : setOpen(false))}
        onSubmit={handleCreate}
        members={members}
        columnName={target?.columnName || "To Do"}
        submitting={submitting}
      />
    </>
  );
}
