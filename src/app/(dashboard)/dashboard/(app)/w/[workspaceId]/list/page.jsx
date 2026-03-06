"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useMockStore, loadDashboard } from "@/components/dashboard/mockStore";
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
  Eye,
  Search,
  Filter,
  Plus,
  Trash2,
  UserPlus,
  X,
  Check
} from "lucide-react";

// --- HELPERS ---
const formatDate = (dateString) => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  }).format(date);
};

// FIX: Keys updated to perfectly match the Board's exact status keys
const STATUSES = [
  { value: "todo", label: "Todo", icon: Circle, color: "text-slate-500" },
  { value: "inprogress", label: "In Progress", icon: Clock, color: "text-blue-500" },
  { value: "inreview", label: "In Review", icon: Eye, color: "text-purple-500" },
  { value: "done", label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

const PRIORITIES = [
  { value: "P1", label: "Urgent", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
  { value: "P2", label: "High", icon: ArrowUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { value: "P3", label: "Medium", icon: ArrowRight, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  { value: "P4", label: "Low", icon: ArrowDown, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10" },
];

export default function TaskListView() {
  const params = useParams();
  const router = useRouter(); // Added router for redirecting
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  // Global Store
  const allTasks = useMockStore((state) => state.tasks || []);

  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeDropdown, setActiveDropdown] = useState(null); 

  // Display Columns State
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    status: true,
    priority: true,
    assignee: true,
    reporter: true,
    updated: true,
    dueDate: true,
  });
  
  // Local state to simulate instant UI updates while backend saves
  const [localEdits, setLocalEdits] = useState({});

  // --- DERIVED DATA ---
  const workspaceTasks = allTasks.filter((t) => t.workspaceId === workspaceId);
  
  const filteredTasks = useMemo(() => {
    return workspaceTasks
      .map(t => ({ ...t, ...(localEdits[t.id] || {}) })) 
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [workspaceTasks, searchQuery, localEdits]);

  // --- HANDLERS ---
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map(t => t.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleColumn = (col) => {
    setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // ACTUAL BACKEND PATCH
  const handleInlineEdit = async (taskId, field, value) => {
    // 1. Optimistically update UI instantly
    setLocalEdits(prev => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || {}), [field]: value, updatedAt: new Date().toISOString() }
    }));
    setActiveDropdown(null);

    // 2. Send to Backend
    try {
      const token = localStorage.getItem("token") || ""; 
      await fetch(`http://localhost:5000/dashboard/tasks/${taskId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ [field]: value })
      });
      // Refresh global store in background to ensure perfect sync
      loadDashboard({ force: true }).catch(() => {});
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0B0F19] overflow-hidden min-h-150">
      
      {/* === HEADER & CONTROL BAR === */}
      <div className="flex flex-col border-b border-slate-200 dark:border-white/10">
        
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All Tasks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{workspaceTasks.length} tasks in this workspace</p>
        </div>

        <div className="flex flex-col gap-4 bg-slate-50/50 p-4 dark:bg-slate-800/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Live Search */}
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#050505] dark:text-white dark:placeholder-slate-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* === DISPLAY TOGGLE BUTTON === */}
            <div className="relative">
              <button 
                onClick={() => setDisplayMenuOpen(!displayMenuOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Filter size={16} /> Display
              </button>

              {/* Display Dropdown */}
              {displayMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDisplayMenuOpen(false)} />
                  <div className="absolute right-0 top-10 z-20 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-900">
                    <p className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Visible Columns</p>
                    {Object.keys(visibleCols).map(col => (
                      <button 
                        key={col}
                        onClick={() => toggleColumn(col)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 capitalize"
                      >
                        {col.replace(/([A-Z])/g, ' $1').trim()}
                        {visibleCols[col] && <Check size={14} className="text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* === CREATE TASK BUTTON (REDIRECTS TO BOARD) === */}
            <button 
              onClick={() => router.push(`/dashboard/w/${workspaceId}/board`)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus size={16} /> Create Task
            </button>

          </div>
        </div>
      </div>

      {/* === INTERACTIVE DATA GRID === */}
      <div className="overflow-x-auto pb-32 min-h-100">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          
          <thead className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3 font-medium w-10">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size > 0 && selectedIds.size === filteredTasks.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900" 
                />
              </th>
              <th className="px-4 py-3 font-medium">Task Name</th>
              {visibleCols.status && <th className="px-4 py-3 font-medium">Status</th>}
              {visibleCols.priority && <th className="px-4 py-3 font-medium">Priority</th>}
              {visibleCols.assignee && <th className="px-4 py-3 font-medium">Assignee</th>}
              {visibleCols.reporter && <th className="px-4 py-3 font-medium">Reporter</th>}
              {visibleCols.updated && <th className="px-4 py-3 font-medium">Updated</th>}
              {visibleCols.dueDate && <th className="px-4 py-3 font-medium">Due Date</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {filteredTasks.map((task) => {
              // FIX: Now matching the raw string directly without adding hyphens
              const rawStatus = (task.status || "todo").toLowerCase().replace(/\s+/g, ""); 
              const currentStatus = STATUSES.find(s => s.value === rawStatus) || STATUSES[0];
              const currentPriority = PRIORITIES.find(p => p.value === task.priority) || PRIORITIES[2];

              return (
                <tr 
                  key={task.id} 
                  className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${selectedIds.has(task.id) ? 'bg-indigo-50/50 dark:bg-indigo-500/10' : ''}`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(task.id)}
                      onChange={() => toggleSelect(task.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-900" 
                    />
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">
                    {task.title}
                    {task.projectName && <div className="mt-0.5 text-xs font-normal text-slate-500">{task.projectName}</div>}
                  </td>

                  {/* INLINE EDIT: Status */}
                  {visibleCols.status && (
                    <td className="px-4 py-4 relative">
                      {activeDropdown === `status-${task.id}` && <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />}
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === `status-${task.id}` ? null : `status-${task.id}`)}
                        className="flex items-center gap-2 rounded-md px-2 py-1 -ml-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors relative z-20"
                      >
                        <currentStatus.icon size={14} className={currentStatus.color} />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentStatus.label}</span>
                      </button>

                      {activeDropdown === `status-${task.id}` && (
                        <div className="absolute top-10 left-4 z-30 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          {STATUSES.map(s => (
                            <button 
                              key={s.value}
                              onClick={() => handleInlineEdit(task.id, 'status', s.value)}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <s.icon size={14} className={s.color} />
                              <span className="text-slate-700 dark:text-slate-300">{s.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* INLINE EDIT: Priority */}
                  {visibleCols.priority && (
                    <td className="px-4 py-4 relative">
                      {activeDropdown === `priority-${task.id}` && <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />}
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === `priority-${task.id}` ? null : `priority-${task.id}`)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:brightness-95 relative z-20 ${currentPriority.bg} ${currentPriority.color}`}
                      >
                        <currentPriority.icon size={12} />
                        {currentPriority.label}
                      </button>

                      {activeDropdown === `priority-${task.id}` && (
                        <div className="absolute top-10 left-4 z-30 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-white/10 dark:bg-slate-900">
                          {PRIORITIES.map(p => (
                            <button 
                              key={p.value}
                              onClick={() => handleInlineEdit(task.id, 'priority', p.value)}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                            >
                              <p.icon size={14} className={p.color} />
                              <span className="text-slate-700 dark:text-slate-300">{p.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Assignee */}
                  {visibleCols.assignee && (
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                          {task.assigneeName ? task.assigneeName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span className="truncate max-w-25">{task.assigneeName || "Unassigned"}</span>
                      </div>
                    </td>
                  )}

                  {/* Reporter */}
                  {visibleCols.reporter && (
                    <td className="px-4 py-4 truncate max-w-25">
                      <span className="text-slate-500 dark:text-slate-400">{task.reporterName || "Admin"}</span>
                    </td>
                  )}

                  {/* Updated Date */}
                  {visibleCols.updated && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(task.updatedAt)}
                    </td>
                  )}

                  {/* Due Date */}
                  {visibleCols.dueDate && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {task.dueDate ? (
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(task.dueDate)}</span>
                      ) : "--"}
                    </td>
                  )}
                </tr>
              );
            })}
            
            {/* Show message if empty */}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-500">
                  No tasks match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === FLOATING BULK ACTION MENU === */}
      <div 
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          selectedIds.size > 0 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 rounded-full border border-slate-200/50 bg-white/90 px-5 py-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/90">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4 dark:border-white/10">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white dark:bg-indigo-500">
              {selectedIds.size}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Selected</span>
          </div>
          
          <div className="flex gap-1">
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors">
              <Circle size={16} /> Set Status
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors">
              <UserPlus size={16} /> Assign
            </button>
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 size={16} /> Delete
            </button>
          </div>
          
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300">
            <X size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}