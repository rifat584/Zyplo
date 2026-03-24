"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, FileText, Play, Square } from "lucide-react";
import MainContainer from "@/components/container/MainContainer";

const timeTrackingData = {
  currentTask: "Fix login redirect bug",
  runningTime: "01:24:39",
  weeklyTotal: "24h 35m",
  trend: "+11%",
  bars: [25, 40, 35, 75, 50, 45, 65],
  entries: [
    { task: "Fix login redirect bug", when: "Today 10:32", duration: "25m" },
    { task: "Refactor auth middleware", when: "Today 09:08", duration: "42m" },
    { task: "Sprint planning notes", when: "Yesterday", duration: "17m" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function TimeTracking() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.16),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.7),transparent_32%,rgba(255,255,255,0.8))] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.14),transparent_30%),linear-gradient(to_bottom,rgba(2,6,23,0.92),transparent_34%,rgba(2,6,23,0.96))]" />

        <motion.div
          animate={
            !shouldReduceMotion
              ? { x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }
              : undefined
          }
          transition={
            !shouldReduceMotion
              ? { duration: 16, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          className="absolute -left-36 top-0 h-[420px] w-[420px] rounded-full bg-secondary/14 blur-[120px]"
        />

        <motion.div
          animate={
            !shouldReduceMotion
              ? { x: [0, -70, 0], y: [0, 45, 0], scale: [1, 1.12, 1] }
              : undefined
          }
          transition={
            !shouldReduceMotion
              ? { duration: 18, repeat: Infinity, ease: "easeInOut" }
              : undefined
          }
          className="absolute -bottom-28 right-0 h-[440px] w-[440px] rounded-full bg-primary/14 blur-[130px]"
        />
      </div>

      <MainContainer className="relative z-10 px-6">
        <div className="rounded-[2.4rem] border border-border/70 bg-card/45 p-6 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.32)] backdrop-blur-sm sm:p-10">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              Timer-first logging{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                that feels built into the board
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Capture focused work without leaving flow, then let reports,
              sprint summaries, and timesheets update themselves in the
              background.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 lg:grid-cols-3 lg:gap-5"
          >
            <motion.div
              variants={cardVariants}
              className="relative col-span-1 overflow-hidden rounded-[1.9rem] border border-border/70 bg-background/78 p-8 shadow-sm backdrop-blur-sm lg:col-span-2"
            >
              <div className="pointer-events-none absolute inset-x-10 top-0 h-20 bg-linear-to-b from-secondary/12 to-transparent blur-2xl" />
              <div className="relative z-10 mb-8 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Current task
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    {timeTrackingData.currentTask}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  Running
                </span>
              </div>

              <div className="flex flex-col items-center gap-10 sm:flex-row">
                <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card/80 shadow-inner">
                  <motion.div
                    animate={
                      !shouldReduceMotion
                        ? { scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }
                        : undefined
                    }
                    transition={
                      !shouldReduceMotion
                        ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        : undefined
                    }
                    className="absolute inset-0 rounded-full border border-primary/25"
                  />
                  <div className="absolute inset-3 rounded-full border border-border/70" />
                  <span className="z-10 text-2xl font-mono font-bold tracking-wider text-foreground">
                    {timeTrackingData.runningTime}
                  </span>
                </div>

                <div className="w-full flex-1 space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90">
                      <Play size={16} fill="currentColor" />
                      Start
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/85 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/70">
                      <Square size={16} fill="currentColor" />
                      Stop
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/80">
                      <motion.div
                        initial={{ width: "0%" }}
                        whileInView={{ width: "65%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary to-secondary"
                      />
                    </div>
                    <p className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Session progress</span>
                      <span>Synced to sprint</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="flex flex-col justify-between rounded-[1.9rem] border border-border/70 bg-background/78 p-6 shadow-sm backdrop-blur-sm"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Weekly total
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-foreground">
                    {timeTrackingData.weeklyTotal}
                  </p>
                  <p className="rounded-md bg-success/10 px-2 py-0.5 text-sm font-semibold text-success">
                    {timeTrackingData.trend}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex h-24 items-end justify-between gap-2">
                {timeTrackingData.bars.map((height, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: 0.2 + idx * 0.05,
                    }}
                    className="w-full max-w-[14px] cursor-pointer rounded-t-md bg-gradient-to-t from-primary to-secondary opacity-80 transition-opacity hover:opacity-100"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="rounded-[1.9rem] border border-border/70 bg-background/78 p-6 shadow-sm backdrop-blur-sm"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Recent entries
              </p>
              <div className="space-y-3">
                {timeTrackingData.entries.map((entry) => (
                  <div
                    key={`${entry.task}-${entry.when}`}
                    className="group flex flex-col gap-1.5 rounded-2xl border border-border/60 bg-card/75 p-3 transition-all duration-300 hover:border-primary/15 hover:bg-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {entry.task}
                      </span>
                      <span className="text-sm font-mono font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {entry.duration}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {entry.when}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="col-span-1 flex flex-col justify-center rounded-[1.9rem] border border-border/70 bg-background/78 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:col-span-2"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Built-in productivity
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-info/10 text-info">
                      <Clock size={14} strokeWidth={2.5} />
                    </div>
                    Global Timer Access
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Start, stop, or pause your timer from anywhere in the app
                    using the command palette or sticky navbar. Say goodbye to
                    context switching.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-success">
                      <FileText size={14} strokeWidth={2.5} />
                    </div>
                    Automated Timesheets
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Every tracked minute is instantly synced to your task,
                    automatically generating accurate daily and weekly reports
                    for invoicing and sprint reviews.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </MainContainer>
    </section>
  );
}
