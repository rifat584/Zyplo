"use client";

import { useMemo, useState } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  EASE,
  integrations,
  kanbanColumns,
  notificationToggles,
  projects,
  roles,
} from "./data";
import SectionHeader from "./ui/SectionHeader";
import LivingDashboard from "./dashboard/LivingDashboard";

export default function FeatureSection() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 10]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 6]);

  const [selectedTaskId, setSelectedTaskId] = useState("task-sync-race");
  const [activeColumn, setActiveColumn] = useState("in-progress");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("tasks");

  const allTasks = useMemo(
    () => kanbanColumns.flatMap((column) => column.tasks.map((task) => ({ ...task, columnId: column.id }))),
    [],
  );

  const selectedTask = allTasks.find((task) => task.id === selectedTaskId) ?? allTasks[0];

  const handleTaskSelect = (taskId, columnId) => {
    setSelectedTaskId(taskId);
    setActiveColumn(columnId);
  };

  return (
    <section
      aria-labelledby="living-dashboard-features-heading"
      className="relative overflow-hidden bg-white py-16 dark:bg-slate-950 sm:py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_14%_8%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_88%_2%,rgba(59,130,246,0.14),transparent_34%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader />
        <LivingDashboard
          fgY={fgY}
          bgY={bgY}
          reducedMotion={reducedMotion}
          ease={EASE}
          selectedTask={selectedTask}
          selectedTaskId={selectedTaskId}
          activeColumn={activeColumn}
          isDrawerOpen={isDrawerOpen}
          mobileTab={mobileTab}
          allTasks={allTasks}
          projects={projects}
          notificationToggles={notificationToggles}
          roles={roles}
          integrations={integrations}
          onMobileTabChange={setMobileTab}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onCloseDrawer={() => setIsDrawerOpen(false)}
          onTaskSelect={handleTaskSelect}
          onColumnSelect={setActiveColumn}
        />
      </div>
    </section>
  );
}
