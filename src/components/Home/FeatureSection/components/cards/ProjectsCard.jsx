import { BentoCard } from "../BentoCard";

export function ProjectsCard({ projects }) {
  return (
    <BentoCard title="Projects" className="col-span-1 md:col-span-2 lg:col-span-4" delay={0.08}>
      <div className="space-y-2.5">
        {projects.map((project) => (
          <div
            key={project.name}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-2 dark:border-gray-700 dark:bg-[#0F1629]"
          >
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <p className="font-medium text-zinc-700 dark:text-gray-300">{project.name}</p>
              <span className="text-zinc-500 dark:text-gray-400">{project.members} members</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-[#111A2E]">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
