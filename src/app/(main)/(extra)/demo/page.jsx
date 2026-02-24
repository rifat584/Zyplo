"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Command,
    KanbanSquare,
    Users,
    Bell,
    ArrowRight,
    Check,
} from "lucide-react";

const features = [
    {
        id: "command",
        title: "Command Palette",
        desc: "Jump anywhere, create tasks, and update status in seconds.",
        icon: <Command className="h-5 w-5" />,
        steps: [
            "Press Ctrl + K",
            "Type your action",
            "Hit Enter to execute",
        ],
    },
    {
        id: "kanban",
        title: "Kanban Board",
        desc: "Visualize work across To Do, In Progress, Review, and Done.",
        icon: <KanbanSquare className="h-5 w-5" />,
        steps: [
            "Create tasks",
            "Drag between columns",
            "Track progress visually",
        ],
    },
    {
        id: "team",
        title: "Team Collaboration",
        desc: "Assign tasks, mention teammates, and stay in sync.",
        icon: <Users className="h-5 w-5" />,
        steps: [
            "Invite teammates",
            "Assign owners",
            "Collaborate in real time",
        ],
    },
    {
        id: "notify",
        title: "Notifications",
        desc: "Never miss updates on assignments and status changes.",
        icon: <Bell className="h-5 w-5" />,
        steps: [
            "Get notified instantly",
            "See activity feed",
            "Stay focused",
        ],
    },
];

export default function DemoPage() {
    const [active, setActive] = useState(features[0]);

    return (
        <main className="bg-base text-foreground">
            {/* Hero */}
            <section className="relative overflow-hidden py-24">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.12),transparent_36%)]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl font-heading font-bold sm:text-5xl lg:text-6xl"
                    >
                        See Zyplo in Action
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="mx-auto mt-5 max-w-2xl text-gray-600 dark:text-gray-400"
                    >
                        Explore how teams plan faster, collaborate better, and ship with confidence using Zyplo.
                    </motion.p>

                    <motion.a
                        href="#demo"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:opacity-90 transition"
                    >
                        <Play className="h-4 w-4" />
                        Start Interactive Demo
                    </motion.a>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="mx-auto max-w-7xl px-6 pb-24">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
                    {/* Left: Feature Selector */}
                    <div className="space-y-4">
                        {features.map((f, i) => (
                            <motion.button
                                key={f.id}
                                initial={{ opacity: 0, x: -12 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                onClick={() => setActive(f)}
                                className={`w-full text-left rounded-xl border p-4 transition ${active.id === f.id
                                        ? "border-secondary/50 bg-secondary/10"
                                        : "border-border bg-surface hover:bg-surface/80"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-base">
                                        {f.icon}
                                    </span>
                                    <div>
                                        <p className="font-semibold">{f.title}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {f.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right: Animated Preview */}
                    <div className="relative">
                        <div className="rounded-2xl border border-border bg-surface shadow-xl p-6 min-h-[320px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -16 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    <div className="mb-4 flex items-center gap-2 text-secondary">
                                        {active.icon}
                                        <h3 className="text-lg font-semibold">{active.title}</h3>
                                    </div>

                                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                                        {active.desc}
                                    </p>

                                    <div className="space-y-3">
                                        {active.steps.map((step, i) => (
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                                className="flex items-center gap-3 rounded-lg border border-border bg-base p-3"
                                            >
                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                                                    <Check className="h-4 w-4" />
                                                </span>
                                                <span className="text-sm">{step}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <a
                                        href="/signup"
                                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:gap-3 transition-all"
                                    >
                                        Try it yourself <ArrowRight className="h-4 w-4" />
                                    </a>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}