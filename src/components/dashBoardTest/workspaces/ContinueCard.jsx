"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fromNow } from "@/app/dashBoardTest/_lib/format";
import MyWorkWidget from "./MyWorkWidget";

/*
  ContinueCard props:
    - continueContext
    - lastVisited
    - myWorkPreview
*/
export default function ContinueCard({ continueContext, lastVisited, myWorkPreview }) {
  if (!continueContext) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 dark:border-white/10 dark:from-slate-900 dark:to-slate-900 xl:grid-cols-[1.45fr_0.8fr]"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Continue</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{continueContext.project.name}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {continueContext.workspace.name} • Last opened {fromNow(lastVisited?.visitedAt || continueContext.project.updatedAt)}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            {continueContext.openTasks} open
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            {continueContext.inProgress} in progress
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            {continueContext.dueToday} due today
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/dashBoardTest/w/${continueContext.workspace.id}/p/${continueContext.project.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            Resume
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={`/dashBoardTest/w/${continueContext.workspace.id}/p/${continueContext.project.id}/list`}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            View tasks
          </Link>
        </div>
      </div>

      <MyWorkWidget myWorkPreview={myWorkPreview} />
    </motion.section>
  );
}
