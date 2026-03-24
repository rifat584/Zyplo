"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import MainContainer from "@/components/container/MainContainer";

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
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
};

export default function WorkflowStepper() {
  const [activeTab, setActiveTab] = useState("ship");

  const activeStep =
    workflowSteps.find((step) => step.id === activeTab) || workflowSteps[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-background py-16 [--workflow-dot-color:rgba(15,23,42,0.08)] [--workflow-vignette-edge:rgba(255,255,255,0.96)] dark:[--workflow-dot-color:rgba(148,163,184,0.16)] dark:[--workflow-vignette-edge:rgba(5,10,23,0.96)] sm:py-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--workflow-vignette-edge) 0%, transparent 15%, transparent 85%, var(--workflow-vignette-edge) 100%),
          linear-gradient(to bottom, var(--workflow-vignette-edge) 0%, transparent 10%, transparent 90%, var(--workflow-vignette-edge) 100%),
          radial-gradient(circle at center, var(--workflow-dot-color) 1.3px, transparent 1.3px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        backgroundRepeat: "no-repeat, no-repeat, repeat",
      }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[540px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[120px]" />

      <MainContainer className="relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <span className="inline-flex rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
            Workflow
          </span>
          <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Plan, build, and ship
            </span>{" "}
            without losing thread
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Keep the whole delivery cycle visible from one place, from early
            planning to release confidence and ongoing product impact.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <motion.div
            variants={containerVariants}
            initial={false}
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
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveTab(step.id)}
                  className={`group relative flex w-full items-center gap-4 rounded-[1.5rem] border p-5 text-left transition-all duration-300 backdrop-blur-sm ${
                    isActive
                      ? "border-primary/20 bg-card/88 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.45)] ring-1 ring-primary/10"
                      : "border-border/70 bg-background/65 hover:border-primary/15 hover:bg-card/75"
                  }`}
                >
                  <div className="shrink-0">
                    {isActive ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="size-6 text-success" />
                      </motion.div>
                    ) : (
                      <Circle className="size-6 text-muted-foreground/70 transition-colors group-hover:text-primary/70" />
                    )}
                  </div>

                  <div>
                    <span
                      className={`block text-base font-semibold transition-colors duration-200 ${
                        isActive ? "text-foreground" : "text-foreground/85"
                      }`}
                    >
                      {step.stepNumber}. {step.title}
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {step.subtitle}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card/72 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)] backdrop-blur-sm"
          >
            <div className="pointer-events-none absolute inset-x-12 top-0 h-20 bg-linear-to-b from-secondary/12 to-transparent blur-2xl" />
            <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
              <motion.div
                key={activeStep.id}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex h-full flex-col"
              >
                <h3 className="text-2xl font-heading font-bold text-foreground">
                  {activeStep.content.heading}
                </h3>

                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                  {activeStep.content.description}
                </p>

                <div className="mb-8 mt-6 flex flex-wrap gap-2">
                  {activeStep.content.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full border border-info/20 bg-info/10 px-3 py-1 text-xs font-medium text-info"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-auto rounded-[1.5rem] border border-border/70 bg-background/72 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {activeStep.content.previewTitle}
                    </span>
                    <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary">
                      Live preview
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeStep.content.previewItems.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/75 px-4 py-3 text-sm text-foreground shadow-sm"
                      >
                        <span className="size-2 shrink-0 rounded-full bg-success" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </MainContainer>
    </section>
  );
}
