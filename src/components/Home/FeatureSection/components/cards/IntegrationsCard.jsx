import { BentoCard } from "../BentoCard";

export function IntegrationsCard({ integrations }) {
  return (
    <BentoCard
      title="Integrations"
      right={
        <span className="inline-flex h-5 items-center rounded-full border border-secondary/25 bg-secondary/10 px-2 text-[10px] text-secondary">
          Connected
        </span>
      }
      className="col-span-1 md:col-span-2 lg:col-span-7"
      delay={0.12}
    >
      <div className="flex flex-wrap gap-2">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 text-xs dark:border-border dark:bg-[#111A2E]"
            >
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-muted-foreground">Active</span>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
