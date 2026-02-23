"use client";

import { useState } from "react";
import docs from "@/lib/resources/guide.json";
import { Menu } from "lucide-react";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar/ResourcesSidebar";

export default function GuidePage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className="mx-auto max-w-7xl px-6 py-12 grid gap-8 lg:grid-cols-[260px_1fr] bg-base text-foreground">
            {/* Sidebar */}
            <ResourcesSidebar
                sections={docs}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Content */}
            <div>
                {/* Mobile Header Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface/80"
                    >
                        <Menu size={18} />
                        Open guide
                    </button>
                </div>

                <div className="prose max-w-none dark:prose-invert">
                    {docs.map((section) => (
                        <section key={section.id} id={section.id} className="mb-24">
                            <h2>{section.title}</h2>

                            {section.body?.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}

                            {section.subsections?.map((sub) => (
                                <div key={sub.id} id={sub.id} className="mt-10">
                                    <h3>{sub.title}</h3>
                                    {sub.body.map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            ))}
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}