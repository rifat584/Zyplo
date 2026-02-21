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
    <section className="bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-gray-900 mb-12"
        >
          Zyplo by the Numbers
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-3xl font-bold text-indigo-500 mb-2">{stat.number}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}