"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProjectDialog from "@/components/dashboard/dialogs/CreateProjectDialog";
import { Avatar } from "@/components/dashboard/ui";
import { fromNow } from "../../../../_lib/format";
import {
  getOpenTaskCountByProject,
  setLastVisited,
  useMockStore,
} from "../../../../_lib/mockStore";

export default function WorkspaceProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);
  const projects = useMockStore((s) => s.projects.filter((item) => item.workspaceId === workspaceId));

  const summary = useMemo(() => {
    const openTasks = projects.reduce((total, project) => total + getOpenTaskCountByProject(project.id), 0);
    return {
      projects: projects.length,
      openTasks,
      members: workspace?.members.length || 0,
    };
  }, [projects, workspace?.members.length]);

  if (!workspace) return <p className="text-sm text-slate-600 dark:text-slate-400">Workspace not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Workspace Projects</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">All projects for {workspace.name} with quick insights.</p>
        </div>
        <Button onClick={() => setNewProjectOpen(true)}>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Projects</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.projects}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Open Tasks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.openTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Members</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{summary.members}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{project.name}</p>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{project.key}</span>
            </div>

            <div className="mb-3 flex -space-x-2">
              {workspace.members
                .filter((member) => project.members.includes(member.id))
                .slice(0, 5)
                .map((member) => (
                  <Avatar key={member.id} name={member.name} className="size-7 border-2 border-white text-[10px]" />
                ))}
            </div>

            <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{getOpenTaskCountByProject(project.id)} open tasks</span>
              <span>Updated {fromNow(project.updatedAt)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/dashboard/w/${workspaceId}/p/${project.id}`}
                onClick={() => setLastVisited(workspaceId, project.id, "board")}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600"
              >
                Open Board
                <ArrowRight className="size-4" />
              </Link>
              <Link href={`/dashboard/w/${workspaceId}/p/${project.id}/list`} className="text-sm text-slate-600 dark:text-slate-300">
                List
              </Link>
              <Link href={`/dashboard/w/${workspaceId}/p/${project.id}/activity`} className="text-sm text-slate-600 dark:text-slate-300">
                Activity
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <CreateProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        workspaceId={workspaceId}
        onCreated={(project) => router.push(`/dashboard/w/${workspaceId}/p/${project.id}`)}
      />
    </div>
  );
}
