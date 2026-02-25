"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ResourcesSidebar({ sections, open, onClose, title = "Contents" }) {
    const [active, setActive] = useState(sections[0]?.id || "");
    const [openGroups, setOpenGroups] = useState({});
    const mobileRef = useRef(null);

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

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                openGroups["__mobile_root"] &&
                mobileRef.current &&
                !mobileRef.current.contains(e.target)
            ) {
                setOpenGroups((prev) => ({ ...prev, ["__mobile_root"]: false }));
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [openGroups]);

    const isGroupActive = (section) => {
        if (active === section.id) return true;
        return section.subsections?.some((sub) => sub.id === active);
    };

    const LinkItem = ({ id, title, level = 0 }) => {
        const isActive = active === id;

        const handleClick = () => {
            setOpenGroups((prev) => ({ ...prev, ["__mobile_root"]: false }));
            onClose?.();
        };

        return (
            <a
                href={`#${id}`}
                onClick={handleClick}
                className={`block w-full rounded-l-md px-3 py-1.5 text-sm transition-colors ${level === 0 ? "font-medium" : ""
                    } ${isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-surface"
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
                            className={`w-full rounded-md lg:rounded-none transition ${groupActive
                                    ? "bg-primary/10"
                                    : "hover:bg-gray-100 dark:hover:bg-surface"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                                {/* Left side: FULL ROW CLICK AREA */}
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(s.id)}
                                        className={`flex w-full items-center gap-2 text-left text-sm font-medium ${groupActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        <span className="w-6 text-sm text-gray-400 text-left">{i + 1}</span>
                                        <span className="flex-1">{s.title}</span>
                                    </button>
                                ) : (
                                    <a
                                        href={`#${s.id}`}
                                        onClick={() => {
                                            setOpenGroups((prev) => ({ ...prev, ["__mobile_root"]: false }));
                                            onClose?.();
                                        }}
                                        className={`flex w-full items-center gap-2 text-left text-sm font-medium ${active === s.id ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        <span className="w-6 text-sm text-gray-400 text-left">{i + 1}</span>
                                        <span className="flex-1">{s.title}</span>
                                    </a>
                                )}

                                {/* Right side: Chevron only for groups */}
                                {hasChildren && (
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(s.id)}
                                        className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
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
            <aside className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto bg-surface border-r border-gray-200 dark:border-none rounded-t-xl shadow-md">
                <p className="mb-2 text-lg font-semibold text-primary p-4">
                    Getting started with Zyplo
                </p>
                <SidebarContent />
            </aside>

            {/* Mobile Collapsible Sidebar */}
            <div
                ref={mobileRef}
                className="lg:hidden rounded-lg border border-border bg-base shadow-sm sticky top-22 z-40"
            >
                <button
                    onClick={() => toggleGroup("__mobile_root")}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground"
                >
                    {title}
                    <ChevronDown
                        size={18}
                        className={`transition-transform ${openGroups["__mobile_root"] ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {openGroups["__mobile_root"] && (
                    <div className="border-t border-border p-3">
                        <SidebarContent />
                    </div>
                )}
            </div>
        </>
    );
}
