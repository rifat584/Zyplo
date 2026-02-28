"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createTask, updateTask, useMockStore } from "@/components/dashboard/mockStore";

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "inreview", label: "In Review" },
  { id: "done", label: "Done" },
];

export default function WorkspaceBoardPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { tasks, projects, workspaces } = useMockStore((state) => ({
    tasks: state.tasks || [],
    projects: state.projects || [],
    workspaces: state.workspaces || [],
  }));

  const members = useMemo(
    () => workspaces.find((item) => item.id === workspaceId)?.members || [],
    [workspaces, workspaceId]
  );
  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === workspaceId),
    [projects, workspaceId]
  );
  const workspaceTasks = useMemo(
    () => tasks.filter((task) => task.workspaceId === workspaceId),
    [tasks, workspaceId]
  );

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  async function handleCreateTask() {
    if (!title.trim() || !projectId) return;
    try {
      setSubmitting(true);
      await createTask({
        workspaceId,
        projectId,
        title: title.trim(),
        assigneeId: assigneeId || members[0]?.id || "",
        status: "todo",
      });
      setTitle("");
    } finally {
      setSubmitting(false);
    }
  }

  async function moveTask(taskId, status) {
    try {
      setUpdatingTaskId(taskId);
      await updateTask(taskId, { status });
    } finally {
      setUpdatingTaskId("");
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Task</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 md:col-span-2 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Select project</option>
            {workspaceProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <select
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Auto assignee</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleCreateTask}
          disabled={!title.trim() || !projectId || submitting}
          className="mt-3 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          Create task
        </button>
      </section>

      <section className="grid gap-3 lg:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.id} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{column.label}</p>
            <div className="space-y-2">
              {workspaceTasks
                .filter((task) => (task.status || "todo") === column.id)
                .map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.projectName || "No project"}</p>
                    <select
                      value={task.status || "todo"}
                      onChange={(event) => moveTask(task.id, event.target.value)}
                      disabled={updatingTaskId === task.id}
                      className="mt-2 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {COLUMNS.map((option) => (
                        <option key={option.id} value={option.id}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              {!workspaceTasks.some((task) => (task.status || "todo") === column.id) ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No tasks</p>
              ) : null}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
