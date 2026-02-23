"use client";
import { motion } from "framer-motion";
import { FeatureGrid } from "./FeatureGrid";
import MainContainer from "@/components/container/MainContainer";
export default function FeatureSection() {
  return (
    <MainContainer>
      <section
        className="overflow-hidden bg-zinc-20/80 py-20 sm:py-24"
        style={{
          // Lightweight dot-grid texture keeps the section tactile without using images.
          backgroundImage: `
            linear-gradient(to right, var(--feature-grid-color, rgba(15,23,42,0.05)) 1px, transparent 1px),
            linear-gradient(to bottom, var(--feature-grid-color, rgba(15,23,42,0.05)) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",

          // Strong center + soft falloff: fades the grid on every edge
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 68% at 50% 50%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.88) 56%, rgba(0,0,0,0.58) 74%, rgba(0,0,0,0.2) 84%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 78% 68% at 50% 50%, rgba(0,0,0,1) 38%, rgba(0,0,0,0.88) 56%, rgba(0,0,0,0.58) 64%, rgba(0,0,0,0.2) 84%, transparent 100%)",
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
            <h2 className="text-3xl font-heading font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              All your workflow - in one place.
            </h2>
            <p className="mt-4 text-sm text-zinc-600 sm:text-base">
              Tasks, projects, docs, collaboration, and planning - built for
              teams shipping real web apps.
            </p>
          </motion.div>
          <FeatureGrid />
        </div>
      </section>
    </MainContainer>
  );
}
