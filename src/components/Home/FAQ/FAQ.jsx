"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Zyplo?",
    answer:
      "Zyplo is a modern project management tool that helps teams plan tasks, track progress, and collaborate in real-time."
  },
  {
    question: "Who can use Zyplo?",
    answer:
      "Startups, agencies, remote teams, and enterprises can use Zyplo to manage projects efficiently."
  },
  {
    question: "Does Zyplo offer collaboration features?",
    answer:
      "Yes. You can assign tasks, set deadlines, track progress, comment on tasks, and manage team roles."
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, Zyplo offers a free plan with essential features. Paid plans unlock advanced analytics and integrations."
  },
  {
    question: "How secure is Zyplo?",
    answer:
      "Zyplo uses secure cloud infrastructure and encrypted connections to keep your data protected."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-[#0B0f19] py-20 transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Have questions? We’ve got answers.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="
                rounded-xl p-6 cursor-pointer transition-all duration-300
                bg-gray-50 dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                hover:shadow-lg dark:hover:shadow-indigo-500/10
              "
              onClick={() => toggle(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {faq.question}
                </h3>

                {/* Rotate Icon */}
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-sky-500"
                >
                  +
                </motion.span>
              </div>

              {/* Animated Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed overflow-hidden"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}