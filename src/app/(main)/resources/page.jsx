import Link from "next/link";
import { BookOpen, Globe, Video, Users, Code, HelpCircle } from "lucide-react";
import { resources } from "@/lib/resources/resources";

export default function ResourcesHubPage() {
  const iconByHref = {
    "/resources/guide": BookOpen,
    "/resources/remote-work": Globe,
    "/resources/webinars": Video,
    "/resources/customer-stories": Users,
    "/resources/developers": Code,
    "/resources/help": HelpCircle,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Zyplo Resources
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to ship faster and manage your team better.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((item) => {
          const Icon = iconByHref[item.href] || BookOpen;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col items-start justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-primary dark:text-indigo-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={24} />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
