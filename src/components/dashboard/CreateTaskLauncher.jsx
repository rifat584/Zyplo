"use client";

import { useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { upsertLiveTask, useMockStore } from "@/components/dashboard/mockStore";
import { useWorkspaceProjectSelection } from "@/components/dashboard/projectSelection";
import CreateTaskModal from "@/components/board/CreateTaskModal";
import { Button } from "@/components/ui/button";
import {
  findColumnByStatus,
  getTaskStatusLabel,
} from "@/components/dashboard/taskStatus";

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
    const todoColumn = findColumnByStatus(columns, "todo");

    if (!board?.id || !todoColumn?.id) {
      throw new Error("No board column available for this project");
    }

    const nextTarget = {
      projectId: project.id,
      projectName: project.name || "",
      boardId: String(board.id),
      columns,
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
      toast.error(error?.message || "Failed to prepare task creation.");
    } finally {
      setLoadingTarget(false);
    }
  }

  async function handleCreate(values) {
    if (!target || submitting) return;

    try {
      setSubmitting(true);
      const nextStatus = values.status || "todo";
      const destinationColumn = findColumnByStatus(target.columns, nextStatus);

      if (!destinationColumn?.id) {
        throw new Error(
          `The current project does not have an ${getTaskStatusLabel(nextStatus)} column.`,
        );
      }

      const payload = {
        workspaceId,
        projectId: target.projectId,
        boardId: target.boardId,
        columnId: String(destinationColumn.id),
        title: values.title,
        description: values.description || "",
        assigneeId: values.assigneeId || "",
        dueDate: values.dueDate || "",
        priority: values.priority || "P2",
        status: nextStatus,
      };

      const data = await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data?.task) upsertLiveTask(data.task);
      setOpen(false);
      onCreated?.(data?.task || null);
    } catch (error) {
      console.error("Failed to create task", error);
      toast.error(error?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={handleOpen}
        disabled={!selectedProject || loadingTarget || submitting}
        className={buttonClassName}
      >
        <Plus size={16} /> {loadingTarget ? "Loading..." : label}
      </Button>

      <CreateTaskModal
        open={open}
        onClose={() => (submitting ? null : setOpen(false))}
        onSubmit={handleCreate}
        members={members}
        defaultStatus="todo"
        submitting={submitting}
      />
    </>
  );
}
