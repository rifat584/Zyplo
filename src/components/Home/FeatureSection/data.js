import { Bell, Github, Layers3, MessageSquare, Rocket, Slack } from "lucide-react";

export const kanbanColumns = [
  {
    title: "Backlog",
    tasks: [{ title: "Auth middleware cleanup", due: "Mar 4" }],
  },
  {
    title: "In Progress",
    tasks: [{ title: "Fix data sync race", priority: "P1", assignee: "RM" }],
  },
  {
    title: "Review",
    tasks: [{ title: "PR #156 - WS cleanup" }],
  },
];

export const tasks = [
  { label: "Fix cache invalidation edge case", state: "done" },
  { label: "Write migration guide for v2 schema", state: "active" },
  { label: "QA subscription + coupon flows", state: "idle" },
];

export const projects = [
  { name: "Core Platform", progress: 76, members: 7 },
  { name: "API v2 Rollout", progress: 52, members: 5 },
];

export const notifications = [
  { title: "PR #156 merged into Sprint Board", time: "Just now", icon: Bell },
  {
    title: "Mentioned in Docs: API Pagination Strategy",
    time: "1h",
    icon: MessageSquare,
  },
];

export const integrations = [
  { name: "GitHub", icon: Github },
  { name: "Vercel", icon: Rocket },
  { name: "Slack", icon: Slack },
  { name: "Sentry", icon: Layers3 },
];

export const milestones = [
  { name: "Auth Hardening", status: "Planned" },
  { name: "API v2 Beta", status: "In Progress" },
  { name: "Production Rollout", status: "Planned" },
];
