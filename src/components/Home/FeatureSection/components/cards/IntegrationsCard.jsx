import { BentoCard } from "../BentoCard";

export function IntegrationsCard({ integrations }) {
  return (
    <BentoCard
      title="Integrations"
      right={
        <span className="inline-flex h-5 items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 text-[10px] text-cyan-700">
          Connected
        </span>
      }
      className="col-span-1 md:col-span-3 lg:col-span-6"
      delay={0.12}
    >
      <div className="flex flex-wrap gap-2">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5 py-2 text-xs dark:border-gray-700 dark:bg-[#111A2E]"
            >
              <Icon className="h-3.5 w-3.5 text-zinc-500 dark:text-gray-400" />
              <span className="font-medium text-zinc-700 dark:text-gray-300">{item.name}</span>
              <span className="text-zinc-500 dark:text-gray-400">Active</span>
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
