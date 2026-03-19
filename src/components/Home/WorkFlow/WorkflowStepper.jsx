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
    transition: { staggerChildren: 0.1 },
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

    <section 
      className="relative w-full overflow-hidden bg-white py-20 [--feature-dot-color:rgba(15,23,42,0.15)] [--feature-vignette-edge:rgba(255,255,255,1)] dark:bg-[#0B0F19] dark:[--feature-dot-color:rgba(148,163,184,0.25)] dark:[--feature-vignette-edge:rgba(11,15,25,1)] sm:py-24 transition-colors duration-300"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--feature-vignette-edge) 0%, transparent 15%, transparent 85%, var(--feature-vignette-edge) 100%),
          linear-gradient(to bottom, var(--feature-vignette-edge) 0%, transparent 10%, transparent 90%, var(--feature-vignette-edge) 100%),
          radial-gradient(circle at center, var(--feature-dot-color) 1.5px, transparent 1.5px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        backgroundRepeat: "no-repeat, no-repeat, repeat",
      }}
    >
      

      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-[120px] dark:bg-primary/15" />

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* --- Section Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center md:text-left"
        >
          <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide">
            Workflow
          </p>
          <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
    Plan, build, and ship
  </span>{" "}
  without losing thread
</h2>
        </motion.div>

        {/* --- Main Boxed Layout --- */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          
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
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-6 text-left transition-all duration-300 backdrop-blur-md
                    ${
                      isActive
                        ? "border-blue-500 bg-white/90 ring-1 ring-primary shadow-xl dark:border-blue-500/50 dark:bg-[#111827]/80 dark:ring-primary/50 dark:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        : "border-border bg-white/50 hover:bg-white/80 dark:border-white/5 dark:bg-[#0B0F19]/60 dark:hover:border-white/10 dark:hover:bg-white/5"
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
                        <CheckCircle2 className="h-6 w-6 text-primary dark:text-blue-400" />
                      </motion.div>
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground dark:text-gray-600 group-hover:text-muted-foreground" />
                    )}
                  </div>

                  {/* Text */}
                  <div>
                    <span
                      className={`block text-base font-semibold transition-colors duration-200 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.stepNumber}. {step.title}
                    </span>
                    <span
                      className={`block text-sm transition-colors duration-200 ${isActive ? "text-foreground dark:text-muted-foreground" : "text-muted-foreground dark:text-muted-foreground"}`}
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
            className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white/80 backdrop-blur-xl shadow-2xl h-full dark:border-white/10 dark:bg-[#111827]/80"
          >
            <div className="p-8 flex flex-col h-full relative z-10">
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
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-3 transition-colors">
                    {activeStep.content.heading}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 transition-colors">
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
                        className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground dark:border-white/10 dark:bg-white/5 dark:text-muted-foreground transition-colors"
                      >
                        {badge}
                      </motion.span>
                    ))}
                  </div>

                  {/* --- Inner Preview Box --- */}
                  <div className="mt-auto rounded-xl border border-border bg-surface/50 p-6 dark:border-white/5 dark:bg-black/30 transition-colors">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                        {activeStep.content.previewTitle}
                      </span>
                      <span className="text-[10px] lowercase tracking-wider text-muted-foreground">
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
                          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm dark:border-white/5 dark:bg-white/5 dark:text-muted-foreground transition-colors"
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
