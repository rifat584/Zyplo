"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import HeroAppMock from "./HeroAppMock";

const features = [
  "Fast Kanban workflows for dev teams",
  "Keyboard-first command palette",
  "Clear priorities, deadlines, and ownership",
  "Real-time collaboration and activity logs",
];

const headline = ["Plan faster.", "Ship better."];

export default function Hero() {
  return (
    <section className="relative z-10 overflow-hidden py-16 sm:py-24 bg-white dark:bg-[#0B0F19]">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-secondary/15 dark:bg-secondary/10" />

      <div className="max-w-7xl mx-auto px-6 grid items-center gap-12 lg:grid-cols-2">
        {/* Left content */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.1 },
            },
          }}
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0 },
            }}
            className="inline-block mb-4 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            Built for modern dev teams
          </motion.span>

          <motion.h1
            className="text-4xl font-heading font-bold tracking-tight sm:text-5xl lg:text-6xl
             text-gray-900 dark:text-gray-100"
          >
            {headline.map((line, i) => (
              <motion.span
                key={i}
                className={`block ${i === 1
                    ? "text-transparent bg-clip-text bg-size-[200%_200%] bg-linear-to-r from-indigo-400 via-cyan-300 to-indigo-400"
                    : ""
                  }`}
                animate={
                  i === 1
                    ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                    : {}
                }
                transition={
                  i === 1
                    ? { duration: 2, ease: "easeInOut", repeat: Infinity }
                    : {}
                }
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            className="mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            Zyplo is a developer-focused project management tool with Kanban
            boards, smart priorities, and lightning-fast navigation for teams
            that ship.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            className="mt-6 space-y-2"
          >
            {features.map((item) => (
              <p
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 "
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </p>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0 },
            }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register"
              className="inline-flex items-center justify-center 
              px-6 py-3 rounded-lg font-semibold text-white
              bg-linear-to-br from-indigo-500 to-cyan-400
              shadow-lg shadow-indigo-500/20
              transition-all duration-300
              hover:scale-[1.03] hover:shadow-indigo-500/40
              active:scale-95"
            >
              Get started free
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-primary dark:hover:bg-surface"
            >
              View demo
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right mock UI */}
        <HeroAppMock />
      </div>
    </section>
  );
}
