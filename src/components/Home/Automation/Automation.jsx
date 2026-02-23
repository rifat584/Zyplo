"use client";

import { motion } from "framer-motion";

export default function Automation() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Workflow Automation
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
          {/* Card 1 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 
            hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-sky-500 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Task Auto-Assignment
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Automatically assign tasks to team members based on roles,
              workload, or project rules.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 
            hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-sky-500 text-3xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Smart Notifications
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant updates when deadlines approach, tasks change,
              or milestones are completed.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-2xl border border-gray-200 
            hover:border-indigo-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="text-sky-500 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              Automated Reports
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Generate performance reports and project summaries
              automatically with real-time data.
            </p>
          </motion.div>
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