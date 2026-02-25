"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Clock3, Search, ShieldAlert } from "lucide-react";
import CreateProjectDialog from "@/components/dashboard/dialogs/CreateProjectDialog";
import {
  getMyWorkStats,
  getOpenTaskCountByProject,
  getProjectStatusMeta,
  getRecentWorkspaceActivity,
  setLastVisited,
  useMockStore,
} from "../../../_lib/mockStore";
import { Avatar } from "@/components/dashboard/ui";
import { fromNow } from "../../../_lib/format";

function HealthBadge({ health }) {
  if (health === "red") {
    return <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">At risk</span>;
  }
  if (health === "yellow") {
    return <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">Needs attention</span>;
  }
  return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">Healthy</span>;
}

export default function WorkspaceLobbyPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");

  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);
  const projects = useMockStore((s) => s.projects.filter((item) => item.workspaceId === workspaceId));
  const tasks = useMockStore((s) => s.tasks);
  const lastVisited = useMockStore((s) => s.lastVisited);

  const myWork = getMyWorkStats(workspaceId);
  const recentActivity = getRecentWorkspaceActivity(workspaceId, 6);

  const continueProject = useMemo(() => {
    if (lastVisited?.workspaceId !== workspaceId) return projects[0] || null;
    return projects.find((project) => project.id === lastVisited.projectId) || projects[0] || null;
  }, [lastVisited, projects, workspaceId]);

  const projectMeta = useMemo(() => {
    return projects.map((project) => {
      const status = getProjectStatusMeta(project.id);
      return {
        ...project,
        status,
        openTasks: getOpenTaskCountByProject(project.id),
      };
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const byQuery = projectMeta.filter((project) => {
      const value = `${project.name} ${project.key}`.toLowerCase();
      return value.includes(query.toLowerCase().trim());
    });
    if (scope === "risk") return byQuery.filter((project) => project.status?.health === "red");
    if (scope === "active") return byQuery.filter((project) => project.openTasks > 0);
    return byQuery;
  }, [projectMeta, query, scope]);
  const quickAccessProjects = useMemo(
    () => [...projectMeta].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3),
    [projectMeta]
  );
  const workspaceTasks = useMemo(() => {
    const projectIds = new Set(projects.map((project) => project.id));
    return tasks.filter((task) => projectIds.has(task.projectId));
  }, [projects, tasks]);
  const memberNameById = useMemo(() => {
    const map = {};
    workspace?.members?.forEach((member) => {
      map[member.id] = member.name;
    });
    return map;
  }, [workspace]);
  const projectById = useMemo(() => {
    const map = {};
    projects.forEach((project) => {
      map[project.id] = project;
    });
    return map;
  }, [projects]);
  const upcomingTasks = useMemo(() => {
    return workspaceTasks
      .filter((task) => task.status !== "done")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, [workspaceTasks]);
  const dueSoonCount = useMemo(() => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 2);
    return workspaceTasks.filter((task) => {
      if (task.status === "done") return false;
      const due = new Date(task.dueDate);
      return due >= now && due <= soon;
    }).length;
  }, [workspaceTasks]);

  if (!workspace) return <p className="text-sm text-slate-600">Workspace not found.</p>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Workspace Hub</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{workspace.name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{workspace.slug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            <Briefcase className="size-3.5" />
            {projects.length} projects
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            {myWork.assigned} assigned
          </span>
          <button
            type="button"
            onClick={() => setNewProjectOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            New Project
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_0.8fr] xl:items-start">
        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Continue</p>
            {continueProject ? (
              <>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{continueProject.name}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Resume your most relevant context.</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                    {continueProject.key}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
                    <Clock3 className="size-3.5" />
                    Updated {fromNow(continueProject.updatedAt)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/w/${workspaceId}/p/${continueProject.id}`}
                    onClick={() => setLastVisited(workspaceId, continueProject.id, "board")}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                  >
                    Open Board
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={`/dashboard/w/${workspaceId}/p/${continueProject.id}/list`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Open List
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 dark:border-white/10 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">This workspace</h3>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">Open tasks</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{workspaceTasks.filter((task) => task.status !== "done").length}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800">
                        <p className="text-slate-500 dark:text-slate-400">Due soon</p>
                        <p className="font-semibold text-amber-700 dark:text-amber-300">{dueSoonCount}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href={`/dashboard/w/${workspaceId}/members`}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Members
                      </Link>
                      <Link
                        href={`/dashboard/w/${workspaceId}/settings`}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Next up</h3>
                    {upcomingTasks.length > 0 ? (
                      <div className="space-y-2">
                        {upcomingTasks.map((task) => (
                          <Link
                            key={task.id}
                            href={`/dashboard/w/${workspaceId}/p/${task.projectId}`}
                            className="block rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
                          >
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              {projectById[task.projectId]?.name || "Project"} · {memberNameById[task.assignee] || "Unassigned"} · Due {fromNow(task.dueDate)}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : quickAccessProjects.length > 0 ? (
                      <div className="space-y-2">
                        {quickAccessProjects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/dashboard/w/${workspaceId}/p/${project.id}`}
                            className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-white/10 dark:hover:bg-slate-800"
                          >
                            <span className="text-slate-700 dark:text-slate-200">{project.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Updated {fromNow(project.updatedAt)}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">No projects yet.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">No project yet. Create your first project.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">My Work</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Assigned</span>
                <span className="font-semibold">{myWork.assigned}</span>
              </div>
              <div className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                <span>Due soon</span>
                <span className="font-semibold">{myWork.dueSoon}</span>
              </div>
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-300">
                <span>Overdue</span>
                <span className="font-semibold">{myWork.overdue}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h3>
            <div className="mt-3 space-y-2">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-200 p-2 text-sm dark:border-white/10">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{entry.actor}</span> {entry.message}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{fromNow(entry.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">All active projects in this workspace.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects"
                className="h-10 w-64 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
            <button
              type="button"
              onClick={() => setScope("all")}
              className={`rounded-full border px-3 py-1 text-xs ${scope === "all" ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setScope("active")}
              className={`rounded-full border px-3 py-1 text-xs ${scope === "active" ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setScope("risk")}
              className={`rounded-full border px-3 py-1 text-xs ${scope === "risk" ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-slate-800"}`}
            >
              At risk
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/40"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{project.key}</p>
                </div>
                <HealthBadge health={project.status?.health} />
              </div>

              <div className="mb-3 flex -space-x-2">
                {workspace.members
                  .filter((member) => project.members.includes(member.id))
                  .slice(0, 4)
                  .map((member) => (
                    <Avatar key={member.id} name={member.name} className="size-7 border-2 border-white text-[10px]" />
                  ))}
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span>{project.openTasks} open tasks</span>
                {project.status?.overdueCount > 0 ? <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-300"><ShieldAlert className="size-3.5" />{project.status.overdueCount} overdue</span> : null}
                <span>Updated {fromNow(project.updatedAt)}</span>
              </div>

              <Link
                href={`/dashboard/w/${workspaceId}/p/${project.id}`}
                onClick={() => setLastVisited(workspaceId, project.id, "board")}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
              >
                Open Project
                <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <CreateProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        workspaceId={workspaceId}
        onCreated={(project) => router.push(`/dashboard/w/${workspaceId}/p/${project.id}`)}
      />
    </div>
  );
}
