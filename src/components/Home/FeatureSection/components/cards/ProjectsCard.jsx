import { BentoCard } from "../BentoCard";

export function ProjectsCard({ projects }) {
  return (
    <BentoCard title="Projects" className="col-span-1 md:col-span-1 lg:col-span-5" delay={0.08}>
      <div className="space-y-2.5">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 dark:border-border dark:bg-[#0F1629]"
          >
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <p className="font-medium text-foreground">{project.name}</p>
              <span className="text-muted-foreground">{project.members} members</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-[#111A2E]">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-secondary"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
