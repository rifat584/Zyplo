"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, ArrowRight, Tag } from "lucide-react";
import posts from "@/lib/blog/posts.json";

const categories = ["All", ...new Set(posts.map((post) => post.category))];

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const featured = posts.find((post) => post.featured);
  const rest = posts.filter((post) => !post.featured);

  const filtered = useMemo(() => {
    return rest.filter((post) => {
      const matchesQuery =
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCat === "All" || post.category === activeCat;
      return matchesQuery && matchesCat;
    });
  }, [query, activeCat]);

  return (
    <main className="bg-base text-foreground">
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

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-lg border border-border bg-surface px-9 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCat(category)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                    activeCat === category
                      ? "border-secondary/50 bg-secondary/10 text-secondary"
                      : "border-border text-gray-600 hover:bg-surface dark:text-gray-300"
                  }`}
                >
                  <Tag className="h-3 w-3" />
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-lg md:grid-cols-2"
          >
            <div className="relative h-64 md:h-full">
              <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block mb-3 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs text-secondary">
                  Featured
                </span>
                <h2 className="text-2xl font-bold">{featured.title}</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{featured.excerpt}</p>
              </div>
              <Link
                href={`/blog/${encodeURIComponent(String(featured.id))}`}
                className="mt-6 inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
              >
                Read article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-1">{post.excerpt}</p>
                <Link
                  href={`/blog/${encodeURIComponent(String(post.id))}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:gap-3 transition-all"
                >
                  Read more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-gray-500">No articles found.</p>
        ) : null}
      </section>
    </main>
  );
}
