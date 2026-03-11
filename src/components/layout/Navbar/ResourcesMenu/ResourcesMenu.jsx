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
                <div className=" space-y-2 border rounded-xl bg-secondary/15 p-2">
                    {resources.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            onClick={closeAll}
                            className="block py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-secondary/30 p-4 rounded"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        href="/blog"
                        onClick={closeAll}
                        className="block py-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-secondary/40 p-4 rounded"
                    >
                        Zyplo Blog
                    </Link>
                </div>
            )}
        </>
    );
}
