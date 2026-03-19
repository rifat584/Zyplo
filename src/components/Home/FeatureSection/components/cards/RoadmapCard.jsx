import { BentoCard } from "../BentoCard";

export function RoadmapCard({ milestones }) {
  return (
    <BentoCard
      title="Roadmap"
      right={<span className="text-[11px] text-muted-foreground">Q2 targets</span>}
      className="col-span-1 md:col-span-3 lg:col-span-6"
      delay={0.14}
    >
      <div className="grid grid-cols-3 gap-2 text-xs">
        {milestones.map((milestone) => (
          <div
            key={milestone.name}
            className={[
              "rounded-lg border px-2.5 py-2",
              milestone.status === "In Progress"
                ? "border-indigo-300 bg-indigo-50 text-primary dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-primary"
                : "border-zinc-200 bg-zinc-50/70 text-zinc-700 dark:border-border dark:bg-[#111A2E] dark:text-muted-foreground",
            ].join(" ")}
          >
            <p className="font-medium">{milestone.name}</p>
            <p className="mt-1 text-[11px] opacity-75">{milestone.status}</p>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
