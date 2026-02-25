"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorkspace } from "../../../_lib/mockStore";

export default function WorkspaceOnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const workspace = createWorkspace(name.trim());
    router.push(`/dashBoardTest/onboarding/project?workspaceId=${workspace.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
          <Sparkles className="size-3" />
          Onboarding 1 of 2
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create your workspace</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Start with a team space. You can rename this anytime.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace name</label>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Zyplo Engineering" required />
        </div>
        <Button type="submit" className="w-full">
          <Building2 className="size-4" />
          Continue to project setup
        </Button>
      </form>
    </motion.div>
  );
}
