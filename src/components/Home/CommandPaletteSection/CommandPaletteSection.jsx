"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

const quickHints = [
  { label: "Create issue", shortcut: "T" },
  { label: "Open board", shortcut: "B" },
  { label: "Move to review", shortcut: "R" },
  { label: "Assign owner", shortcut: "A" },
];

const recentCommands = [
  "Moved PR #156 to Review",
  "Assigned Ebrahim to auth fix",
  "Opened API spec doc",
];

export default function CommandPaletteSection() {
  const reduced = useReducedMotion();
  const base = reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" };

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

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
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.08)_1px,transparent_1px)] bg-[size:28px_28px]"
        />
        <motion.div
          style={{ y: glowY }}
          className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/18 blur-3xl"
        />
      </div>

      <MainContainer className="px-6">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-info/20 bg-info/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-info">
              <Command className="size-4" />
              Command palette
            </span>
            <h2 className="mt-4 text-3xl font-heading font-bold tracking-tight text-foreground sm:text-5xl">
              Work at the{" "}
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                speed of thought
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Search, create, assign, and move work without touching the mouse.
              The command palette keeps you in flow while the rest of your
              workspace stays one shortcut away.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/75 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm">
            Press
            <kbd className="rounded-full border border-border/80 bg-background px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Ctrl
            </kbd>
            <kbd className="rounded-full border border-border/80 bg-background px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              K
            </kbd>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] xl:gap-10">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {rails.map((rail, i) => (
                <motion.article
                  key={rail.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ ...base, delay: reduced ? 0 : i * 0.08 }}
                  className="rounded-[1.5rem] border border-border/70 bg-card/68 p-5 shadow-sm backdrop-blur-sm"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/10 text-secondary">
                    {rail.icon}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {rail.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {rail.desc}
                  </p>
                </motion.article>
              ))}
            </div>

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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={base}
            className="lg:sticky lg:top-24"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/78 shadow-[0_28px_70px_-40px_rgba(15,23,42,0.32)] backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3 text-sm text-muted-foreground">
                <Search className="size-4" />
                <span className="relative text-foreground">
                  {typed || " "}
                  <motion.span
                    aria-hidden
                    className="ml-0.5 inline-block h-4 w-px bg-secondary align-middle"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <Command className="size-3" />
                  K
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span>Suggested actions</span>
                <span>Workspace: Product</span>
              </div>

              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  {activeResults.map((result, i) => (
                    <motion.div
                      key={`${resultSetIndex}-${result.label}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...base, delay: reduced ? 0 : i * 0.06 }}
                      className={`flex items-center justify-between rounded-xl border px-3 py-3 text-sm ${
                        i === 0
                          ? "border-secondary/20 bg-secondary/10 text-foreground"
                          : "border-border/70 bg-background/70 text-foreground"
                      }`}
                    >
                      <span>{result.label}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <CornerDownLeft className="size-3.5" />
                        Enter
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-border/70 bg-background/72 p-3 shadow-sm">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Quick actions
                    </div>
                    <div className="space-y-2">
                      {quickHints.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-lg border border-border/60 bg-card/75 px-3 py-2 text-sm text-foreground"
                        >
                          <span>{item.label}</span>
                          <span className="rounded-full border border-border/80 bg-background px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {item.shortcut}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/72 p-3 shadow-sm">
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Recent
                    </div>
                    <div className="space-y-2">
                      {recentCommands.map((item) => (
                        <div
                          key={item}
                          className="rounded-lg border border-border/60 bg-card/75 px-3 py-2 text-sm text-foreground"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
                <span>↑ ↓ navigate</span>
                <span>Enter select</span>
                <span>Esc close</span>
              </div>
            </div>
          </motion.div>
        </div>
      </MainContainer>
    </section>
  );
}
