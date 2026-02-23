"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function HeroAppMock() {
    const reduced = useReducedMotion();
    const transition = reduced ? { duration: 0 } : { duration: 0.25, ease: "easeOut" };

    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...transition, delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl border
           border-gray-200 dark:border-gray-800
           bg-white/80 dark:bg-[#0F1629]/80
           shadow-2xl backdrop-blur w-full max-w-full lg:max-w-140 mx-auto"
        >
            {/* Top bar */}
            <div className="flex h-12 items-center justify-between border-b
                border-gray-200 dark:border-gray-800
                bg-white/70 dark:bg-[#0F1629]/70 px-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-cyan-400 text-xs font-bold text-white">
                        Z
                    </span>
                    <button className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                        Zyplo / Sprint Board
                        <ChevronDown className="h-3 w-3" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-500 dark:border-gray-700">
                        <Search className="h-3 w-3" />
                        Ctrl + K
                    </div>
                    <Bell className="h-4 w-4 text-gray-500" />
                    <div className="h-7 w-7 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs dark:text-gray-200">
                        EA
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 sm:p-4">
                {["To Do", "In Progress", "Done"].map((col, i) => (
                    <motion.div
                        key={col}
                        initial={reduced ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...transition, delay: 0.1 + i * 0.08 }}
                        className="rounded-lg border border-gray-200 dark:border-gray-800
           bg-gray-50 dark:bg-[#0B1220] p-3"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200">{col}</p>
                            <span className="text-[10px] text-gray-500">3</span>
                        </div>

                        <div className="space-y-2">
                            {[1, 2].map((t) => (
                                <motion.div
                                    key={t}
                                    whileHover={reduced ? {} : { y: -2 }}
                                    className="rounded-md border border-gray-200 dark:border-gray-700
  bg-white dark:bg-[#111A2E]
  hover:bg-gray-100 dark:hover:bg-[#162040]
  transition-colors
  p-2 text-xs text-gray-700 dark:text-gray-200 shadow-sm"
                                >
                                    Improve auth flow #{t}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Floating command palette hint */}
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: 0.35 }}
                className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2
           rounded-lg border border-gray-300 dark:border-gray-700
           bg-white/90 dark:bg-[#0F1629]/90
           px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-lg"
            >
                Press <span className="font-semibold">Ctrl + K</span> to search anything…
            </motion.div>
        </motion.div>
    );
}