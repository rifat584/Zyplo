"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar/ResourcesSidebar";
import guide from "@/lib/resources/guide.json";

export default function GuidePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-6 pt-6 grid gap-8 lg:grid-cols-[260px_1fr] bg-base text-foreground">
      <ResourcesSidebar
        sections={guide}
        title="Zyplo Guide"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div>
        <div className="prose max-w-none dark:prose-invert">
          {guide.map((section) => (
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