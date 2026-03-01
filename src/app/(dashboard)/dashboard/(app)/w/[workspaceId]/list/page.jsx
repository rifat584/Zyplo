"use client";

import { useParams } from "next/navigation";
import { useMockStore } from "@/components/dashboard/mockStore";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Calendar,
  MoreHorizontal,
  Eye // Added for "In Review" status
} from "lucide-react";

// Helper for formatting dates
const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

// Helper for Priority styling
const PriorityBadge = ({ priority }) => {
  const config = {
    P1: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", label: "Urgent" },
    P2: { icon: ArrowUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", label: "High" },
    P3: { icon: ArrowRight, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", label: "Medium" },
    P4: { icon: ArrowDown, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10", label: "Low" },
  };
  const badge = config[priority] || config.P3;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${badge.bg} ${badge.color}`}>
      <Icon size={12} />
      {badge.label}
    </span>
  );
};

// Helper for Status styling
const StatusBadge = ({ status }) => {
  // Normalize the status string (e.g. "In Review" -> "in-review")
  const normalizedStatus = (status || "todo").toLowerCase().replace(/\s+/g, "-");
  
  const config = {
    "todo": { icon: Circle, color: "text-slate-500", label: "Todo" },
    "in-progress": { icon: Clock, color: "text-blue-500", label: "In Progress" },
    "in-review": { icon: Eye, color: "text-purple-500", label: "In Review" },
    "done": { icon: CheckCircle2, color: "text-emerald-500", label: "Done" },
  };
  
  // Fallback to a default badge if the status is totally unknown
  const badge = config[normalizedStatus] || { icon: Circle, color: "text-slate-500", label: status };
  const Icon = badge.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className={badge.color} />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
        {badge.label}
      </span>
    </div>
  );
};

export default function TaskListView() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  // Pull tasks and current user from your global store
  const allTasks = useMockStore((state) => state.tasks || []);
  const currentUser = useMockStore((state) => state.currentUser);

  // Filter tasks to only show ones belonging to this workspace
  const tasks = allTasks.filter((t) => t.workspaceId === workspaceId);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 overflow-hidden">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Tasks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{tasks.length} tasks in this workspace</p>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium">Task Name</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Priority</th>
              <th className="px-6 py-3 font-medium">Assignee</th>
              <th className="px-6 py-3 font-medium">Reporter</th>
              <th className="px-6 py-3 font-medium">Created</th>
              {/* FIX: Added the missing Updated Date Header! */}
              <th className="px-6 py-3 font-medium">Updated</th> 
              <th className="px-6 py-3 font-medium">Due Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500">
                  No tasks found. Create one to get started!
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {/* Task Name & Project ID */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {task.title}
                    </div>
                    {task.projectName && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {task.projectName}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Assignee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <span>{task.assigneeName || "Unassigned"}</span>
                    </div>
                  </td>

                  {/* Reporter */}
                  <td className="px-6 py-4">
                    <span className="text-slate-500 dark:text-slate-400">
                      {task.reporterName || "Admin"}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {formatDate(task.createdAt)}
                  </td>

                  {/* Updated Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {formatDate(task.updatedAt)}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    {task.dueDate ? (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      "--"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button className="rounded p-1 text-slate-400 opacity-0 transition hover:bg-slate-200 hover:text-slate-900 group-hover:opacity-100 dark:hover:bg-slate-700 dark:hover:text-slate-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}