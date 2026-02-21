import {
  Clock3,
  GitPullRequest,
  LayoutGrid,
} from "lucide-react";

export const EASE = [0.22, 1, 0.36, 1];

export const kanbanColumns = [
  {
    id: "backlog",
    name: "Backlog",
    icon: LayoutGrid,
    tasks: [
      {
        id: "task-auth-middleware",
        title: "Refactor auth middleware",
        due: "Today",
        priority: "High",
        comments: 6,
        assignees: ["AL", "RP"],
        status: "Queued",
        description:
          "Split token validation from route guards and isolate tenant checks for cleaner test coverage.",
        activity: [
          "Maya linked auth fallback notes.",
          "Rifat added middleware benchmark results.",
          "Lipi confirmed route matrix coverage.",
        ],
      },
      {
        id: "task-docs-pagination",
        title: "Docs: API pagination notes",
        due: "Thu",
        priority: "Med",
        comments: 2,
        assignees: ["RP", "MK"],
        status: "Queued",
        description:
          "Document cursor guarantees and backfill behavior before API v2 cutover.",
        activity: [
          "Priya updated cursor examples.",
          "Al Helal added QA checklist links.",
        ],
      },
    ],
  },
  {
    id: "in-progress",
    name: "In Progress",
    icon: Clock3,
    tasks: [
      {
        id: "task-sync-race",
        title: "Fix race condition in sync",
        due: "Wed",
        priority: "High",
        comments: 9,
        assignees: ["MK", "TN", "RP"],
        status: "In Progress",
        description:
          "Retry sync on stale websocket sessions and prevent duplicate state writes during reconnect.",
        activity: [
          "Priya updated acceptance checks.",
          "Maya linked release checklist.",
          "Rifat added sync failure logs.",
        ],
      },
      {
        id: "task-review-pr-142",
        title: "Review PR #142",
        due: "Today",
        priority: "Med",
        comments: 4,
        assignees: ["TN", "AL"],
        status: "Review",
        description:
          "Validate API naming consistency and rollback behavior before merge into release branch.",
        activity: [
          "Lin requested API naming updates.",
          "Maya attached QA notes.",
          "Rifat added rollback checklist.",
        ],
      },
    ],
  },
  {
    id: "review",
    name: "Review",
    icon: GitPullRequest,
    tasks: [
      {
        id: "task-deploy-132",
        title: "Deploy v1.3.2 to staging",
        due: "Now",
        priority: "High",
        comments: 3,
        assignees: ["JD", "LP"],
        status: "Review",
        description:
          "Promote staging build and validate migration logs, notifications, and session continuity.",
        activity: ["Israt attached deployment notes.", "Lipi approved staging readiness."],
      },
      {
        id: "task-org-roles-matrix",
        title: "Add org roles matrix",
        due: "Fri",
        priority: "Low",
        comments: 1,
        assignees: ["PS", "MK"],
        status: "Review",
        description:
          "Finalize member/admin visibility matrix and confirm settings scope for workspace-level changes.",
        activity: ["Rifat linked permission docs.", "Maya reviewed role inheritance notes."],
      },
    ],
  },
];

export const docsPreviewLines = [
  "API Pagination Notes",
  "Cursor strategy",
  "Backfill edge cases",
  "Keep page boundaries deterministic",
  "Guard race paths during sync retries",
];

export const projects = [
  {
    id: "project-web-core",
    name: "Web App Core",
    status: "On track",
    progress: 68,
    owners: ["MK", "TN", "PS"],
  },
  {
    id: "project-billing-plans",
    name: "Billing & Plans",
    status: "At risk",
    progress: 42,
    owners: ["AL", "RP"],
  },
  {
    id: "project-api-v2",
    name: "API v2 Rollout",
    status: "On track",
    progress: 81,
    owners: ["JD", "LP", "MK"],
  },
];

export const notificationToggles = [
  { id: "release-blockers", label: "Release blockers", enabled: true },
  { id: "mentions-replies", label: "Mentions & replies", enabled: true },
  { id: "assigned-to-me", label: "Assigned to me", enabled: true },
  { id: "pr-linked", label: "PR linked", enabled: true },
  { id: "daily-summary", label: "Daily summary", enabled: false },
];

export const roles = [
  { role: "Admin", boards: "Edit", admin: "Yes" },
  { role: "Member", boards: "Edit", admin: "No" },
];

export const integrations = ["GitHub", "Slack", "Sentry", "Vercel", "Linear", "Notion", "+12"];

export const activityItems = [
  "Israt moved Review PR #142 to done",
  "Al Helal linked API pagination docs to board",
  "Lipi changed release priority to High",
];

export const mobileTourTabs = [
  { id: "tasks", label: "Tasks" },
  { id: "docs", label: "Docs" },
  { id: "activity", label: "Activity" },
  { id: "roles", label: "Roles & Integrations" },
  { id: "notifications", label: "Notifications" },
];
