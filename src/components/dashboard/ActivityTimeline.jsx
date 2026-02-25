"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, PlusCircle, RefreshCw, Sparkles } from "lucide-react";
import { useMockStore } from "./mockStore";
import { formatDateTime } from "@/app/(dashboard)/dashboard/_lib/format";
import { Avatar } from "./ui";

function tone(type) {
  if (type === "comment") return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300";
  if (type === "status_change") return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300";
  if (type === "create_task") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (type === "update_task") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300";
  return "border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-300";
}

function IconByType({ type }) {
  if (type === "comment") return <MessageSquare className="size-3.5" />;
  if (type === "status_change") return <RefreshCw className="size-3.5" />;
  if (type === "create_task") return <PlusCircle className="size-3.5" />;
  if (type === "update_task") return <CheckCircle2 className="size-3.5" />;
  return <Sparkles className="size-3.5" />;
}

export default function ActivityTimeline({ projectId, workspaceId, filters, search }) {
  const { activity, tasks, currentUserId, members } = useMockStore((s) => ({
    activity: s.activity.filter((entry) => entry.projectId === projectId),
    tasks: s.tasks.filter((task) => task.projectId === projectId),
    currentUserId: s.currentUser.id,
    members: s.workspaces.find((workspace) => workspace.id === workspaceId)?.members || [],
  }));
  const currentUserName = members.find((member) => member.id === currentUserId)?.name || "";

  const entries = useMemo(() => {
    const lower = search.toLowerCase().trim();

    return [...activity]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((entry) => {
        const task = entry.taskId ? tasks.find((item) => item.id === entry.taskId) : null;
        if (filters.comments && entry.type !== "comment") return false;
        if (filters.statusChanges && entry.type !== "status_change") return false;
        if (filters.created && !["create_task", "create_project"].includes(entry.type)) return false;
        if (filters.byMe && entry.actor !== currentUserName) return false;
        if (lower) {
          const content = `${entry.actor} ${entry.message} ${task?.title || ""}`.toLowerCase();
          if (!content.includes(lower)) return false;
        }
        return true;
      })
      .map((entry) => ({
        ...entry,
        task: entry.taskId ? tasks.find((item) => item.id === entry.taskId) || null : null,
        member: members.find((member) => member.name === entry.actor) || null,
      }));
  }, [activity, tasks, filters, search, currentUserName, members]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No activity matches this filter or search.</p>
      ) : null}
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl border border-slate-200 p-3 dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="flex items-start gap-3">
              {entry.member ? <Avatar name={entry.member.name} className="size-7 text-[10px]" /> : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${tone(entry.type)}`}>
                    <IconByType type={entry.type} />
                    {entry.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(entry.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
                  <span className="font-semibold">{entry.actor}</span> {entry.message}
                </p>
                {entry.task ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Task: <span className="font-medium">{entry.task.title}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
