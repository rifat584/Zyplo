"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Command,
  CornerDownLeft,
  FolderKanban,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";
import MainContainer from "@/components/container/MainContainer";
import { Button } from "@/components/ui/button";

const rails = [
  {
    title: "Jump Anywhere",
    desc: "Navigate projects, boards, and issues instantly.",
    icon: <FolderKanban className="size-5" />,
  },
  {
    title: "Create on the Fly",
    desc: "Add tasks or docs without leaving context.",
    icon: <Plus className="size-5" />,
  },
  {
    title: "Assign & Update",
    desc: "Change assignees, priorities, or status in seconds.",
    icon: <UserPlus className="size-5" />,
  },
  {
    title: "Confirm & Go",
    desc: "Execute actions with Enter instead of breaking flow.",
    icon: <Check className="size-5" />,
  },
];

const RESULT_SETS = [
  [
    { label: "Go to Project: Frontend" },
    { label: "Open Board: Sprint 3" },
    { label: "Search: auth flow" },
    { label: "Create Task: Fix login bug" },
  ],
  [
    { label: "Assign to: Ebrahim" },
    { label: "Change Status: In Progress" },
    { label: "Set Priority: High" },
    { label: "Add Label: bug" },
  ],
  [
    { label: "Go to Project: Backend" },
    { label: "Open Doc: API Spec" },
    { label: "Create Task: Add rate limit" },
    { label: "Change Status: Review" },
  ],
];

const TYPED_QUERIES = [
  "go to frontend",
  "create task fix login",
  "assign to ebrahim",
  "change status in progress",
];

export default function CommandPaletteSection() {
  const reduced = useReducedMotion();
  const base = reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" };

  const [typed, setTyped] = useState("");
  const [queryIndex, setQueryIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [resultSetIndex, setResultSetIndex] = useState(0);

  const activeResults = useMemo(
    () => RESULT_SETS[resultSetIndex % RESULT_SETS.length],
    [resultSetIndex],
  );

  useEffect(() => {
    const current = TYPED_QUERIES[queryIndex % TYPED_QUERIES.length];
    const speed = deleting ? 40 : 70;
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, charIndex + 1);
        setTyped(next);
        setCharIndex((i) => i + 1);
        if (next.length === current.length) {
          setTimeout(() => setDeleting(true), 900);
        }
      } else {
        const next = current.slice(0, Math.max(0, charIndex - 1));
        setTyped(next);
        setCharIndex((i) => Math.max(0, i - 1));
        if (next.length === 0) {
          setDeleting(false);
          setQueryIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, queryIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setResultSetIndex((i) => i + 1);
    }, 3500);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden  py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64" />

      <MainContainer className="px-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-border/70 bg-card/42 px-6 py-10 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:px-8 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,rgba(79,70,229,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
            aria-hidden
          />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
                  Work at the{" "}
                  <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    speed of thought
                  </span>
                </h2>
                <p className="marketing-copy mt-3 max-w-2xl text-sm leading-6 sm:text-base">
                  Search, create, assign, and move work without touching the
                  mouse. The command palette keeps you in flow while the rest of
                  your workspace stays one shortcut away.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/78 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm">
                Press
                <kbd className="rounded border border-border/80 bg-card px-2 py-0.5 text-xs text-muted-foreground">
                  Ctrl
                </kbd>
                <span className="marketing-subtle">+</span>
                <kbd className="rounded border border-border/80 bg-card px-2 py-0.5 text-xs text-muted-foreground">
                  K
                </kbd>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative">
                <div className="absolute left-3 top-0 h-full w-px bg-linear-to-b from-secondary/50 via-secondary/20 to-transparent" />
                <div className="space-y-8">
                  {rails.map((rail, i) => (
                    <motion.div
                      key={rail.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ ...base, delay: reduced ? 0 : i * 0.08 }}
                      className="relative pl-10"
                    >
                      <span className="absolute left-0 top-1.5 inline-flex size-7 items-center justify-center rounded-full border border-secondary/35 bg-secondary/10 text-secondary">
                        {rail.icon}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">
                        {rail.title}
                      </h3>
                      <p className="marketing-copy mt-1 text-sm">{rail.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...base, delay: 0.2 }}
                  className="mt-10"
                >
                  <Button
                    as={Link}
                    href="/resources/guide"
                    variant="marketing-outline"
                    size="sm"
                    className="w-fit"
                  >
                    Learn shortcuts
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={base}
                className="lg:sticky lg:top-24"
              >
                <div className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-background/88 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.3)] backdrop-blur-sm">
                  <div className="marketing-subtle flex items-center gap-2 border-b border-border/70 px-4 py-3 text-sm">
                    <Search className="size-4" />
                    <span className="relative text-foreground">
                      {typed || " "}
                      <motion.span
                        aria-hidden
                        className="ml-0.5 inline-block h-4 w-px bg-secondary align-middle"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </span>
                    <span className="marketing-subtle ml-auto inline-flex items-center gap-1 rounded border border-border/80 bg-card px-2 py-0.5 text-xs">
                      <Command className="size-3" />K
                    </span>
                  </div>

                  <div className="p-3">
                    <div className="marketing-subtle mb-2 text-[10px] uppercase tracking-[0.18em]">
                      Actions
                    </div>
                    <div className="space-y-2">
                      {activeResults.map((result, i) => (
                        <motion.div
                          key={`${resultSetIndex}-${result.label}-${i}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...base,
                            delay: reduced ? 0 : i * 0.06,
                          }}
                          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                            i === 0
                              ? "border-secondary/35 bg-secondary/10 text-foreground"
                              : "border-border/70 bg-card/72 text-foreground"
                          }`}
                        >
                          <span>{result.label}</span>
                          <span className="marketing-subtle inline-flex items-center gap-1 text-xs">
                            <CornerDownLeft className="size-3.5" />
                            Enter
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="marketing-subtle flex items-center justify-between border-t border-border/70 px-4 py-2 text-xs">
                    <span>↑ ↓ navigate</span>
                    <span>Enter select</span>
                    <span>Esc close</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
