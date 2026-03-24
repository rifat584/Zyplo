"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainContainer from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import rightHeroImg from "../../../../public/right-hero.png";

const features = [
  "Fast Kanban workflows for dev teams",
  "Keyboard-first command palette",
  "Clear priorities, deadlines, and ownership",
  "Real-time collaboration and activity logs",
];

const headline = ["Plan faster.", "Ship better."];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background py-10 sm:py-12 lg:py-16">
      <div className="absolute inset-0 -z-10 bg-secondary/12 dark:bg-secondary/8" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[78%] bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.18),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-b from-transparent to-background" />

      <MainContainer className="grid items-center gap-10 px-6 md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12">
        <div className="order-1 max-w-xl">
          <span className="inline-flex rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
            Built for modern dev teams
          </span>

          <h1 className="mt-5 text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4.35rem] lg:leading-[0.95]">
            {headline.map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === 1 ? "bg-linear-to-r from-primary via-secondary to-primary bg-[length:200%_200%] bg-clip-text text-transparent" : ""}`}
                initial={false}
                animate={
                  i === 1 && !shouldReduceMotion
                    ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                    : undefined
                }
                transition={
                  i === 1 && !shouldReduceMotion
                    ? { duration: 6, ease: "easeInOut", repeat: Infinity }
                    : undefined
                }
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Zyplo is a developer-focused project management tool with Kanban
            boards, smart priorities, and lightning-fast navigation for teams
            that ship.
          </p>

          <div className="mt-6 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-background/65 px-3.5 py-3 shadow-sm backdrop-blur-sm"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} href="/register" variant="marketing" size="lg">
              Get started free
            </Button>
            <Button as={Link} href="/demo" variant="marketing-outline" size="lg">
              View demo
            </Button>
          </div>
        </div>

        <div className="order-2 relative flex justify-center md:justify-end">
          <div className="pointer-events-none absolute inset-x-6 bottom-6 top-12 rounded-[2rem] border border-primary/10 bg-linear-to-br from-background/10 via-background/5 to-secondary/10 blur-3xl" />
          <motion.div
            initial={false}
            animate={!shouldReduceMotion ? { y: [0, -10, 0] } : undefined}
            transition={
              !shouldReduceMotion
                ? { duration: 4.5, ease: "easeInOut", repeat: Infinity }
                : undefined
            }
            className="relative w-full max-w-[40rem] rounded-[2rem] border border-border/70 bg-card/55 p-3 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-4"
          >
            <div className="absolute inset-x-12 top-0 h-14 bg-linear-to-b from-secondary/25 to-transparent blur-2xl" />
            <Image
              src={rightHeroImg}
              alt="Zyplo App Preview"
              width={700}
              height={500}
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="relative h-auto w-full rounded-[1.55rem]"
            />
          </motion.div>
        </div>
      </MainContainer>
    </section>
  );
}
