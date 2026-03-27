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
                <div className="absolute left-1/2 top-14 z-30 w-[32rem] -translate-x-1/2 rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-xl">
                    <div className="grid grid-cols-2 gap-4">
                        {resources.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setResourcesOpen(false)}
                                className="group block rounded-lg border border-transparent px-3 py-3 text-foreground transition-colors hover:bg-accent hover:text-secondary"
                            >
                                <p className="mb-1 font-semibold text-foreground transition-colors group-hover:text-secondary">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Resources Submenu */}
            {mobileResourcesOpen && (
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm">
                    <div className="space-y-2">
                        {resources.map((item, index) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={closeAll}
                                className="group block rounded-md px-2 py-2.5 transition-colors hover:bg-accent hover:text-secondary"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-4 shrink-0 items-center justify-center text-[11px] font-semibold text-muted-foreground transition-colors group-hover:text-secondary">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-secondary">
                                            {item.title}
                                        </p>
                                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            )}
        </>
    );
}
