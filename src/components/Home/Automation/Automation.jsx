"use client";

import { motion } from "framer-motion";

export default function Automation() {
  return (
    <section className="bg-white dark:bg-[#0B0f19] py-20 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Workflow Automation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Save time and reduce manual work with Zyplo’s powerful automation.
            Automate tasks, notifications, and project updates effortlessly.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          {/* Card */}
          {[
            {
              icon: "⚡",
              title: "Task Auto-Assignment",
              desc: "Automatically assign tasks to team members based on roles, workload, or project rules.",
            },
            {
              icon: "🔔",
              title: "Smart Notifications",
              desc: "Get instant updates when deadlines approach, tasks change, or milestones are completed.",
            },
            {
              icon: "📊",
              title: "Automated Reports",
              desc: "Generate performance reports and project summaries automatically with real-time data.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl border transition-all duration-300
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              hover:border-indigo-300 dark:hover:border-indigo-500
              hover:shadow-xl dark:hover:shadow-indigo-500/10"
            >
              <div className="text-sky-500 text-3xl mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white
            bg-gradient-to-br from-indigo-500 to-cyan-400
            shadow-lg shadow-indigo-500/20
            transition-all duration-300
            hover:scale-[1.03] hover:shadow-indigo-500/40
            active:scale-95"
          >
            Explore Automation
          </button>
        </motion.div>

      </div>
    </section>
  );
}