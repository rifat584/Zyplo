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
      previewItems: ["99.99% Uptime",
        "Avg. Latency < 50ms",
        "Zero critical errors",],
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
      previewItems: ["5 Regions active",
        "Auto-scale enabled",
        "Database optimized",],
    },
  },
];

export default function WorkflowStepper() {
  const [activeTab, setActiveTab] = useState("ship"); // Default to 'Ship' to match image

  // Find the active step data
  const activeStep =
    workflowSteps.find((step) => step.id === activeTab) || workflowSteps[0];

  return (
    <section className="w-full dark:bg-blue py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* --- Section Header --- */}
        <div className="mb-16">
          <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide">
            Workflow
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Plan, build, and ship without losing thread
          </h2>
        </div>

        {/* --- Main Boxed Layout --- */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* === LEFT COLUMN: Navigation Buttons === */}
          <div className="flex flex-col gap-4">
            {workflowSteps.map((step) => {
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-6 text-left transition-all duration-200 
                    ${
                      isActive
                        ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" // Active Styles
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50" // Inactive Styles
                    }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <CheckCircle2 className="h-6 w-6 text-blue-500" />
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
                      className={`block text-sm ${isActive ? "text-gray-700" : "text-gray-400"}`}
                    >
                      {step.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* === RIGHT COLUMN: Content Card === */}
          {/* This matches the 'Boxed System' from the image */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full">
            <div className="p-8 flex flex-col h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Heading */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {activeStep.content.heading}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {activeStep.content.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {activeStep.content.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* --- Inner Preview Box --- */}
                  <div className="mt-auto rounded-xl border border-gray-100 bg-gray-50 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {activeStep.content.previewTitle}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono lowercase">
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
                          transition={{ delay: idx * 0.1 }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
