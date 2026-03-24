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
    <section className="relative bg-background py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1),transparent_62%)]" />

      <MainContainer className="relative px-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-border/70 bg-card/46 px-4 py-10 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:px-8 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_center,rgba(15,23,42,0.08)_1.2px,transparent_1.2px)] [background-size:28px_28px] dark:[background-image:radial-gradient(circle_at_center,rgba(148,163,184,0.14)_1.2px,transparent_1.2px)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[120px]" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="mb-14 max-w-2xl"
            >
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
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
                          ? "border-primary/20 bg-background/88 shadow-[0_20px_40px_-30px_rgba(15,23,42,0.45)] ring-1 ring-primary/10"
                          : "border-border/70 bg-background/62 hover:border-primary/15 hover:bg-card/75"
                      }`}
                    >
                      <div className="shrink-0">
                        {isActive ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
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
                className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-background/78 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)] backdrop-blur-sm"
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

                    <div className="mb-8 mt-6 grid gap-3 sm:grid-cols-3">
                      {activeStep.content.badges.map((badge) => (
                        <div
                          key={badge}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="size-1.5 shrink-0 rounded-full bg-secondary/75" />
                          {badge}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto rounded-[1.5rem] border border-border/70 bg-card/72 p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          {activeStep.content.previewTitle}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Live preview
                        </span>
                      </div>

                      <div className="space-y-3">
                        {activeStep.content.previewItems.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/75 px-4 py-3 text-sm text-foreground shadow-sm"
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
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
