"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createProject, useMockStore } from "@/components/dashboard/mockStore";

export default function WorkspaceOverviewPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { projects, tasks } = useMockStore((state) => ({
    projects: state.projects || [],
    tasks: state.tasks || [],
  }));

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const workspaceProjects = useMemo(
    () => projects.filter((item) => item.workspaceId === workspaceId),
    [projects, workspaceId]
  );
  const workspaceTasks = useMemo(
    () => tasks.filter((item) => item.workspaceId === workspaceId),
    [tasks, workspaceId]
  );

  const counts = useMemo(() => {
    const result = { todo: 0, inprogress: 0, inreview: 0, done: 0 };
    workspaceTasks.forEach((task) => {
      const status = task.status || "todo";
      if (result[status] !== undefined) result[status] += 1;
    });
    return result;
  }, [workspaceTasks]);

  async function onCreateProject() {
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      await createProject(workspaceId, name.trim(), key.trim());
      setName("");
      setKey("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-4">
        <Card title="Projects" value={String(workspaceProjects.length)} />
        <Card title="To Do" value={String(counts.todo)} />
        <Card title="In Progress" value={String(counts.inprogress)} />
        <Card title="Done" value={String(counts.done)} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Create Project</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project name"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 sm:col-span-3 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="KEY"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm uppercase outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <button
          type="button"
          onClick={onCreateProject}
          disabled={!name.trim() || submitting}
          className="mt-3 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
        >
          Create project
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Projects</h2>
        <div className="space-y-2">
          {workspaceProjects.map((project) => (
            <div key={project.id} className="rounded-xl border border-slate-200 px-3 py-3 text-sm dark:border-white/10">
              <p className="font-medium text-slate-900 dark:text-slate-100">{project.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{project.key} | {project.status || "active"}</p>
            </div>
          ))}
          {!workspaceProjects.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet.</p> : null}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
