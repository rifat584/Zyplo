"use client";

import { motion } from "framer-motion";
import MainContainer from "@/components/container/MainContainer";

const automationCards = [
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
];

export default function Automation() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <MainContainer className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            Smart workflow automation
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Keep repetitive work moving in the background so your team can stay
            focused on planning, building, and shipping.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {automationCards.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-[1.6rem] border border-border/70 bg-card/72 p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-5 text-3xl text-secondary">{item.icon}</div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {item.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </MainContainer>
    </section>
  );
}
