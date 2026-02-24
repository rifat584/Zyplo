"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Play } from "lucide-react";

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <div>
        <motion.h1 variants={itemVariants} className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Good morning, Ebrahim
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You have 4 active issues across 2 projects today.
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Widget 1: Up Next */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Up Next For You</h2>
          
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-white/5 dark:bg-white/5 dark:hover:border-cyan-500/30">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-cyan-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                      {i === 1 ? "Implement Auth Middleware" : "Fix Navbar Hydration Error"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">ZYP-{10 + i} • High Priority</p>
                  </div>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white">
                  <Play size={14} className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Widget 2: Weekly Time Tracked */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Clock size={16} /> Time Tracked
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">12<span className="text-xl text-gray-400">h</span> 45<span className="text-xl text-gray-400">m</span></h3>
            <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 inline-flex px-2 py-0.5 rounded">
              +2.5h this week
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}