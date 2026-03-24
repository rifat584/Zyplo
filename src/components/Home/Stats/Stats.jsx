"use client";

import { motion } from "framer-motion";
import MainContainer from "@/components/container/MainContainer";

const stats = [
  { number: "5,000+", label: "Teams using Zyplo" },
  { number: "2M+", label: "Tasks automated" },
  { number: "98%", label: "Customer satisfaction" },
  { number: "50+", label: "Integrations available" },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-52 w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <MainContainer className="relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
            Zyplo by the numbers
          </h2>
          <p className="marketing-copy mt-4 text-sm leading-6 sm:text-base">
            A quick read on the scale, adoption, and consistency teams expect
            when they run day-to-day work through Zyplo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-[1.8rem] border border-border/70 bg-card/70 p-8 text-center shadow-sm backdrop-blur-sm"
            >
              <p className="marketing-subtle text-sm font-semibold uppercase tracking-[0.22em]">
                {stat.label}
              </p>
              <h3 className="mt-5 text-5xl font-heading font-black tracking-tight text-foreground lg:text-6xl">
                {stat.number}
              </h3>
            </motion.article>
          ))}
        </motion.div>
      </MainContainer>
    </section>
  );
}
