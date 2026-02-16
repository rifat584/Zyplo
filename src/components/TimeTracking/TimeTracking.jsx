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

export default function TimeTracking() {
  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-primary/5 via-white to-secondary/10 p-6 sm:p-8">
          
          {/* Header */}
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide">
              Time Tracking & Worklog
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Timer-first logging that feels built into the board
            </h2>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid gap-4 lg:grid-cols-3">
            
            {/* === 1. Main Timer Card (Spans 2 columns) === */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500">Current task</p>
                  <p className="text-base font-semibold text-gray-900">
                    {timeTrackingData.currentTask}
                  </p>
                </div>
                {/* Running Badge */}
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                  Running
                </span>
              </div>

              <div className="flex flex-col items-center gap-8 sm:flex-row">
                
                {/* Circular Timer UI */}
                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
                  {/* Pulsing Ring Animation - Uses Primary Color */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                  />
                  {/* Inner Static Ring */}
                  <div className="absolute inset-2 rounded-full border border-primary/10" />
                  
                  {/* Timer Text */}
                  <span className="z-10 text-2xl font-mono font-bold text-gray-900 tracking-wider">
                    {timeTrackingData.runningTime}
                  </span>
                </div>

                {/* Controls & Progress */}
                <div className="flex-1 w-full space-y-4">
                  <div className="flex gap-3">
                    {/* Start Button - Primary Color */}
                    <button className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-primary transition-colors">
                      <Play size={14} fill="currentColor" /> Start
                    </button>
                    {/* Stop Button */}
                    <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Square size={14} fill="currentColor" /> Stop
                    </button>
                  </div>
                  
                  {/* Progress Bar - Uses Secondary Color */}
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: "65%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="absolute inset-y-0 left-0 bg-secondary rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    session synced to sprint analytics
                  </p>
                </div>
              </div>
            </motion.div>

            {/* === 2. Weekly Total Card (Top Right) === */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm"
            >
              <p className="text-xs font-medium text-gray-500">Weekly total</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {timeTrackingData.weeklyTotal}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-600">
                {timeTrackingData.trend} <span className="text-gray-400">vs last week</span>
              </p>

              {/* Bar Chart Visualization - Gradient from Primary to Secondary */}
              <div className="mt-6 flex items-end justify-between gap-2 h-16">
                {timeTrackingData.bars.map((height, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: "10%" }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="w-full max-w-[12px] rounded-sm bg-gradient-to-t from-primary to-secondary"
                  />
                ))}
              </div>
            </motion.div>

            {/* === 3. Recent Entries (Bottom Left) === */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm"
            >
              <p className="mb-4 text-xs font-medium text-gray-500">Recent worklog entries</p>
              <div className="space-y-2">
                {timeTrackingData.entries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="group flex flex-col gap-1 rounded-lg border border-transparent bg-gray-50 p-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {entry.task}
                      </span>
                      <span className="text-xs text-gray-500">
                        {entry.duration}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {entry.when}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* === 4. Export Card (Bottom Right) === */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="col-span-1 lg:col-span-2 flex flex-col justify-between rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="mb-4 sm:mb-0">
                <p className="text-xs font-medium text-gray-500">Worklog export</p>
                <p className="text-sm font-semibold text-gray-900">
                  CSV ready for sprint review
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <Download size={14} /> Export CSV
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}