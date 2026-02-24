"use client";

import { useState } from "react";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar/ResourcesSidebar";
import guide from "@/lib/resources/guide.json";

export default function GuidePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-6 pt-6 grid gap-8 lg:grid-cols-[260px_1fr] bg-base-100 text-base-content">
      <ResourcesSidebar
        sections={guide}
        title="Zyplo Guide"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div>
        <div className="prose max-w-none dark:prose-invert">
          {guide.map((section) => (
            <section key={section.id} className="mb-24">
              {/* ✅ Anchor for parent section */}
              <div id={section.id} className="h-1 scroll-mt-24" />

              <div className="rounded-3xl border border-base-300 bg-base-100 p-8 md:p-10 shadow-sm">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  {section.title}
                </h2>

                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full rounded-2xl border border-base-300 shadow my-6"
                  />
                )}

                {section.body?.map((p, i) => (
                  <p key={i} className="leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.subsections?.map((sub) => (
                  <div key={sub.id} id={sub.id} className="mt-12">
                    <div className="rounded-2xl border border-base-300 bg-base-200/40 p-6 md:p-8">
                      <h3 className="text-2xl font-semibold mb-4">
                        {sub.title}
                      </h3>

                      {sub.image && (
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="w-full rounded-xl border border-base-300 shadow my-4"
                        />
                      )}

                      {sub.body?.map((p, i) => (
                        <p key={i} className="leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}