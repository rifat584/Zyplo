import { Bell } from "lucide-react";
import { BentoCard } from "../BentoCard";

export function UpdatesCard({ notifications }) {
  return (
    <BentoCard
      title="Updates"
      right={<Bell className="h-4 w-4 text-muted-foreground" />}
      className="col-span-1 md:col-span-1 lg:col-span-5"
      delay={0.1}
    >
      <div className="space-y-2">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 dark:border-border dark:bg-[#111A2E]"
            >
              <div className="flex items-start gap-2">
                <Icon className="mt-0.5 h-3.5 w-3.5 text-secondary" />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
