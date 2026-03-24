"use client";
import { motion } from "framer-motion";
import { FeatureGrid } from "./FeatureGrid";
import MainContainer from "@/components/container/MainContainer";

export default function FeatureSection() {
  return (
    <MainContainer className="px-6 pb-16 sm:pb-20">
      <section
        className="overflow-hidden rounded-[2.25rem] border border-border/70 bg-card/45 py-14 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] backdrop-blur-sm [--feature-grid-color:rgba(15,23,42,0.08)] [--feature-vignette-edge:rgba(255,255,255,0.92)] dark:[--feature-grid-color:rgba(148,163,184,0.18)] dark:[--feature-vignette-edge:rgba(5,10,23,0.96)] sm:py-16"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--feature-vignette-edge) 0%, transparent 16%, transparent 84%, var(--feature-vignette-edge) 100%),
            linear-gradient(to bottom, var(--feature-vignette-edge) 0%, transparent 16%, transparent 84%, var(--feature-vignette-edge) 100%),
            linear-gradient(to right, var(--feature-grid-color, rgba(15,23,42,0.05)) 1px, transparent 1px),
            linear-gradient(to bottom, var(--feature-grid-color, rgba(15,23,42,0.05)) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 44px 44px, 44px 44px",
          backgroundRepeat: "no-repeat, no-repeat, repeat, repeat",
        }}
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
              Plan, track, and ship together
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Everything your team ships{" "}
              <span className="relative inline-block">
                in one place
                <span className="absolute left-0 -bottom-1 h-0.75 w-full rounded-full bg-linear-to-r from-primary to-secondary" />
              </span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              Tasks, projects, docs, and delivery context aligned without
              losing the thread across your product stack.
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>
    </MainContainer>
  );
}
