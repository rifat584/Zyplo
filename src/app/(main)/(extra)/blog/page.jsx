"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Tag } from "lucide-react";

const posts = [
    {
        id: 1,
        title: "How Zyplo Helps Dev Teams Ship Faster",
        excerpt:
            "From Kanban boards to the command palette—see how Zyplo removes friction from your daily workflow.",
        category: "Product",
        date: "2026-02-10",
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        featured: true,
    },
    {
        id: 2,
        title: "Remote Work: Building High-Trust Engineering Teams",
        excerpt:
            "Async-first workflows, clear ownership, and the right tools can make remote teams outperform colocated ones.",
        category: "Remote Work",
        date: "2026-01-28",
        image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Designing a Better Kanban Workflow",
        excerpt:
            "A practical guide to structuring boards, limits, and priorities for real-world dev teams.",
        category: "Workflow",
        date: "2026-01-12",
        image:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Keyboard-First Productivity: Why It Matters",
        excerpt:
            "Small shortcuts compound into big productivity gains. Here’s how to think keyboard-first.",
        category: "Productivity",
        date: "2025-12-30",
        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "From Backlog to Done: A Sprint Planning Playbook",
        excerpt:
            "A step-by-step approach to planning sprints that your team will actually enjoy.",
        category: "Agile",
        date: "2025-12-15",
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    },
];

const categories = ["All", "Product", "Remote Work", "Workflow", "Productivity", "Agile"];

export default function BlogPage() {
    const [query, setQuery] = useState("");
    const [activeCat, setActiveCat] = useState("All");

    const featured = posts.find((p) => p.featured);
    const rest = posts.filter((p) => !p.featured);

    const filtered = useMemo(() => {
        return rest.filter((p) => {
            const matchesQuery =
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(query.toLowerCase());
            const matchesCat = activeCat === "All" || p.category === activeCat;
            return matchesQuery && matchesCat;
        });
    }, [query, activeCat]);

    return (
        <main className="bg-base text-foreground">
            {/* Hero */}
            <section className="relative overflow-hidden py-20">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.12),transparent_36%)]" />
                </div>

                <div className="mx-auto max-w-7xl px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl font-heading font-bold sm:text-5xl lg:text-6xl"
                    >
                        Zyplo Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400"
                    >
                        Insights on productivity, workflows, remote work, and building better dev teams.
                    </motion.p>

                    {/* Search + Filter */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full rounded-lg border border-border bg-surface px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/40"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCat(cat)}
                                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${activeCat === cat
                                            ? "border-secondary/50 bg-secondary/10 text-secondary"
                                            : "border-border text-gray-600 hover:bg-surface dark:text-gray-300"
                                        }`}
                                >
                                    <Tag className="h-3 w-3" />
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured */}
            {featured && (
                <section className="mx-auto max-w-7xl px-6 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="grid gap-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg md:grid-cols-2"
                    >
                        <div className="relative h-64 md:h-full">
                            <img
                                src={featured.image}
                                alt={featured.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <span className="inline-block mb-3 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs text-secondary">
                                    Featured
                                </span>
                                <h2 className="text-2xl font-bold">{featured.title}</h2>
                                <p className="mt-3 text-gray-600 dark:text-gray-400">
                                    {featured.excerpt}
                                </p>
                            </div>
                            <Link
                                href={`/blog/${featured.id}`}
                                className="mt-6 inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
                            >
                                Read article <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Grid */}
            <section className="mx-auto max-w-7xl px-6 pb-24">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((post, i) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
                            className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5 flex flex-col">
                                <div className="mb-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{post.category}</span>
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-semibold">{post.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-1">
                                    {post.excerpt}
                                </p>
                                <Link
                                    href={`/blog/${post.id}`}
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:gap-3 transition-all"
                                >
                                    Read more <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="mt-12 text-center text-gray-500">No articles found.</p>
                )}
            </section>
        </main>
    );
}