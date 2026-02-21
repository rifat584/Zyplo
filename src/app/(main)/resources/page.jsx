"use client";

import { useState } from "react";
import docs from "@/lib/docs.json";
import DocsSidebar from "@/components/resources/ResourcesSidebar/ResourcesSidebar";

export default function DocsPage() {
    const [open, setOpen] = useState(false);

    return (
        <main className="bg-white dark:bg-base">
            <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 grid gap-6 lg:grid-cols-[260px_1fr]">
                <DocsSidebar sections={docs} open={open} onClose={() => setOpen(false)} />

                <div>
                    {/* Mobile toggle */}
                    <div className="mb-4 lg:hidden">
                        <button
                            onClick={() => setOpen(true)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700"
                        >
                            Open Docs Menu
                        </button>
                    </div>

                    <div className="prose prose-zinc max-w-none dark:prose-invert">
                        {docs.map((s) => (
                            <section key={s.id} id={s.id} className="mb-16 scroll-mt-24">
                                <h1 className="first:mt-0 text-3xl font-medium mb-2">{s.title}</h1>
                                {s.body.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
