"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
    Search,
    Command,
    CornerDownLeft,
    ArrowRight,
    Check,
    Plus,
    FolderKanban,
    UserPlus,
} from "lucide-react";

// Brand-synced feature rails
const rails = [
    {
        title: "Jump Anywhere",
        desc: "Navigate projects, boards, and issues instantly.",
        icon: <FolderKanban className="h-5 w-5" />,
    },
    {
        title: "Create on the Fly",
        desc: "Add tasks or docs without leaving context.",
        icon: <Plus className="h-5 w-5" />,
    },
    {
        title: "Assign & Update",
        desc: "Change assignees, priorities, or status in seconds.",
        icon: <UserPlus className="h-5 w-5" />,
    },
    {
        title: "Confirm & Go",
        desc: "Execute actions with Enter—no mouse needed.",
        icon: <Check className="h-5 w-5" />,
    },
];

// Sets of results that will cycle
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

// Texts to "type" in the search field
const TYPED_QUERIES = [
    "go to frontend",
    "create task fix login",
    "assign to ebrahim",
    "change status in progress",
];

export default function CommandPaletteSection() {
    const reduced = useReducedMotion();
    const base = reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" };

    // Scroll-linked parallax for background grid
    const { scrollYProgress } = useScroll();
    const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
    const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    // Typing animation state
    const [typed, setTyped] = useState("");
    const [queryIndex, setQueryIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    // Cycling results
    const [resultSetIndex, setResultSetIndex] = useState(0);

    const activeResults = useMemo(
        () => RESULT_SETS[resultSetIndex % RESULT_SETS.length],
        [resultSetIndex]
    );

    // Typing effect
    useEffect(() => {
        const current = TYPED_QUERIES[queryIndex % TYPED_QUERIES.length];
        const speed = deleting ? 40 : 70;
        const timeout = setTimeout(() => {
            if (!deleting) {
                // typing
                const next = current.slice(0, charIndex + 1);
                setTyped(next);
                setCharIndex((i) => i + 1);
                if (next.length === current.length) {
                    // pause before deleting
                    setTimeout(() => setDeleting(true), 900);
                }
            } else {
                // deleting
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

    // Cycle results when query changes (or every few seconds)
    useEffect(() => {
        const id = setInterval(() => {
            setResultSetIndex((i) => i + 1);
        }, 3500);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="relative overflow-hidden py-24 bg-white dark:bg-base">
            {/* Distinct background: grid + spotlight with parallax */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    style={{ y: gridY }}
                    className="absolute inset-0 bg-[linear-gradient(to_right,rgba(79,70,229,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(79,70,229,0.10)_1px,transparent_1px)] bg-[size:28px_28px] dark:opacity-40"
                />
                <motion.div
                    style={{ y: glowY }}
                    className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-secondary/25 blur-3xl"
                />
            </div>

            <div className="mx-auto max-w-7xl px-6">
                {/* Section header (not hero-like) */}
                <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm text-secondary dark:border-secondary/40">
                            <Command className="h-4 w-4" />
                            Command Palette
                        </span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-primary sm:text-4xl">
                            Work at the speed of thought
                        </h2>
                        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
                            Search, create, assign, and move work without touching the mouse.
                            The command palette keeps you in flow—always.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
                            Press <kbd className="rounded border px-2 py-0.5 text-xs">Ctrl</kbd> +
                            <kbd className="rounded border px-2 py-0.5 text-xs">K</kbd>
                        </span>
                    </div>
                </div>

                {/* Asymmetric layout: rails (left) + sticky mock (right) */}
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left: Feature rails */}
                    <div className="relative">
                        <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-secondary/50 via-secondary/20 to-transparent" />
                        <div className="space-y-8">
                            {rails.map((r, i) => (
                                <motion.div
                                    key={r.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ ...base, delay: reduced ? 0 : i * 0.08 }}
                                    className="relative pl-10"
                                >
                                    <span className="absolute left-0 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-secondary/40 bg-secondary/10 text-secondary">
                                        {r.icon}
                                    </span>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-primary">
                                        {r.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {r.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ...base, delay: 0.2 }}
                            className="mt-10 flex items-center gap-3"
                        >
                            <a
                                href="/docs"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-surface"
                            >
                                Learn shortcuts <ArrowRight className="h-4 w-4" />
                            </a>
                        </motion.div>
                    </div>

                    {/* Right: Sticky mock */}
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={base}
                        className="lg:sticky lg:top-24"
                    >
                        <div className="rounded-2xl border border-gray-200 bg-white/90 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-surface/90">
                            {/* Search bar with real typing */}
                            <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
                                <Search className="h-4 w-4" />
                                <span className="relative text-gray-800 dark:text-primary">
                                    {typed || " "}
                                    <motion.span
                                        aria-hidden
                                        className="ml-0.5 inline-block h-4 w-px bg-secondary align-middle"
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </span>
                                <span className="ml-auto inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-0.5 text-xs dark:border-gray-700">
                                    <Command className="h-3 w-3" /> K
                                </span>
                            </div>

                            {/* Results list (cycles over time) */}
                            <div className="p-3">
                                <div className="mb-2 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Actions
                                </div>
                                <div className="space-y-2">
                                    {activeResults.map((r, i) => (
                                        <motion.div
                                            key={`${resultSetIndex}-${r.label}-${i}`}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 8 }}
                                            transition={{ ...base, delay: reduced ? 0 : i * 0.06 }}
                                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm
                        ${i === 0
                                                    ? "border-secondary/40 bg-secondary/10 text-secondary"
                                                    : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-base"
                                                }`}
                                        >
                                            <span>{r.label}</span>
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                <CornerDownLeft className="h-3.5 w-3.5" /> ↵
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer hint */}
                            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                <span>↑ ↓ navigate</span>
                                <span>Enter select</span>
                                <span>Esc close</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}