"use client";

import { useEffect, useState } from "react";

export default function DocsSidebar({ sections, open, onClose }) {
    const [active, setActive] = useState(sections[0]?.id || "");

    useEffect(() => {
        const nodes = sections
            .map((s) => document.getElementById(s.id))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
        );

        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, [sections]);

    const NavItem = ({ s }) => {
        const isActive = active === s.id;
        return (
            <a
                href={`#${s.id}`}
                onClick={onClose}
                className={`block rounded-md px-3 py-2 text-sm transition
          ${isActive
                        ? "bg-secondary/15 text-secondary font-medium"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-base"
                    }`}
            >
                {s.title}
            </a>
        );
    };

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Documentation
                </p>
                <nav className="space-y-1">
                    {sections.map((s) => (
                        <NavItem key={s.id} s={s} />
                    ))}
                </nav>
            </aside>

            {/* Mobile drawer */}
            <div
                className={`fixed top-16 inset-0 z-40 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"
                    }`}
            >
                {/* Backdrop */}
                <div
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/40 transition ${open ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* Drawer */}
                <div
                    className={`absolute left-0 top-0 h-full w-72 bg-white p-4 dark:bg-surface border-r border-gray-200 dark:border-gray-800 transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Documentation
                    </p>
                    <nav className="space-y-1">
                        {sections.map((s) => (
                            <NavItem key={s.id} s={s} />
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}
