import { motion } from "framer-motion";
import { FolderGit2 } from "lucide-react";
import CardShell from "../ui/CardShell";
import { EASE } from "../data";

function Avatar({ initials }) {
  return <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{initials}</span>;
}

export default function ProjectsCard({ projects, reducedMotion, limit }) {
  const list = typeof limit === "number" ? projects.slice(0, limit) : projects;
  return (
    <CardShell className="p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Projects</h3>
        <FolderGit2 className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Track scope, progress, and owners in one glance.</p>
      <div className="mt-3 space-y-2.5">
        {list.map((project) => (
          <div key={project.id} className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">{project.name}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] ${project.status === "On track" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"}`}>{project.status}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <motion.div
                initial={{ width: reducedMotion ? `${project.progress}%` : 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease: EASE }}
                className="h-2 rounded-full bg-cyan-500"
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{project.progress}%</span>
              <div className="flex items-center gap-1">{project.owners.map((owner) => <Avatar key={`${project.id}-${owner}`} initials={owner} />)}</div>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
