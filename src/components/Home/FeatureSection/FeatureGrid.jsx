import { motion } from "framer-motion";
import {
  integrations,
  kanbanColumns,
  milestones,
  notifications,
  projects,
  tasks,
} from "./data";
import { IntegrationsCard } from "./components/cards/IntegrationsCard";
import { IssueDetailsCard } from "./components/cards/IssueDetailsCard";
import { KanbanCard } from "./components/cards/KanbanCard";
import { ProjectsCard } from "./components/cards/ProjectsCard";
import { RoadmapCard } from "./components/cards/RoadmapCard";
import { TasksCard } from "./components/cards/TasksCard";
import { UpdatesCard } from "./components/cards/UpdatesCard";

export function FeatureGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto mt-12 w-full max-w-5xl"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        <KanbanCard columns={kanbanColumns} />
        <IssueDetailsCard />
        <TasksCard tasks={tasks} />
        <ProjectsCard projects={projects} />
        <UpdatesCard notifications={notifications} />
        <IntegrationsCard integrations={integrations} />
        <RoadmapCard milestones={milestones} />
      </div>
    </motion.div>
  );
}
