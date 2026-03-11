"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { 
  Search, Folder, Plus, CheckCircle2, Clock, Eye, AlertCircle, 
  ArrowUp, ArrowRight, ArrowDown, User, Command, Building2, 
  LayoutDashboard, CalendarDays, List, CornerDownLeft, Circle
} from "lucide-react";
import { useMockStore, loadDashboard } from "@/components/dashboard/mockStore";

// --- API Helpers ---
async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text ? { message: text } : null; }
  if (!response.ok) throw new Error(data?.error || data?.message || "Request failed");
  return data;
}

const normalizeStatusKey = (value) => String(value || "").toLowerCase().replace(/[^a-z]/g, "");

// --- Constants ---
const STATUSES = [
  { value: "todo", label: "To Do", icon: Circle, color: "text-slate-400" },
  { value: "inprogress", label: "In Progress", icon: Clock, color: "text-blue-500" },
  { value: "inreview", label: "In Review", icon: Eye, color: "text-purple-500" },
  { value: "done", label: "Done", icon: CheckCircle2, color: "text-emerald-500" },
];

const PRIORITIES = [
  { value: "P0", label: "Critical", icon: AlertCircle, color: "text-red-500" },
  { value: "P1", label: "High", icon: ArrowUp, color: "text-orange-500" },
  { value: "P2", label: "Medium", icon: ArrowRight, color: "text-yellow-600" },
  { value: "P3", label: "Low", icon: ArrowDown, color: "text-slate-500" },
];
const FAB_POSITION_KEY = "dashboard.commandPalette.fabPosition";

export default function CommandPalette() {
  const router = useRouter();
  const params = useParams();
  
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState({ type: "root" }); // root | task | select_task | create
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fabPosition, setFabPosition] = useState(null);
  const [isDraggingFab, setIsDraggingFab] = useState(false);

  const inputRef = useRef(null);
  const fabRef = useRef(null);
  const dragStateRef = useRef(null);
  const suppressClickRef = useRef(false);
  const dragRafRef = useRef(0);

  const { workspaces, projects, tasks } = useMockStore((state) => ({
    workspaces: state.workspaces || [],
    projects: state.projects || [],
    tasks: state.tasks || [],
  }));

  const currentWorkspaceId = params?.workspaceId;
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
  const isGlobalMode = !currentWorkspaceId;

  const members = useMemo(() => {
    if (!isGlobalMode && currentWorkspace) return currentWorkspace.members || [];
    
    const allMembers = [];
    const seen = new Set();
    workspaces.forEach(w => {
      (w.members || []).forEach(m => {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          allMembers.push(m);
        }
      });
    });
    return allMembers;
  }, [isGlobalMode, currentWorkspace, workspaces]);

  // --- Keyboard Listeners ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setView({ type: "root" });
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAB_POSITION_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed?.x === "number" && typeof parsed?.y === "number") {
        setFabPosition({ x: parsed.x, y: parsed.y });
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (!fabPosition) return;
    try {
      localStorage.setItem(FAB_POSITION_KEY, JSON.stringify(fabPosition));
    } catch {
      // no-op
    }
  }, [fabPosition]);

  useEffect(() => {
    if (!fabPosition) return;

    const onResize = () => {
      const el = fabRef.current;
      const width = el?.offsetWidth || 220;
      const height = el?.offsetHeight || 44;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);

      setFabPosition((prev) => {
        if (!prev) return prev;
        return {
          x: Math.min(Math.max(prev.x, 8), maxX),
          y: Math.min(Math.max(prev.y, 8), maxY),
        };
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fabPosition]);

  const clampFabPosition = (x, y) => {
    const el = fabRef.current;
    const width = el?.offsetWidth || 220;
    const height = el?.offsetHeight || 44;
    const maxX = Math.max(8, window.innerWidth - width - 8);
    const maxY = Math.max(8, window.innerHeight - height - 8);
    return {
      x: Math.min(Math.max(x, 8), maxX),
      y: Math.min(Math.max(y, 8), maxY),
    };
  };

  const handleFabPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = fabRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const startX = fabPosition?.x ?? rect.left;
    const startY = fabPosition?.y ?? rect.top;

    const start = clampFabPosition(startX, startY);

    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: start.x,
      startY: start.y,
      nextX: start.x,
      nextY: start.y,
      moved: false,
    };

    el.style.left = `${start.x}px`;
    el.style.top = `${start.y}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";

    suppressClickRef.current = false;
    setIsDraggingFab(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const flushDragFrame = () => {
    dragRafRef.current = 0;
    const drag = dragStateRef.current;
    const el = fabRef.current;
    if (!drag || !el) return;
    el.style.left = `${drag.nextX}px`;
    el.style.top = `${drag.nextY}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
  };

  const handleFabPointerMove = (e) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) > 4) {
      drag.moved = true;
      suppressClickRef.current = true;
    }

    const next = clampFabPosition(drag.startX + dx, drag.startY + dy);
    drag.nextX = next.x;
    drag.nextY = next.y;

    if (!dragRafRef.current) {
      dragRafRef.current = window.requestAnimationFrame(flushDragFrame);
    }
  };

  const handleFabPointerUp = (e) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    if (dragRafRef.current) {
      window.cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = 0;
    }

    setFabPosition({ x: drag.nextX, y: drag.nextY });
    dragStateRef.current = null;
    setIsDraggingFab(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  useEffect(() => {
    return () => {
      if (dragRafRef.current) {
        window.cancelAnimationFrame(dragRafRef.current);
      }
    };
  }, []);

  const handleInputKeyDown = (e) => {
    if (e.key === "Backspace" && query === "" && view.type !== "root") {
      e.preventDefault();
      setView({ type: "root" });
      setQuery("");
      setSelectedIndex(0);
    }
  };

  const fuzzyMatch = (targetText, searchQuery) => {
    if (!searchQuery) return true;
    const target = String(targetText).toLowerCase();
    const searchWords = searchQuery.toLowerCase().trim().split(/\s+/);
    return searchWords.every(word => target.includes(word));
  };

  const commands = useMemo(() => {
    const list = [];
    const q = query.trim();

    const scopeTasks = isGlobalMode ? tasks : tasks.filter(t => t.workspaceId === currentWorkspaceId);
    const scopeProjects = isGlobalMode ? projects : projects.filter(p => p.workspaceId === currentWorkspaceId);

    if (view.type === "root") {
      if (q.length > 0) {
        list.push({
          id: "create-task",
          group: "Create",
          icon: <Plus className="size-4 text-indigo-500" />,
          label: `Create Task: "${q}"`,
          action: () => {
            setView({ type: "create", title: q });
            setQuery("");
            setSelectedIndex(0);
          },
        });
      }

      STATUSES.filter(s => fuzzyMatch(`change set status ${s.label}`, q)).forEach(s => {
        list.push({
          id: `g-status-${s.value}`,
          group: "Workflow Commands",
          icon: <s.icon className={`size-4 ${s.color}`} />,
          label: `Set Status to ${s.label}`,
          subtitle: "Apply to a specific task...",
          action: () => { 
            setView({ type: "select_task", patch: { status: s.value }, actionLabel: `Set Status to ${s.label}` }); 
            setQuery(""); 
            setSelectedIndex(0);
          }
        });
      });

      PRIORITIES.filter(p => fuzzyMatch(`change set priority ${p.label}`, q)).forEach(p => {
        list.push({
          id: `g-priority-${p.value}`,
          group: "Workflow Commands",
          icon: <p.icon className={`size-4 ${p.color}`} />,
          label: `Set Priority to ${p.label}`,
          subtitle: "Apply to a specific task...",
          action: () => { 
            setView({ type: "select_task", patch: { priority: p.value }, actionLabel: `Set Priority to ${p.label}` }); 
            setQuery(""); 
            setSelectedIndex(0);
          }
        });
      });

      members.filter(m => fuzzyMatch(`assign to member user ${m.name} ${m.email}`, q)).forEach(m => {
        const name = m.name || m.email.split('@')[0];
        list.push({
          id: `g-assign-${m.id}`,
          group: "Workflow Commands",
          icon: <User className="size-4 text-slate-400" />,
          label: `Assign to ${name}`,
          subtitle: "Apply to a specific task...",
          action: () => { 
            setView({ type: "select_task", patch: { assigneeId: m.id, assigneeName: name }, actionLabel: `Assign to ${name}` }); 
            setQuery(""); 
            setSelectedIndex(0);
          }
        });
      });

      if (!isGlobalMode) {
        const navs = [
          { name: "Board", icon: LayoutDashboard, path: "board" },
          { name: "List", icon: List, path: "list" },
          { name: "Calendar", icon: CalendarDays, path: "calender" },
          { name: "Timeline", icon: Clock, path: "timeline" },
        ];
        navs.filter(n => fuzzyMatch(`go to navigate view ${n.name}`, q)).forEach(n => {
          list.push({
            id: `nav-${n.path}`,
            group: "Navigation",
            icon: <n.icon className="size-4 text-slate-500" />,
            label: `Go to ${n.name}`,
            action: () => { router.push(`/dashboard/w/${currentWorkspaceId}/${n.path}`); setOpen(false); }
          });
        });
      }

      scopeProjects.filter(p => fuzzyMatch(`go to open project ${p.name}`, q)).slice(0, 5).forEach(p => {
        list.push({
          id: `proj-${p.id}`,
          group: "Projects",
          icon: <Folder className="size-4 text-sky-500" />,
          label: `Open Project: ${p.name}`,
          subtitle: isGlobalMode ? (workspaces.find(w => w.id === p.workspaceId)?.name || "Workspace") : "",
          action: () => {
            localStorage.setItem(`dashboard.selectedProject.${p.workspaceId}`, p.id);
            router.push(`/dashboard/w/${p.workspaceId}/board`);
            setOpen(false);
          },
        });
      });

      if (!query || "switch workspace".includes(q.toLowerCase())) {
        workspaces.filter(w => fuzzyMatch(w.name, q)).slice(0, 3).forEach(w => {
          list.push({
            id: `ws-${w.id}`,
            group: "Workspaces",
            icon: <Building2 className="size-4 text-emerald-500" />,
            label: `Switch to Workspace: ${w.name}`,
            action: () => { router.push(`/dashboard/w/${w.id}`); setOpen(false); }
          });
        });
      }

      scopeTasks.filter(t => fuzzyMatch(`task edit ${t.title} ${t.status}`, q)).slice(0, 8).forEach(t => {
        list.push({
          id: `task-${t.id}`,
          group: "Manage Specific Tasks",
          icon: <CheckCircle2 className="size-4 text-slate-400" />,
          label: t.title,
          subtitle: `${t.projectName || "No Project"} (${t.status || "todo"})`,
          action: () => {
            setView({ type: "task", task: t });
            setQuery("");
            setSelectedIndex(0);
          },
        });
      });
    }

    if (view.type === "task") {
      const task = view.task;

      STATUSES.filter(s => fuzzyMatch(`status ${s.label}`, q)).forEach(s => {
        list.push({
          id: `t-status-${s.value}`,
          group: "Update Status",
          icon: <s.icon className={`size-4 ${s.color}`} />,
          label: s.label,
          action: () => executeTaskUpdate(task, { status: s.value }),
        });
      });

      PRIORITIES.filter(p => fuzzyMatch(`priority ${p.label}`, q)).forEach(p => {
        list.push({
          id: `t-priority-${p.value}`,
          group: "Update Priority",
          icon: <p.icon className={`size-4 ${p.color}`} />,
          label: p.label,
          action: () => executeTaskUpdate(task, { priority: p.value }),
        });
      });

      members.filter(m => fuzzyMatch(`assign to ${m.name} ${m.email}`, q)).forEach(m => {
        list.push({
          id: `t-assign-${m.id}`,
          group: "Reassign Task",
          icon: <User className="size-4 text-slate-400" />,
          label: m.name || m.email.split('@')[0],
          action: () => executeTaskUpdate(task, { assigneeId: m.id, assigneeName: m.name || m.email }),
        });
      });
    }

    if (view.type === "select_task") {
      scopeTasks.filter(t => fuzzyMatch(t.title, q)).forEach(t => {
        list.push({
          id: `apply-${t.id}`,
          group: `Select a task to apply changes`,
          icon: <CheckCircle2 className="size-4 text-slate-400" />,
          label: t.title,
          subtitle: t.projectName,
          action: () => executeTaskUpdate(t, view.patch)
        });
      });
    }

    if (view.type === "create") {
      scopeProjects.filter(p => fuzzyMatch(p.name, q)).forEach(p => {
        list.push({
          id: `create-in-${p.id}`,
          group: "Select Project for new task",
          icon: <Folder className="size-4 text-indigo-500" />,
          label: p.name,
          subtitle: isGlobalMode ? (workspaces.find(w => w.id === p.workspaceId)?.name || "Workspace") : "",
          action: () => executeTaskCreate(p.id, p.workspaceId, view.title),
        });
      });
    }

    return list;
  }, [query, view, tasks, projects, workspaces, members, currentWorkspaceId, isGlobalMode, router]);

  const executeTaskUpdate = async (task, patch) => {
    setIsProcessing(true);
    try {
      if (patch.status && task.projectId) {
        const boardData = await fetchJson(`/api/dashboard/boards/${task.projectId}`);
        const columns = boardData?.columns || [];
        const destCol = columns.find(c => normalizeStatusKey(c.name) === normalizeStatusKey(patch.status));
        
        let sourceColumnId = task.columnId;
        for (const col of columns) {
          if (col.tasks?.some(t => String(t.id) === String(task.id))) {
            sourceColumnId = String(col.id); break;
          }
        }

        if (destCol && sourceColumnId && String(destCol.id) !== sourceColumnId) {
          await fetchJson(`/api/dashboard/tasks/${task.id}/move`, {
            method: "PATCH",
            body: JSON.stringify({
              sourceColumnId,
              destinationColumnId: String(destCol.id),
              newOrder: Array.isArray(destCol.tasks) ? destCol.tasks.length : 0,
              status: patch.status,
            })
          });
        } else {
          await fetchJson(`/api/dashboard/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(patch) });
        }
      } else {
        await fetchJson(`/api/dashboard/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify(patch) });
      }
      
      toast.success("Task updated instantly");
      loadDashboard({ force: true, silent: true });
      window.dispatchEvent(new CustomEvent("zyplo-refresh-board")); 
      setOpen(false);
    } catch (err) {
      if(err?.message !== "Task not found") toast.error(err.message || "Update failed");
      else {
         toast.success("Task updated instantly");
         loadDashboard({ force: true, silent: true });
         window.dispatchEvent(new CustomEvent("zyplo-refresh-board")); 
         setOpen(false);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const executeTaskCreate = async (projectId, targetWorkspaceId, title) => {
    setIsProcessing(true);
    try {
      const boardData = await fetchJson(`/api/dashboard/boards/${projectId}`);
      const columns = boardData?.columns || [];
      const todoCol = columns.find(c => normalizeStatusKey(c.name) === "todo") || columns[0];

      if (!todoCol) throw new Error("Board is empty");

      await fetchJson("/api/dashboard/tasks", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: targetWorkspaceId,
          projectId,
          boardId: String(boardData.board.id),
          columnId: String(todoCol.id),
          title,
          status: "todo",
          priority: "P2"
        })
      });
      toast.success(`Task created!`);
      loadDashboard({ force: true, silent: true });
      window.dispatchEvent(new CustomEvent("zyplo-refresh-board")); 
      setOpen(false);
    } catch(err) {
      toast.error(err.message || "Creation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleNavigation = (e) => {
      if (!open || commands.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % commands.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + commands.length) % commands.length);
      }
      if (e.key === "Enter" && commands[selectedIndex]) {
        e.preventDefault();
        commands[selectedIndex].action();
      }
    };
    document.addEventListener("keydown", handleNavigation);
    return () => document.removeEventListener("keydown", handleNavigation);
  }, [open, commands, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [commands.length]);

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});

  let globalIndex = 0;

  return (
    <>
      {/* --- FLOATING BUTTON --- */}
      {!open && (
        <button
          ref={fabRef}
          onClick={() => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              return;
            }
            setOpen(true);
          }}
          onPointerDown={handleFabPointerDown}
          onPointerMove={handleFabPointerMove}
          onPointerUp={handleFabPointerUp}
          onPointerCancel={handleFabPointerUp}
          title="Open Command Palette"
          className={`fixed bottom-6 right-6 z-[90] flex items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/90 p-3 text-xs font-bold uppercase tracking-widest text-slate-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-slate-700 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] sm:bottom-8 sm:right-8 sm:px-4 sm:py-2.5 dark:border-white/20 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 ${isDraggingFab ? "cursor-grabbing select-none" : "cursor-grab"}`}
          style={(() => {
            const drag = dragStateRef.current;
            if (drag) {
              return {
                left: `${drag.nextX}px`,
                top: `${drag.nextY}px`,
                right: "auto",
                bottom: "auto",
                touchAction: "none",
              };
            }
            if (fabPosition) {
              return {
                left: `${fabPosition.x}px`,
                top: `${fabPosition.y}px`,
                right: "auto",
                bottom: "auto",
                touchAction: "none",
              };
            }
            return { touchAction: "none" };
          })()}
        >
          <Command className="size-5 sm:size-4" />
          <span className="hidden sm:inline">Press</span>
          <span className="hidden rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] text-slate-700 sm:inline dark:bg-white/10 dark:text-slate-200">
            Ctrl K
          </span>
          <span className="hidden sm:inline">to search</span>
        </button>
      )}

      {/* --- COMMAND PALETTE MODAL --- */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-[640px] transform overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-white/10 dark:bg-[#0B0F19] mx-4 flex flex-col max-h-[65vh]">
            
            {/* Input Area */}
            <div className="flex items-center border-b border-slate-200 px-4 py-4 dark:border-white/10">
              
              {/* Breadcrumbs for Sub-menus */}
              {view.type !== "root" ? (
                 <div className="flex shrink-0 items-center gap-2 mr-2">
                   <button 
                     onClick={() => { setView({type: "root"}); setQuery(""); setSelectedIndex(0); }}
                     className="flex h-6 items-center rounded bg-slate-100 px-2 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 transition-colors"
                   >
                     Root
                   </button>
                   <span className="text-slate-300 dark:text-slate-600">/</span>
                   <div className="flex h-6 max-w-[160px] items-center rounded bg-indigo-50 px-2 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 truncate">
                     {view.type === 'task' ? view.task.title : 
                      view.type === 'create' ? 'Create Task' : view.actionLabel}
                   </div>
                 </div>
              ) : (
                <Search className="size-5 text-slate-400 shrink-0" />
              )}
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  view.type === "root" ? "Search commands, tasks, or projects..." :
                  view.type === "task" ? "Type status, priority, or name..." :
                  view.type === "select_task" ? "Search for task to apply..." :
                  "Search project..."
                }
                className="ml-2 flex-1 bg-transparent text-[17px] text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100 min-w-0"
                disabled={isProcessing}
              />
              {isProcessing ? (
                <div className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              ) : (
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  ESC <span className="hidden sm:inline lowercase font-medium tracking-normal text-[11px]"> to close</span>
                </button>
              )}
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
              {commands.length === 0 ? (
                <div className="py-14 text-center text-sm text-slate-500 dark:text-slate-400">
                  No results found for "{query}"
                </div>
              ) : (
                Object.entries(groupedCommands).map(([group, items]) => (
                  <div key={group} className="mb-4 last:mb-1">
                    <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group}
                    </div>
                    <ul className="space-y-0.5">
                      {items.map((cmd) => {
                        const isSelected = globalIndex === selectedIndex;
                        const currentIndex = globalIndex++;

                        return (
                          <li
                            key={cmd.id}
                            onMouseEnter={() => setSelectedIndex(currentIndex)}
                            onClick={cmd.action}
                            ref={(el) => {
                              // Keep selected item in scroll view
                              if (isSelected && el) el.scrollIntoView({ block: "nearest" });
                            }}
                            className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                              isSelected
                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                                : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`flex size-6 shrink-0 items-center justify-center rounded-md ${isSelected ? "bg-white shadow-sm dark:bg-[#161b26]" : ""}`}>
                                {cmd.icon}
                              </div>
                              <span className="truncate font-medium">{cmd.label}</span>
                              {cmd.subtitle && (
                                <span className="truncate text-xs text-slate-400 dark:text-slate-500 hidden sm:inline-block">
                                  — {cmd.subtitle}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                                {view.type === "root" && !cmd.id.includes("nav") && !cmd.id.includes("proj") && !cmd.id.includes("ws") ? (
                                   <>Select <CornerDownLeft className="size-3 ml-0.5" /></>
                                ) : (
                                   <>Execute <CornerDownLeft className="size-3 ml-0.5" /></>
                                )}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="hidden sm:flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-[11px] text-slate-500 dark:border-white/10 dark:bg-[#050505]/50 dark:text-slate-400">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                   <div className="flex items-center gap-0.5">
                     <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-white px-1 font-sans dark:border-white/10 dark:bg-slate-800 shadow-sm">↑</kbd>
                     <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-white px-1 font-sans dark:border-white/10 dark:bg-slate-800 shadow-sm">↓</kbd>
                   </div>
                   <span>Navigate</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-white px-1.5 font-sans font-medium dark:border-white/10 dark:bg-slate-800 shadow-sm">↵</kbd>
                   <span>Select</span>
                 </div>
                 {view.type !== "root" && (
                    <div className="flex items-center gap-1.5">
                      <kbd className="flex h-5 items-center justify-center rounded border border-slate-200 bg-white px-1.5 font-sans font-medium dark:border-white/10 dark:bg-slate-800 shadow-sm">Backspace</kbd>
                      <span>Go back</span>
                    </div>
                 )}
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-400 dark:text-slate-500">
                <Command className="size-3" /> Zyplo OS
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
