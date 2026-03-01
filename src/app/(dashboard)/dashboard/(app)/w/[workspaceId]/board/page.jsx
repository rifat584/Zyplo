"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createProject, createTask, updateTask, useMockStore } from "@/components/dashboard/mockStore";

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
  const [timeLimitHours, setTimeLimitHours] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  async function handleCreateProject() {
    if (!projectName.trim()) return;
    try {
      setSubmitting(true);
      const project = await createProject(workspaceId, projectName.trim(), projectKey.trim());
      setProjectName("");
      setProjectKey("");
      setProjectId(project?.id || "");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTask() {
    if (!title.trim() || !projectId) return;
    const hours = Number(timeLimitHours);
    const hasValidHours = Number.isFinite(hours) && hours > 0;
    const dueDate = hasValidHours ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString() : "";
    try {
      setSubmitting(true);
      await createTask({
        workspaceId,
        projectId,
        title: title.trim(),
        assigneeId: assigneeId || members[0]?.id || "",
        dueDate,
        status: "todo",
      });
      setTitle("");
      setTimeLimitHours("");
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Project</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 sm:col-span-3 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            value={projectKey}
            onChange={(event) => setProjectKey(event.target.value)}
            placeholder="KEY"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm uppercase outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <button
          type="button"
          onClick={handleCreateProject}
          disabled={!projectName.trim() || submitting}
          className="mt-3 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          Create project
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Task</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
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
          <input
            type="number"
            min="1"
            step="1"
            value={timeLimitHours}
            onChange={(event) => setTimeLimitHours(event.target.value)}
            placeholder="Time limit (hours)"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
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
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {task.projectName || "No project"} {task.dueDate ? `| Due ${new Date(task.dueDate).toLocaleString()}` : ""}
                    </p>
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
