import { CheckCircle2, Circle } from "lucide-react";
import { BentoCard } from "../BentoCard";

export function TasksCard({ tasks }) {
  return (
    <BentoCard title="Today's Tasks" className="col-span-1 md:col-span-2 lg:col-span-4" delay={0.06}>
      <div className="space-y-2">
        {tasks.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 text-xs dark:border-border dark:bg-[#111A2E]"
          >
            {item.state === "done" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
            ) : item.state === "active" ? (
              <Circle className="h-3.5 w-3.5 fill-indigo-500 text-primary" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-zinc-300 dark:text-gray-600" />
            )}
            <span className="line-clamp-1 text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
