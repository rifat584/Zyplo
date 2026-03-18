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
  { value: "todo", label: "To Do", icon: Circle, color: "text-muted-foreground" },
  { value: "inprogress", label: "In Progress", icon: Clock, color: "text-secondary" },
  { value: "inreview", label: "In Review", icon: Eye, color: "text-info" },
  { value: "done", label: "Done", icon: CheckCircle2, color: "text-success" },
];

const PRIORITIES = [
  { value: "P0", label: "Critical", icon: AlertCircle, color: "text-destructive" },
  { value: "P1", label: "High", icon: ArrowUp, color: "text-warning" },
  { value: "P2", label: "Medium", icon: ArrowRight, color: "text-warning" },
  { value: "P3", label: "Low", icon: ArrowDown, color: "text-muted-foreground" },
];

export default function CommandPalette() {
  const router = useRouter();
  const params = useParams();
  
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState({ type: "root" }); // root | task | select_task | create
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef(null);

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
          icon: <Plus className="size-4 text-primary" />,
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
          icon: <User className="size-4 text-muted-foreground" />,
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
            icon: <n.icon className="size-4 text-muted-foreground" />,
            label: `Go to ${n.name}`,
            action: () => { router.push(`/dashboard/w/${currentWorkspaceId}/${n.path}`); setOpen(false); }
          });
        });
      }

      scopeProjects.filter(p => fuzzyMatch(`go to open project ${p.name}`, q)).slice(0, 5).forEach(p => {
        list.push({
          id: `proj-${p.id}`,
          group: "Projects",
          icon: <Folder className="size-4 text-secondary" />,
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
            icon: <Building2 className="size-4 text-success" />,
            label: `Switch to Workspace: ${w.name}`,
            action: () => { router.push(`/dashboard/w/${w.id}`); setOpen(false); }
          });
        });
      }

      scopeTasks.filter(t => fuzzyMatch(`task edit ${t.title} ${t.status}`, q)).slice(0, 8).forEach(t => {
        list.push({
          id: `task-${t.id}`,
          group: "Manage Specific Tasks",
          icon: <CheckCircle2 className="size-4 text-muted-foreground" />,
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
          icon: <User className="size-4 text-muted-foreground" />,
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
          icon: <CheckCircle2 className="size-4 text-muted-foreground" />,
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
          icon: <Folder className="size-4 text-primary" />,
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
          onClick={() => setOpen(true)}
          title="Open Command Palette"
          className="fixed bottom-6 right-6 z-[90] flex items-center justify-center gap-2 rounded-full border border-border/80 bg-card/90 p-3 text-xs font-bold uppercase tracking-widest text-muted-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-card hover:text-foreground hover:shadow-xl sm:bottom-8 sm:right-8 sm:px-4 sm:py-2.5"
        >
          <Command className="size-5 sm:size-4" />
          <span className="hidden sm:inline">Press</span>
          <span className="hidden rounded bg-muted/80 px-1.5 py-0.5 text-[10px] text-foreground sm:inline dark:bg-surface">
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
            className="absolute inset-0 bg-card/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative mx-4 flex max-h-[65vh] w-full max-w-[640px] transform flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
            
            {/* Input Area */}
            <div className="flex items-center border-b border-border px-4 py-4">
              
              {/* Breadcrumbs for Sub-menus */}
              {view.type !== "root" ? (
                 <div className="flex shrink-0 items-center gap-2 mr-2">
                   <button 
                     onClick={() => { setView({type: "root"}); setQuery(""); setSelectedIndex(0); }}
                     className="flex h-6 items-center rounded bg-muted px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                   >
                     Root
                   </button>
                   <span className="text-muted-foreground">/</span>
                   <div className="flex h-6 max-w-[160px] items-center rounded bg-primary/10 px-2 text-xs font-medium text-primary truncate">
                     {view.type === 'task' ? view.task.title : 
                      view.type === 'create' ? 'Create Task' : view.actionLabel}
                   </div>
                 </div>
              ) : (
                <Search className="size-5 text-muted-foreground shrink-0" />
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
                className="ml-2 min-w-0 flex-1 bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground/80"
                disabled={isProcessing}
              />
              {isProcessing ? (
                <div className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent"
                >
                  ESC <span className="hidden sm:inline lowercase font-medium tracking-normal text-[11px]"> to close</span>
                </button>
              )}
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
              {commands.length === 0 ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                Object.entries(groupedCommands).map(([group, items]) => (
                  <div key={group} className="mb-4 last:mb-1">
                    <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-surface dark:text-muted-foreground dark:hover:bg-surface"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`flex size-6 shrink-0 items-center justify-center rounded-md ${isSelected ? "bg-card shadow-sm dark:bg-surface" : ""}`}>
                                {cmd.icon}
                              </div>
                              <span className="truncate font-medium">{cmd.label}</span>
                              {cmd.subtitle && (
                                <span className="truncate text-xs text-muted-foreground hidden sm:inline-block">
                                  — {cmd.subtitle}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary">
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
            <div className="hidden shrink-0 items-center justify-between border-t border-border bg-surface/60 px-4 py-3 text-[11px] text-muted-foreground sm:flex dark:bg-surface/70">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                   <div className="flex items-center gap-0.5">
                     <kbd className="flex h-5 items-center justify-center rounded border border-border bg-card px-1 font-sans shadow-sm">↑</kbd>
                     <kbd className="flex h-5 items-center justify-center rounded border border-border bg-card px-1 font-sans shadow-sm">↓</kbd>
                   </div>
                   <span>Navigate</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <kbd className="flex h-5 items-center justify-center rounded border border-border bg-card px-1.5 font-sans font-medium shadow-sm">↵</kbd>
                   <span>Select</span>
                 </div>
                 {view.type !== "root" && (
                    <div className="flex items-center gap-1.5">
                      <kbd className="flex h-5 items-center justify-center rounded border border-border bg-card px-1.5 font-sans font-medium shadow-sm">Backspace</kbd>
                      <span>Go back</span>
                    </div>
                 )}
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Command className="size-3" /> Zyplo OS
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
