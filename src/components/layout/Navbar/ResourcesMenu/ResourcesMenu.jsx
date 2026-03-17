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
                <div className="absolute top-14 -right-90 w-180 rounded-xl border border-border bg-card shadow-xl p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        {resources.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setResourcesOpen(false)}
                                className="block rounded-lg p-4 text-foreground hover:bg-surface dark:hover:bg-accent/70 transition"
                            >
                                <p className="font-semibold mb-1 text-foreground">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="rounded-xl bg-surface dark:bg-surface p-4 flex flex-col justify-between">
                        <div>
                            <p className="font-semibold mb-2 text-foreground">Helping teams work better</p>
                            <p className="text-sm text-muted-foreground">
                                Guides, tips, and best practices for using Zyplo effectively.
                            </p>
                        </div>
                        <Link
                            href="/blog"
                            onClick={() => setResourcesOpen(false)}
                            className="mt-4 inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-gray-800 dark:text-foreground"
                        >
                            Visit Zyplo Blog
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Resources Submenu */}
            {mobileResourcesOpen && (
                <div className=" space-y-2 border rounded-xl bg-secondary/15 p-2">
                    {resources.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            onClick={closeAll}
                            className="block py-1 text-sm text-muted-foreground hover:bg-secondary/30 p-4 rounded"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        href="/blog"
                        onClick={closeAll}
                        className="block py-1 text-sm font-medium text-muted-foreground hover:bg-secondary/40 p-4 rounded"
                    >
                        Zyplo Blog
                    </Link>
                </div>
            )}
        </>
    );
}