import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import {
  activityItems,
  docsPreviewLines,
  kanbanColumns,
  mobileTourTabs,
} from "../data";
import BackgroundDashboardLayer from "./BackgroundDashboardLayer";
import KanbanBoard from "./KanbanBoard";
import SelectedTaskPanel from "./SelectedTaskPanel";
import TaskDetailDrawer from "./TaskDetailDrawer";
import TasksPanel from "../sidepanels/TasksPanel";
import DocsPanel from "../sidepanels/DocsPanel";
import ActivityPanel from "../sidepanels/ActivityPanel";
import ProjectsCard from "../bottomrow/ProjectsCard";
import NotificationsCard from "../bottomrow/NotificationsCard";
import RolesIntegrationsCard from "../bottomrow/RolesIntegrationsCard";

export default function LivingDashboard({
  fgY,
  bgY,
  reducedMotion,
  selectedTask,
  selectedTaskId,
  activeColumn,
  isDrawerOpen,
  mobileTab,
  allTasks,
  projects,
  notificationToggles,
  roles,
  integrations,
  onMobileTabChange,
  onToggleDrawer,
  onCloseDrawer,
  onTaskSelect,
  onColumnSelect,
}) {
  const mobileColumn = kanbanColumns.find((column) => column.id === activeColumn) ?? kanbanColumns[0];

  return (
    <motion.div style={{ y: fgY }} className="relative mt-8 space-y-4 overflow-hidden sm:mt-10 sm:space-y-6">
      <BackgroundDashboardLayer bgY={bgY} />

      <div className="space-y-4 sm:hidden">
        <article className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center justify-between"><h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Kanban Boards</h3><button type="button" onClick={onToggleDrawer} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Preview task</button></div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">{kanbanColumns.map((column) => <button key={column.id} type="button" onClick={() => onColumnSelect(column.id)} className={`min-h-10 rounded-md px-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${activeColumn === column.id ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200" : "text-slate-600 dark:text-slate-300"}`}>{column.name}</button>)}</div>
          <div className="mt-3 space-y-2"><KanbanBoard columns={[mobileColumn]} activeColumn={activeColumn} selectedTaskId={selectedTaskId} reducedMotion={reducedMotion} onColumnSelect={onColumnSelect} onTaskSelect={onTaskSelect} /></div>
        </article>

        <article className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Feature Tour</h3>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{mobileTourTabs.map((tab) => <button key={tab.id} type="button" onClick={() => onMobileTabChange(tab.id)} className={`min-h-10 shrink-0 rounded-lg border px-3 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${mobileTab === tab.id ? "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"}`}>{tab.label}</button>)}</div>
          <div className="mt-3">{mobileTab === "tasks" && <TasksPanel tasks={allTasks.slice(0, 3)} selectedTaskId={selectedTaskId} onSelectTask={onTaskSelect} />}{mobileTab === "docs" && <DocsPanel docsPreviewLines={docsPreviewLines} />}{mobileTab === "activity" && <ActivityPanel activityItems={activityItems} reducedMotion={reducedMotion} />}{mobileTab === "roles" && <RolesIntegrationsCard roles={roles} integrations={integrations} />}{mobileTab === "notifications" && <NotificationsCard toggles={notificationToggles} minimal />}</div>
        </article>

        <ProjectsCard projects={projects} reducedMotion={reducedMotion} limit={2} />
      </div>

      <div className="hidden space-y-4 sm:block lg:hidden">
        <article className="rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Kanban Boards</p><h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Move from backlog to release without losing context.</h3></div><button type="button" onClick={onToggleDrawer} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Preview task</button></div>
          <KanbanBoard columns={kanbanColumns} activeColumn={activeColumn} selectedTaskId={selectedTaskId} reducedMotion={reducedMotion} onColumnSelect={onColumnSelect} onTaskSelect={onTaskSelect} />
          <div className="mt-4"><SelectedTaskPanel task={selectedTask} compact /></div>
        </article>
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-4"><TasksPanel tasks={allTasks.slice(1, 4)} selectedTaskId={selectedTaskId} onSelectTask={onTaskSelect} /><DocsPanel docsPreviewLines={docsPreviewLines} /></div><div className="space-y-4"><ActivityPanel activityItems={activityItems} reducedMotion={reducedMotion} /><RolesIntegrationsCard roles={roles} integrations={integrations} /></div></div>
        <div className="grid gap-4 md:grid-cols-2"><ProjectsCard projects={projects} reducedMotion={reducedMotion} /><NotificationsCard toggles={notificationToggles} /></div>
      </div>

      <div className="hidden lg:block">
        <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <article className="relative rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-md dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">Kanban Boards</p><h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Move from backlog to release without losing context.</h3></div><button type="button" onClick={onToggleDrawer} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Preview task</button></div>
            <KanbanBoard columns={kanbanColumns} activeColumn={activeColumn} selectedTaskId={selectedTaskId} reducedMotion={reducedMotion} onColumnSelect={onColumnSelect} onTaskSelect={onTaskSelect} />
            <div className="mt-4"><SelectedTaskPanel task={selectedTask} /></div>
            <TaskDetailDrawer open={isDrawerOpen} reducedMotion={reducedMotion} task={selectedTask} onClose={onCloseDrawer} />
          </article>
          <div className="grid gap-4"><TasksPanel tasks={allTasks.slice(1, 4)} selectedTaskId={selectedTaskId} onSelectTask={onTaskSelect} /><DocsPanel docsPreviewLines={docsPreviewLines} /><ActivityPanel activityItems={activityItems} reducedMotion={reducedMotion} /></div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3"><ProjectsCard projects={projects} reducedMotion={reducedMotion} /><NotificationsCard toggles={notificationToggles} /><RolesIntegrationsCard roles={roles} integrations={integrations} /></div>
      </div>

      <TaskDetailDrawer open={isDrawerOpen} reducedMotion={reducedMotion} task={selectedTask} onClose={onCloseDrawer} mobile />
    </motion.div>
  );
}
