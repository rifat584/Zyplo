"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "5,000+", label: "Teams Using Zyplo" },
  { number: "2M+", label: "Tasks Automated" },
  { number: "98%", label: "Customer Satisfaction" },
  { number: "50+", label: "Integrations Available" },
];

export default function Stats() {
  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-slate-50 dark:bg-[#050505] transition-colors duration-500">

      <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-slate-50 to-transparent dark:from-black dark:to-transparent pointer-events-none z-0" />


      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-50 bg-blue-400/20 dark:bg-indigo-600/20 blur-[100px] rounded-[100%]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-px bg-linear-to-r from-transparent via-blue-400/50 to-transparent dark:via-cyan-400/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* --- Section Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-heading font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Zyplo by the{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">
              Numbers
              <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-linear-to-r from-blue-600/50 to-cyan-500/50 dark:from-indigo-400/50 dark:to-cyan-300/50 blur-[2px]" />
            </span>
          </h2>
          <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted by engineering teams worldwide to ship faster, stay aligned, and maintain absolute focus.
          </p>
        </motion.div>

        {/* --- The Glass Monolith --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          // A single, massive frosted glass container
          className="relative rounded-[2.5rem] bg-white/40 dark:bg-[#0B0F19]/60 border border-gray-200/60 dark:border-white/10 backdrop-blur-2xl shadow-2xl shadow-blue-900/5 dark:shadow-[0_0_60px_rgba(59,130,246,0.05)] overflow-hidden"
        >
          {/* Subtle animated shimmer effect across the entire monolith */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite] pointer-events-none" />

          {/* Connected Grid System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200/60 dark:divide-white/10 relative z-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                viewport={{ once: true }}
                className="group relative px-8 py-12 flex flex-col items-center justify-center text-center transition-colors hover:bg-white/50 dark:hover:bg-white/[0.02]"
              >
                {/* Techy top indicator dot */}
                <div className="absolute top-6 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-blue-500/20 dark:bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-0.5 w-0.5 rounded-full bg-blue-600 dark:bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>

                {/* Number */}
                <h3 className="text-5xl lg:text-6xl font-heading font-black tracking-tight text-gray-900 dark:text-white mb-3 group-hover:scale-105 transition-transform duration-500">
                  {stat.number}
                </h3>
                
                {/* Label */}
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600/80 dark:text-cyan-400/70 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors duration-300">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}} />
    </section>
  );
}