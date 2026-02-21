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
                <div className="absolute top-14 -right-90 w-180 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl p-6 grid grid-cols-3 gap-6">
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                        {resources.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setResourcesOpen(false)}
                                className="block rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <p className="font-semibold mb-1">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </Link>
                        ))}
                    </div>

                    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 flex flex-col justify-between">
                        <div>
                            <p className="font-semibold mb-2">Helping teams work better</p>
                            <p className="text-sm text-gray-500">
                                Guides, tips, and best practices for using Zyplo effectively.
                            </p>
                        </div>
                        <Link
                            href="/blog"
                            onClick={() => setResourcesOpen(false)}
                            className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium"
                        >
                            Visit Zyplo Blog
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Resources Submenu */}
            {mobileResourcesOpen && (
                <div className="pl-4 space-y-2">
                    {resources.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            onClick={closeAll}
                            className="block py-1 text-sm text-gray-600 dark:text-gray-300"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <Link
                        href="/blog"
                        onClick={closeAll}
                        className="block py-1 text-sm font-medium"
                    >
                        Zyplo Blog
                    </Link>
                </div>
            )}
        </>
    );
}