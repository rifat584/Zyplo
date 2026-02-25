"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyLoginScenario, getSession } from "@/components/dashBoardTest/mockStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("rifat@zyplo.dev");
  const [scenario, setScenario] = useState("many");

  const onSubmit = (event) => {
    event.preventDefault();
    applyLoginScenario(scenario);

    const session = getSession();
    const { workspaces, lastVisited } = session;

    if (workspaces.length === 0) {
      router.replace("/dashBoardTest/onboarding/workspace");
      return;
    }

    if (lastVisited?.workspaceId && lastVisited?.projectId) {
      router.replace(`/dashBoardTest/w/${lastVisited.workspaceId}/p/${lastVisited.projectId}`);
      return;
    }

    if (workspaces.length === 1) {
      router.replace(`/dashBoardTest/w/${workspaces[0].id}`);
      return;
    }

    router.replace("/dashBoardTest/workspaces");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="space-y-3">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs text-cyan-700">
          <Sparkles className="size-3" />
          Zyplo Premium Test Area
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Project management for web developers.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Track work</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Board + List</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Stay aligned</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live activity</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Move faster</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Quick commands</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mock scenario</label>
          <select
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="many">Multiple workspaces</option>
            <option value="single">Single workspace</option>
            <option value="none">No workspace</option>
          </select>
        </div>

        <Button type="submit" className="w-full">
          <Building2 className="size-4" />
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </motion.div>
  );
}
