"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Settings } from "lucide-react";
import Logo from "@/components/Shared/Logo/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DotPattern({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid grid-cols-6 gap-1 opacity-45",
        className,
      )}
    >
      {Array.from({ length: 30 }).map((_, index) => (
        <span key={index} className="size-1 rounded-full bg-primary/25" />
      ))}
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[35rem]">
      <DotPattern className="absolute left-4 top-8" />
      <DotPattern className="absolute right-4 top-24 hidden sm:grid" />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-[20rem] sm:h-[24rem]"
      >
        <div className="absolute bottom-0 left-0 right-0 h-16 rounded-full bg-primary/10" />

        <div className="absolute left-[12%] top-[34%] text-[8.5rem] font-black leading-none tracking-[-0.08em] text-primary sm:text-[11.5rem]">
          4
        </div>
        <div className="absolute left-[40%] top-[5%] text-[10rem] font-black leading-none tracking-[-0.08em] text-primary sm:text-[13.5rem]">
          0
        </div>
        <div className="absolute right-[8%] top-[34%] text-[8.5rem] font-black leading-none tracking-[-0.08em] text-primary sm:text-[11.5rem]">
          4
        </div>

        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[20%] top-[15%] text-secondary"
        >
          <div className="h-0 w-0 border-b-[10px] border-l-[26px] border-b-transparent border-l-current border-t-[10px] border-t-transparent sm:border-b-[12px] sm:border-l-[34px] sm:border-t-[12px]" />
          <div className="mt-1 ml-2 h-0 w-0 border-b-[7px] border-l-[18px] border-b-transparent border-l-secondary/70 border-t-[7px] border-t-transparent sm:border-b-[9px] sm:border-l-[24px] sm:border-t-[9px]" />
        </motion.div>

        <div className="absolute left-[51%] top-[28%] text-destructive">
          <Settings className="size-7 sm:size-8" />
        </div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[48%] top-[53%] flex flex-col items-center"
        >
          <div className="h-7 w-7 rounded-full bg-secondary/65 sm:h-8 sm:w-8" />
          <div className="mt-1 h-11 w-8 rounded-t-full bg-secondary sm:h-14 sm:w-10" />
          <div className="mt-[-2px] flex gap-5 sm:gap-6">
            <div className="h-10 w-2 rotate-[18deg] rounded-full bg-foreground/80 sm:h-12" />
            <div className="h-10 w-2 -rotate-[18deg] rounded-full bg-foreground/80 sm:h-12" />
          </div>
          <div className="mt-[-4.1rem] flex w-16 justify-between sm:mt-[-5rem] sm:w-20">
            <div className="h-9 w-2 -rotate-[18deg] rounded-full bg-secondary sm:h-11" />
            <div className="h-9 w-2 rotate-[18deg] rounded-full bg-secondary sm:h-11" />
          </div>
        </motion.div>

        <div className="absolute left-[18%] bottom-[12%] flex flex-col items-center">
          <div className="relative">
            <div className="h-12 w-8 rounded-t-full bg-secondary/85 sm:h-14 sm:w-10" />
            <div className="absolute left-1/2 top-2 h-8 w-[2px] -translate-x-1/2 bg-secondary sm:h-10" />
          </div>
          <div className="mt-2 h-8 w-9 rounded-t-xl bg-primary/75 sm:w-10" />
        </div>

        <div className="absolute left-[7%] bottom-[6%] h-3 w-12 rounded-full bg-muted" />
        <div className="absolute left-[44%] bottom-[6%] h-3 w-14 rounded-full bg-muted" />
        <div className="absolute right-[16%] bottom-[6%] h-3 w-12 rounded-full bg-muted" />
      </motion.div>
    </div>
  );
}

export default function NotFoundExperience() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto flex min-h-screen w-full max-w-[1400px] items-center justify-center px-3 py-6 sm:px-4 lg:px-7"
      >
        <section className="w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_30px_80px_-42px_oklch(from_var(--foreground)_l_c_h_/_0.18)]">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <Link href={"/"}>
            <Logo size={36} textSize="lg" className="gap-2" />
            </Link>

            <div className="items-center gap-8 text-sm font-medium text-muted-foreground flex">
              <Link href="/" className="transition-colors hover:text-secondary">
                Home
              </Link>
              <Link href="/pricing" className="transition-colors hidden md:block hover:text-secondary">
                Pricing
              </Link>
              <Link href="/blog" className="transition-colors hidden md:block hover:text-secondary">
                Blog
              </Link>
              <Link href="/resources" className="transition-colors hidden sm:block hover:text-secondary">
                Resources
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-primary px-4 py-1.5 text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden px-5 pb-10 pt-4 sm:px-8 sm:pb-12 lg:px-10 lg:pb-0">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
              <div className="relative z-10 text-center lg:pb-24 lg:pt-8 lg:text-left">
                <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-primary sm:text-6xl">
                  Oops!
                  <br />
                  Page Not Found
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 mx-auto text-muted-foreground lg:mx-0">
                  Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-11 rounded-full bg-primary px-5 text-primary-foreground shadow-none transition-all hover:scale-[1.01] hover:text-secondary/70 hover:shadow-none",
                    )}
                  >
                    Go Back Home
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>

              <div className="relative z-10">
                <HeroIllustration />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(120%_90%_at_10%_100%,var(--primary)_0%,oklch(from_var(--primary)_l_c_h_/_0.82)_28%,transparent_29%),radial-gradient(120%_90%_at_78%_100%,oklch(from_var(--secondary)_l_c_h_/_0.95)_0%,oklch(from_var(--primary)_l_c_h_/_0.55)_22%,transparent_23%)] opacity-90 sm:h-32" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-card" style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }} />
          </div>
        </section>
      </motion.div>
    </main>
  );
}
