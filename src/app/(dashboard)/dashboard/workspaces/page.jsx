"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/dashboard/chrome";
import { createProject, createTask, createWorkspace, getState, inviteMember, loadDashboard, updateTask, useMockStore } from "@/components/dashboard/mockStore";

export default function WorkspacesPage() {
  const { status } = useSession();
  const { loaded, loading, workspaces, projects, tasks } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
    workspaces: state.workspaces,
    projects: state.projects,
    tasks: state.tasks,
  }));

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [workspaceName, setWorkspaceName] = useState("");
  const [onboardingEmails, setOnboardingEmails] = useState("");

  const [memberEmail, setMemberEmail] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("P2");
  const [submitting, setSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        await loadDashboard({ force: true });
      } catch {
        // first call can race right after auth redirect; retry once
      }

      if (cancelled) return;

      const hasData = (getState().workspaces?.length || 0) > 0;
      if (!hasData) {
        setTimeout(() => {
          if (!cancelled) {
            loadDashboard({ force: true }).catch(() => {});
          }
        }, 500);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadDashboard({ force: true }).catch(() => {});
  }, [status]);

  useEffect(() => {
    if (!loaded) return;
    if (workspaces.length === 0) {
      setOnboardingOpen(true);
      return;
    }
    setOnboardingOpen(false);
  }, [loaded, workspaces.length]);

  useEffect(() => {
    if (workspaces.length === 0) {
      if (selectedWorkspaceId) setSelectedWorkspaceId("");
      return;
    }

    const exists = workspaces.some((workspace) => workspace.id === selectedWorkspaceId);
    if (!selectedWorkspaceId || !exists) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [selectedWorkspaceId, workspaces]);

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId) || null,
    [workspaces, selectedWorkspaceId]
  );

  const workspaceTasks = useMemo(
    () => tasks.filter((task) => task.workspaceId === selectedWorkspaceId),
    [tasks, selectedWorkspaceId]
  );
  const workspaceProjects = useMemo(
    () => projects.filter((project) => project.workspaceId === selectedWorkspaceId),
    [projects, selectedWorkspaceId]
  );

  useEffect(() => {
    if (selectedWorkspace?.members?.length && !taskAssigneeId) {
      setTaskAssigneeId(selectedWorkspace.members[0].id);
    }
  }, [selectedWorkspace, taskAssigneeId]);

  useEffect(() => {
    if (!workspaceProjects.length) {
      setTaskProjectId("");
      return;
    }
    if (!taskProjectId || !workspaceProjects.some((project) => project.id === taskProjectId)) {
      setTaskProjectId(workspaceProjects[0].id);
    }
  }, [workspaceProjects, taskProjectId]);

  async function handleCreateWorkspace() {
    const name = workspaceName.trim();
    if (!name) return;

    const emails = onboardingEmails
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      const workspace = await createWorkspace(name, emails);
      setSelectedWorkspaceId(workspace.id);
      setWorkspaceName("");
      setOnboardingEmails("");
      setOnboardingOpen(false);
      setProjectName("");
      setProjectKey("");
      setTaskTitle("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleInviteMember() {
    if (!selectedWorkspaceId || !memberEmail.trim()) return;
    try {
      setSubmitting(true);
      await inviteMember(selectedWorkspaceId, memberEmail.trim());
      setMemberEmail("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateProject() {
    if (!selectedWorkspaceId || !projectName.trim()) return;
    try {
      setSubmitting(true);
      const project = await createProject(selectedWorkspaceId, projectName.trim(), projectKey.trim());
      setProjectName("");
      setProjectKey("");
      setTaskProjectId(project.id);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateTask() {
    if (!selectedWorkspaceId || !taskTitle.trim() || !taskProjectId) return;
    try {
      setSubmitting(true);
      await createTask({
        workspaceId: selectedWorkspaceId,
        projectId: taskProjectId,
        title: taskTitle.trim(),
        assigneeId: taskAssigneeId,
        dueDate: taskDueDate,
        priority: taskPriority,
      });
      setTaskTitle("");
      setTaskDueDate("");
      setTaskPriority("P2");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTaskStatusChange(taskId, status) {
    if (!taskId || !status) return;
    try {
      setUpdatingTaskId(taskId);
      await updateTask(taskId, { status });
    } catch {
      // keep UI stable; latest server snapshot is fetched in store when possible
    } finally {
      setUpdatingTaskId("");
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Workspace</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Create workspace, invite members, create and assign tasks.</p>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus className="size-4" />
            New workspace
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Workspace</p>
          {workspaces.length ? (
            <select
              value={selectedWorkspaceId}
              onChange={(event) => setSelectedWorkspaceId(event.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            >
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
              No workspace yet. Create your first workspace to continue.
            </div>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Invite Member</h2>
            <div className="flex gap-2">
              <input
                type="email"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                placeholder="member@company.com"
                className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleInviteMember}
                disabled={!selectedWorkspaceId || submitting}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <UserPlus className="size-4" />
                Invite
              </button>
            </div>

            <div className="space-y-1">
              {(selectedWorkspace?.members || []).map((member) => (
                <div key={member.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-white/10">
                  {member.name} <span className="text-slate-500">({member.email})</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Project</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Project name"
                className="h-10 sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
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
              disabled={!selectedWorkspaceId || !projectName.trim() || submitting}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Create project
            </button>

            <div className="space-y-1">
              {workspaceProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-white/10">
                  {project.name} <span className="text-slate-500">({project.key})</span>
                </div>
              ))}
              {!workspaceProjects.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet.</p> : null}
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Task</h2>
            {!workspaceProjects.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600 dark:border-white/20 dark:text-slate-300">
                Create a project first, then you can create tasks in it.
              </div>
            ) : null}
            <input
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="Task title"
              disabled={!workspaceProjects.length || submitting}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="grid gap-2 sm:grid-cols-4">
              <select
                value={taskProjectId}
                onChange={(event) => setTaskProjectId(event.target.value)}
                disabled={!workspaceProjects.length || submitting}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              >
                {workspaceProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <select
                value={taskAssigneeId}
                onChange={(event) => setTaskAssigneeId(event.target.value)}
                disabled={!workspaceProjects.length || submitting}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              >
                {(selectedWorkspace?.members || []).map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={taskDueDate}
                onChange={(event) => setTaskDueDate(event.target.value)}
                disabled={!workspaceProjects.length || submitting}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
              <select
                value={taskPriority}
                onChange={(event) => setTaskPriority(event.target.value)}
                disabled={!workspaceProjects.length || submitting}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleCreateTask}
              disabled={!selectedWorkspaceId || !workspaceProjects.length || !taskProjectId || !taskTitle.trim() || submitting}
              className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              Create task
            </button>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Tasks</h2>
          <div className="space-y-2">
            {workspaceTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
                  <select
                    value={task.status || "todo"}
                    disabled={updatingTaskId === task.id}
                    onChange={(event) => handleTaskStatusChange(task.id, event.target.value)}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="inreview">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {task.priority} | {task.assigneeName || "Unassigned"} {task.projectName ? `| ${task.projectName}` : ""} {task.dueDate ? `| Due ${task.dueDate}` : ""}
                </p>
              </div>
            ))}
            {!workspaceTasks.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No tasks yet.</p> : null}
          </div>
        </section>
      </div>

      {onboardingOpen ? (
        <div className="fixed inset-0 z-50">
          <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={() => setOnboardingOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create Workspace</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Add your workspace and invite members by email.</p>
            <div className="mt-4 space-y-3">
              <input
                value={workspaceName}
                onChange={(event) => setWorkspaceName(event.target.value)}
                placeholder="Workspace name"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
              <textarea
                rows={3}
                value={onboardingEmails}
                onChange={(event) => setOnboardingEmails(event.target.value)}
                placeholder="member1@company.com, member2@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOnboardingOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateWorkspace}
                disabled={!workspaceName.trim() || submitting}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!loaded || loading ? (
        <div className="pointer-events-none fixed inset-0 z-40 bg-transparent" />
      ) : null}
    </AppShell>
  );
}
