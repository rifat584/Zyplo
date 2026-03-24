"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainContainer from "@/components/container/MainContainer";

const faqs = [
  {
    question: "What is Zyplo?",
    answer:
      "Zyplo is a modern project management tool that helps teams plan tasks, track progress, and collaborate in real-time.",
  },
  {
    question: "Who can use Zyplo?",
    answer:
      "Startups, agencies, remote teams, and enterprises can use Zyplo to manage projects efficiently.",
  },
  {
    question: "Does Zyplo offer collaboration features?",
    answer:
      "Yes. You can assign tasks, set deadlines, track progress, comment on tasks, and manage team roles.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, Zyplo offers a free plan with essential features. Paid plans unlock advanced analytics and integrations.",
  },
  {
    question: "How secure is Zyplo?",
    answer:
      "Zyplo uses secure cloud infrastructure and encrypted connections to keep your data protected.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-background py-20 pb-24 sm:py-24 sm:pb-28">
      <MainContainer className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            A quick read on pricing, collaboration, security, and who Zyplo is
            built for.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                viewport={{ once: true }}
                className={`overflow-hidden rounded-[1.4rem] border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/15 bg-card/78 shadow-sm"
                    : "border-border/70 bg-card/68"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="text-base font-semibold text-foreground sm:text-lg">
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 text-lg font-semibold text-secondary"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </MainContainer>
    </section>
  );
}
