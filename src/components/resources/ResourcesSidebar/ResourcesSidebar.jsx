"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ResourcesSidebar({ sections, open, onClose }) {
    const [active, setActive] = useState(sections[0]?.id || "");
    const [openGroups, setOpenGroups] = useState({});

    // Observe sections + subsections for active highlight
    useEffect(() => {
        const ids = [];
        sections.forEach((s) => {
            ids.push(s.id);
            s.subsections?.forEach((sub) => ids.push(sub.id));
        });

        const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);

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


    const toggleGroup = (id) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };


    useEffect(() => {
        if (!active) return;

        sections.forEach((s) => {
            if (s.subsections?.some((sub) => sub.id === active)) {
                setOpenGroups((prev) => ({ ...prev, [s.id]: true }));
            }
        });
    }, [active, sections]);

    const isGroupActive = (section) => {
        if (active === section.id) return true;
        return section.subsections?.some((sub) => sub.id === active);
    };

    const LinkItem = ({ id, title, level = 0 }) => {
        const isActive = active === id;

        return (
            <a
                href={`#${id}`}
                onClick={onClose}
                className={`block w-full rounded-md px-3 py-1.5 text-sm transition-colors ${level === 0 ? "font-medium" : ""
                    } ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-base"
                    }`}
            >
                {title}
            </a>
        );
    };

    const SidebarContent = () => (
        <nav className="space-y-2">
            {sections.map((s, i) => {
                const hasChildren = !!s.subsections?.length;
                const isOpen = openGroups[s.id];
                const groupActive = isGroupActive(s);

                return (
                    <div key={s.id}>
                        {/* Top level item */}
                        <div
                            className={`w-full rounded-md transition ${groupActive
                                    ? "bg-primary/10"
                                    : "hover:bg-gray-100 dark:hover:bg-base"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 text-sm text-gray-400 text-left">
                                        {i + 1}
                                    </span>

                                    {hasChildren ? (
                                        <button
                                            type="button"
                                            onClick={() => toggleGroup(s.id)}
                                            className={`text-sm font-medium text-left ${groupActive
                                                    ? "text-primary"
                                                    : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {s.title}
                                        </button>
                                    ) : (
                                        <a
                                            href={`#${s.id}`}
                                            onClick={onClose}
                                            className={`text-sm font-medium ${active === s.id
                                                    ? "text-primary"
                                                    : "text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            {s.title}
                                        </a>
                                    )}
                                </div>

                                {hasChildren && (
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(s.id)}
                                        className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Nested items */}
                        {hasChildren && isOpen && (
                            <div className="ml-8 mt-1 space-y-1">
                                {s.subsections.map((sub) => (
                                    <LinkItem
                                        key={sub.id}
                                        id={sub.id}
                                        title={sub.title}
                                        level={1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto">
                <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Getting started with Zyplo
                </p>
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
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
                    className={`absolute left-0 top-0 h-full w-80 bg-white p-4 dark:bg-surface border-r border-gray-200 dark:border-gray-800 transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <p className="mb-4 text-base font-semibold">
                        Learn Zyplo basics
                    </p>

                    <SidebarContent />
                </div>
            </div>
        </>
    );
}
