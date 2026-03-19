"use client";

import Link from "next/link";

export default function ResourcesMenu({
    resources,
    resourcesOpen,
    setResourcesOpen,
    mobileResourcesOpen,
    setMobileResourcesOpen,
    closeAll,
}) {
    return (
        <>
            {/* Desktop Mega Menu */}
            {resourcesOpen && (
                <div className="absolute top-14 -right-[22.5rem] w-[45rem] rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        {resources.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setResourcesOpen(false)}
                                className="block rounded-lg p-4 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{item.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 flex flex-col justify-between">
                        <div>
                            <p className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Helping teams work better</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Guides, tips, and best practices for using Zyplo effectively.
                            </p>
                        </div>
                        <Link
                            href="/blog"
                            onClick={() => setResourcesOpen(false)}
                            className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            Visit Zyplo Blog
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Resources Submenu */}
            {mobileResourcesOpen && (
                <div className="overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-cyan-50 to-white p-3 shadow-sm dark:border-indigo-500/25 dark:from-indigo-500/10 dark:via-cyan-500/10 dark:to-slate-900">
                    <div className="mb-2 rounded-xl border border-indigo-200/70 bg-white/70 px-3 py-2 dark:border-indigo-500/20 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                            Resources
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                            Guides, support docs, and practical playbooks.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {resources.map((item, index) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={closeAll}
                                className="group block rounded-xl border border-white/80 bg-white/80 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-indigo-400/30"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                                            {item.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href="/blog"
                        onClick={closeAll}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/30 dark:bg-slate-900/70 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                    >
                        Explore Zyplo Blog
                    </Link>
                </div>
            )}
        </>
    );
}
