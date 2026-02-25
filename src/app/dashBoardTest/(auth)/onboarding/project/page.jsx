"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FolderKanban, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, getWorkspaceById } from "../../../_lib/mockStore";

export default function ProjectOnboardingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const workspaceId = params.get("workspaceId") || "";
  const workspace = getWorkspaceById(workspaceId);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  if (!workspace) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Workspace not found</h1>
        <Button asChild>
          <Link href="/dashBoardTest/onboarding/workspace">Back</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !key.trim()) return;

    const project = createProject(workspaceId, { name: name.trim(), key: key.trim().toUpperCase() });
    router.push(`/dashBoardTest/w/${workspaceId}/p/${project.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
          <Sparkles className="size-3" />
          Onboarding 2 of 2
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create your first project</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Workspace: {workspace.name}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project name</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project key</label>
          <Input value={key} onChange={(event) => setKey(event.target.value)} placeholder="DVP" required />
        </div>
        <Button type="submit" className="w-full">
          <FolderKanban className="size-4" />
          Open project
        </Button>
      </form>
    </motion.div>
  );
}
