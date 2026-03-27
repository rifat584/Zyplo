"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import MainContainer from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";
import rightHeroImg from "../../../../public/right-hero.png";

const headline = ["Plan faster.", "Ship better."];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-12 sm:py-14 lg:py-18">
      <div className="pointer-events-none absolute inset-0 bg-secondary/22 dark:bg-secondary/14" />

      {/* Radial gradients */}
      <div
        className="pointer-events-none absolute inset-0
  bg-[radial-gradient(ellipse_80%_50%_at_-10%_-10%,oklch(78.9%_0.154_211.53/0.35),transparent),radial-gradient(ellipse_60%_50%_at_110%_-5%,oklch(58.5%_0.233_277.117/0.4),transparent),radial-gradient(ellipse_40%_30%_at_50%_0%,oklch(58.5%_0.233_277.117/0.15),transparent)]
  dark:bg-[radial-gradient(ellipse_80%_50%_at_-10%_-10%,oklch(78.9%_0.154_211.53/0.18),transparent),radial-gradient(ellipse_60%_50%_at_110%_-5%,oklch(58.5%_0.233_277.117/0.25),transparent),radial-gradient(ellipse_40%_30%_at_50%_0%,oklch(58.5%_0.233_277.117/0.1),transparent)]"
      />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-b from-transparent via-background/70 to-background" />

      <MainContainer className="grid items-center gap-10 px-6 md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12">
        <div className="order-1 max-w-xl z-10">
          {/* Title */}
          <h1 className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4.35rem] lg:leading-[0.95]">
            {headline.map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === 1 ? "bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_200%] bg-clip-text text-transparent" : ""}`}
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

          {/* Sub Heading */}
          <p className="mt-5 max-w-2xl leading-7 text-foreground sm:text-lg">
            Zyplo is a developer-focused project management tool with Kanban
            boards, smart priorities, and lightning-fast navigation for teams
            that ship.
          </p>

          {/*CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} href="/register" variant="marketing" size="lg">
              Get started free
            </Button>
            <Button
              as={Link}
              href="/demo"
              variant="marketing-outline"
              size="lg"
            >
              View demo
            </Button>
          </div>
        </div>

        {/* Right Side */}
        <div className="order-2 relative flex justify-center md:justify-end">
          <motion.div
            initial={false}
            animate={!shouldReduceMotion ? { y: [0, -10, 0] } : undefined}
            transition={
              !shouldReduceMotion
                ? { duration: 4.5, ease: "easeInOut", repeat: Infinity }
                : undefined
            }
            className="relative w-full max-w-md md:max-w-156"
          >
            <Image
              src={rightHeroImg}
              alt="Zyplo App Preview"
              width={700}
              height={500}
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="relative h-auto w-full rounded-[1.2rem] origin-center md:origin-right
  transform-[perspective(1400px)_rotateY(-8deg)_rotateX(4deg)]
  shadow-[0_32px_80px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)]"
            />
          </motion.div>
        </div>
      </MainContainer>
    </section>
  );
}
