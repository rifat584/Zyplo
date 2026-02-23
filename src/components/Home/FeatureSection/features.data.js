import {
  Bell,
  ClipboardList,
  FileText,
  FolderKanban,
  KanbanSquare,
  Puzzle,
} from "lucide-react";

export const highlightTiles = [
  {
    title: "Kanban Boards",
    description: "Ship roadmap items with clear ownership and delivery lanes.",
    icon: KanbanSquare,
    mockType: "projects",
  },
  {
    title: "Task Details",
    description: "Find context fast with smart suggestions across your workspace.",
    icon: ClipboardList,
    mockType: "brain",
  },
];

export const topSmallTiles = [
  { label: "Tasks", icon: ClipboardList },
  { label: "Projects", icon: FolderKanban },
  { label: "Notifications", icon: Bell },
];

export const bottomSmallTiles = [
  { label: "Integrations", icon: Puzzle },
  { label: "Roadmaps", icon: FileText },
];
