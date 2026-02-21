"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

// --- Data Configuration  ---
const workflowSteps = [
  {
    id: "plan",
    stepNumber: "1",
    title: "Plan",
    subtitle: "Align scope before code",
    content: {
      heading: "Plan",
      description:
        "Define your roadmap, create issues, and align the team before writing a single line of code.",
      badges: ["Roadmap view", "Issue tracking", "Spec editor"],
      previewTitle: "Backlog",
      previewItems: [
        "Q3 Performance Goals",
        "User Authentication Flow",
        "Database Schema Design",
      ],
    },
  },
  {
    id: "build",
    stepNumber: "2",
    title: "Build",
    subtitle: "Ship through focused flow",
    content: {
      heading: "Build",
      description:
        "Move tasks across Kanban with live updates and no standup guesswork.",
      badges: ["WIP awareness", "Live updates", "Priority surfacing"],
      previewTitle: "In Progress Lane",
      previewItems: [
        "Fix OAuth callback",
        "Edge cache invalidation",
        "Command filter logic",
      ],
    },
  },
  {
    id: "ship",
    stepNumber: "3",
    title: "Ship",
    subtitle: "Review with confidence",
    content: {
      heading: "Ship",
      description:
        "Close sprint loops with checklist status, deployment readiness, and clean handoff.",
      badges: ["QA checklist", "Release notes", "Deploy ready"],
      previewTitle: "Release Review",
      previewItems: ["Tests passing", "No blockers", "Deploy ready"],
    },
  },
  {
    id: "measure",
    stepNumber: "4",
    title: "Measure",
    subtitle: "Track impact instantly",
    content: {
      heading: "Measure",
      description:
        "Monitor feature adoption and system health with real-time analytics and error logging.",
      badges: ["Usage metrics", "Error tracking", "Performance insights"],
      previewTitle: "Live Analytics",
      previewItems: [
        "99.99% Uptime",
        "Avg. Latency < 50ms",
        "Zero critical errors",
      ],
    },
  },
  {
    id: "scale",
    stepNumber: "5",
    title: "Scale",
    subtitle: "Grow without limits",
    content: {
      heading: "Scale",
      description:
        "Automate repetitive workflows and expand global infrastructure to handle increased load.",
      badges: ["Auto-scaling", "Global distribution", "Workflow automation"],
      previewTitle: "Infrastructure",
      previewItems: [
        "5 Regions active",
        "Auto-scale enabled",
        "Database optimized",
      ],
    },
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Staggers the appearance of the buttons
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

export default function WorkflowStepper() {
  const [activeTab, setActiveTab] = useState("ship");

  const activeStep =
    workflowSteps.find((step) => step.id === activeTab) || workflowSteps[0];

  return (
    <section className="w-full py-20 dark:bg-blue overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- Section Header (Animated) --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide">
            Workflow
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
  Plan, build, and ship{" "}
  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
    without losing thread
  </span>
</h2>
        </motion.div>

        {/* --- Main Boxed Layout --- */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* === LEFT COLUMN: Navigation Buttons === */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col gap-4"
          >
            {workflowSteps.map((step) => {
              const isActive = activeTab === step.id;
              return (
                <motion.button
                  key={step.id}
                  variants={buttonVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(step.id)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-6 text-left transition-colors duration-200 
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {/* Icon */}
                  <div className="shrink-0">
                    {isActive ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-blue-500" />
                      </motion.div>
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300 group-hover:text-gray-400" />
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <span
                      className={`block text-base font-semibold ${isActive ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {step.stepNumber}. {step.title}
                    </span>
                    <span
                      className={`block text-sm transition-colors duration-200 ${isActive ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* === RIGHT COLUMN: Content Card === */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full"
          >
            <div className="p-8 flex flex-col h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col h-full"
                >
                  {/* Heading */}
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                    {activeStep.content.heading}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {activeStep.content.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {activeStep.content.badges.map((badge, idx) => (
                      <motion.span
                        key={badge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>

                  {/* --- Inner Preview Box --- */}
                  <div className="mt-auto rounded-xl border border-gray-100 bg-gray-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {activeStep.content.previewTitle}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono lowercase tracking-wider">
                        live preview
                      </span>
                    </div>

                    {/* List Items inside Preview */}
                    <div className="space-y-3">
                      {activeStep.content.previewItems.map((item, idx) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (idx * 0.1) }}
                          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}