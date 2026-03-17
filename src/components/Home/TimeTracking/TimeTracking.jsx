"use client";

import { motion } from "framer-motion";
import { Download, Play, Square } from "lucide-react";

// --- Configuration Data ---
const timeTrackingData = {
  currentTask: "Fix login redirect bug",
  runningTime: "01:24:39",
  weeklyTotal: "24h 35m",
  trend: "+11%",
  // Bar heights for the chart (0-100%)
  bars: [25, 40, 35, 75, 50, 45, 65], 
  entries: [
    { task: "Fix login redirect bug", when: "Today 10:32", duration: "25m" },
    { task: "Refactor auth middleware", when: "Today 09:08", duration: "42m" },
    { task: "Sprint planning notes", when: "Yesterday", duration: "17m" },
  ]
};

// --- Animation Variants ---
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
    transition: { type: "spring", stiffness: 200, damping: 20 } 
  },
};

export default function TimeTracking() {
  return (
    <section className="relative w-full py-20 sm:py-32 overflow-hidden transition-colors duration-500">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base dark/light layer */}
        <div className="absolute inset-0 bg-surface transition-colors duration-500" />
        
        {/* Subtle Diagonal "Time-Track" Slant Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)' }} 
        />

        {/* Animated Aurora Orb 1 (Top Left / Blue) */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-400/30 blur-[120px] dark:bg-primary/20"
        />

        {/* Animated Aurora Orb 2 (Bottom Right / Cyan) */}
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-300/30 blur-[120px] dark:bg-cyan-500/15"
        />

        {/* Animated Aurora Orb 3 (Center / Indigo) */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/20 blur-[150px] dark:bg-primary/10"
        />

        {/* Top/Bottom Fade out masks to blend perfectly with sections above and below */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 dark:from-black dark:via-transparent dark:to-black" />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">

        {/* Premium Outer Bento Wrapper */}
        <div className="rounded-[2.5rem] border border-white/40 bg-white/40 p-6 sm:p-10 shadow-2xl shadow-blue-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-black/20 dark:shadow-none">
          
          {/* Header */}
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-primary dark:text-cyan-400 uppercase tracking-widest drop-shadow-sm">
              Time Tracking & Worklog
            </p>
            <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              Timer-first logging{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-primary dark:to-secondary">
                that feels built into the board
                <span className="absolute left-0 -bottom-2 h-1 w-full rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 dark:from-primary/40 dark:to-secondary/40 blur-[2px]" />
              </span>
            </h2>
          </div>

          {/* Bento Grid Layout */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4 lg:grid-cols-3"
          >
            
            {/* === 1. Main Timer Card (Spans 2 columns) === */}
            <motion.div
              variants={cardVariants}
              className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current task</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {timeTrackingData.currentTask}
                  </p>
                </div>
                {/* Running Badge with pulsing dot */}
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground shadow-sm dark:border-white/10 dark:bg-black/40 dark:text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Running
                </span>
              </div>

              <div className="flex flex-col items-center gap-10 sm:flex-row">
                
                {/* Circular Timer UI */}
                <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white/80 shadow-inner dark:border-white/5 dark:bg-black/50">
                  {/* Pulsing Ring Animation */}
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-blue-500/30 dark:border-cyan-400/30"
                  />
                  {/* Inner Static Ring */}
                  <div className="absolute inset-3 rounded-full border border-border dark:border-white/10" />
                  
                  {/* Timer Text */}
                  <span className="z-10 text-2xl font-mono font-bold text-gray-900 tracking-wider dark:text-white">
                    {timeTrackingData.runningTime}
                  </span>
                </div>

                {/* Controls & Progress */}
                <div className="flex-1 w-full space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {/* Start Button */}
                    <button className="flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-primary hover:shadow-lg hover:shadow-blue-500/30 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-400">
                      <Play size={16} fill="currentColor" /> Start
                    </button>
                    {/* Stop Button */}
                    <button className="flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-surface dark:border-white/10 dark:bg-white/5 dark:text-muted-foreground dark:hover:bg-white/10">
                      <Square size={16} fill="currentColor" /> Stop
                    </button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/50 dark:bg-surface/50">
                      <motion.div
                        initial={{ width: "0%" }}
                        whileInView={{ width: "65%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 dark:from-indigo-500 dark:to-cyan-400"
                      />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground flex justify-between">
                      <span>Session progress</span>
                      <span>Synced to sprint</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* === 2. Weekly Total Card (Top Right) === */}
            <motion.div
              variants={cardVariants}
              className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly total</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-foreground">
                    {timeTrackingData.weeklyTotal}
                  </p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {timeTrackingData.trend}
                  </p>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="mt-8 flex items-end justify-between gap-2 h-24">
                {timeTrackingData.bars.map((height, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: "0%" }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 + (idx * 0.05) }}
                    className="w-full max-w-[14px] rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400 dark:from-indigo-500 dark:to-cyan-400 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </motion.div>

            {/* === 3. Recent Entries (Bottom Left) === */}
            <motion.div
              variants={cardVariants}
              className="rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent entries</p>
              <div className="space-y-3">
                {timeTrackingData.entries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col gap-1.5 rounded-2xl border border-transparent bg-white/50 p-3 transition-all duration-300 hover:border-blue-200 hover:bg-white dark:bg-black/20 dark:hover:border-blue-500/30 dark:hover:bg-white/5 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 group-hover:text-primary dark:text-foreground dark:group-hover:text-blue-400 transition-colors">
                        {entry.task}
                      </span>
                      <span className="text-sm font-mono font-medium text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {entry.duration}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {entry.when}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* === 4. Export Card (Bottom Right) === */}
            <motion.div
              variants={cardVariants}
              className="col-span-1 lg:col-span-2 flex flex-col justify-between rounded-3xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center"
            >
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Worklog export</p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-foreground">
                  CSV ready for sprint review and client invoicing.
                </p>
              </div>
              <button className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:scale-105 hover:border-gray-300 hover:bg-surface dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:bg-white/10">
                <Download size={16} /> Export CSV
              </button>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}