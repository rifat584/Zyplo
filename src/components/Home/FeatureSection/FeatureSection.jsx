"use client";
import { motion } from "framer-motion";
import { FeatureGrid } from "./FeatureGrid";
import MainContainer from "@/components/container/MainContainer";

export default function FeatureSection() {
  return (
    <MainContainer className="w-full">
      <section
        className=" max-w-7xl mx-auto overflow-hidden bg-zinc-20/80 py-20 [--feature-grid-color:rgba(15,23,42,0.1)] [--feature-vignette-edge:rgba(255,255,255,0.9)] dark:bg-[#0B0F19] dark:[--feature-grid-color:rgba(148,163,184,0.2)] dark:[--feature-vignette-edge:rgba(11,15,25,0.96)] sm:py-24"
        style={{
          // Lightweight dot-grid texture keeps the section tactile without using images.
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
        <div className="mx-auto w-full max-w-5xl px-4">
          <motion.div
            // Header enters once when near viewport to avoid repeated motion on scroll.
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="text-3xl font-semibold tracking-tight dark:text-gray-100 sm:text-5xl">
              Everything your team ships{" "}
              <span className="relative inline-block">
                in one place
                <span className="absolute left-0 -bottom-1 h-0.75 w-full bg-linear-to-r from-primary to-secondary rounded-full" />
              </span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Tasks, projects, docs, and collaboration - built for teams
              shipping production web apps.
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>
    </MainContainer>
  );
}
