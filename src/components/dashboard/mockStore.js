"use client";

import { useSyncExternalStore } from "react";

const CURRENT_USER = {
  id: "u_1",
  name: "Rifat Hasan",
  email: "rifat@zyplo.dev",
  avatar: "RH",
};

function nowMinus(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function createSeedState() {
  return {
    currentUser: CURRENT_USER,
    workspaces: [
      {
        id: "ws_1",
        name: "Zyplo Labs",
        slug: "zyplo-labs",
        logo: null,
        members: [
          { id: "u_1", name: "Rifat Hasan", email: "rifat@zyplo.dev", role: "Owner", avatar: "RH" },
          { id: "u_2", name: "Nafis Iqbal", email: "nafis@zyplo.dev", role: "Engineer", avatar: "NI" },
          { id: "u_3", name: "Ayesha Noor", email: "ayesha@zyplo.dev", role: "Product", avatar: "AN" },
        ],
      },
      {
        id: "ws_2",
        name: "Client Delivery",
        slug: "client-delivery",
        logo: null,
        members: [
          { id: "u_1", name: "Rifat Hasan", email: "rifat@zyplo.dev", role: "Owner", avatar: "RH" },
          { id: "u_4", name: "Raka Das", email: "raka@zyplo.dev", role: "Designer", avatar: "RD" },
        ],
      },
    ],
    projects: [
      {
        id: "pr_1",
        workspaceId: "ws_1",
        name: "Developer Portal",
        key: "DVP",
        members: ["u_1", "u_2", "u_3"],
        lastUpdatedBy: "Rifat Hasan",
        updatedAt: nowMinus(2),
      },
      {
        id: "pr_2",
        workspaceId: "ws_1",
        name: "Marketing Site Revamp",
        key: "MSR",
        members: ["u_1", "u_3"],
        lastUpdatedBy: "Ayesha Noor",
        updatedAt: nowMinus(18),
      },
      {
        id: "pr_3",
        workspaceId: "ws_2",
        name: "Agency Sprint",
        key: "AGS",
        members: ["u_1", "u_4"],
        lastUpdatedBy: "Raka Das",
        updatedAt: nowMinus(7),
      },
    ],
    tasks: [
      {
        id: "t_1",
        projectId: "pr_1",
        title: "Implement OAuth callback hardening",
        status: "todo",
        priority: "P1",
        assignee: "u_2",
        dueDate: dateOffset(-1),
        tags: ["auth", "security", "blocked"],
        commentsCount: 4,
        description: "Validate provider payload and add stricter token checks.",
      },
      {
        id: "t_2",
        projectId: "pr_1",
        title: "Add onboarding analytics events",
        status: "inprogress",
        priority: "P2",
        assignee: "u_1",
        dueDate: dateOffset(0),
        tags: ["analytics"],
        commentsCount: 2,
        description: "Track workspace create and first-project conversion funnel.",
      },
      {
        id: "t_3",
        projectId: "pr_1",
        title: "Refine card spacing and motion timing",
        status: "done",
        priority: "P3",
        assignee: "u_3",
        dueDate: "2026-02-22",
        tags: ["ui", "polish"],
        commentsCount: 1,
        description: "Ship premium spacing system for app shell and board cards.",
      },
      {
        id: "t_4",
        projectId: "pr_2",
        title: "Hero section final pass",
        status: "todo",
        priority: "P2",
        assignee: "u_3",
        dueDate: dateOffset(2),
        tags: ["copy"],
        commentsCount: 0,
        description: "Align messaging with product roadmap and positioning.",
      },
      {
        id: "t_5",
        projectId: "pr_3",
        title: "Client feedback triage",
        status: "inprogress",
        priority: "P1",
        assignee: "u_4",
        dueDate: dateOffset(1),
        tags: ["client"],
        commentsCount: 6,
        description: "Sort urgent tickets and draft implementation estimates.",
      },
    ],
    activity: [
      {
        id: "a_1",
        workspaceId: "ws_1",
        projectId: "pr_1",
        taskId: "t_2",
        type: "status_change",
        actor: "Rifat Hasan",
        message: "moved task to In Progress",
        createdAt: nowMinus(3),
      },
      {
        id: "a_2",
        workspaceId: "ws_1",
        projectId: "pr_1",
        taskId: "t_1",
        type: "comment",
        actor: "Nafis Iqbal",
        message: "left a security checklist comment",
        createdAt: nowMinus(6),
      },
      {
        id: "a_3",
        workspaceId: "ws_1",
        projectId: "pr_2",
        taskId: "t_4",
        type: "create_task",
        actor: "Ayesha Noor",
        message: "created a new task",
        createdAt: nowMinus(12),
      },
      {
        id: "a_4",
        workspaceId: "ws_2",
        projectId: "pr_3",
        taskId: "t_5",
        type: "comment",
        actor: "Raka Das",
        message: "added sprint screenshots",
        createdAt: nowMinus(8),
      },
    ],
    lastVisited: {
      workspaceId: "ws_1",
      projectId: "pr_1",
      view: "board",
      visitedAt: nowMinus(2),
    },
    notifications: [
      { id: "n_1", text: "Ayesha mentioned you on Developer Portal", read: false, createdAt: nowMinus(1) },
      { id: "n_2", text: "2 tasks are due in the next 48 hours", read: false, createdAt: nowMinus(5) },
      { id: "n_3", text: "Nafis completed OAuth callback hardening", read: true, createdAt: nowMinus(20) },
    ],
  };
}

let state = createSeedState();
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function update(mutator) {
  const draft = {
    ...state,
    workspaces: [...state.workspaces],
    projects: [...state.projects],
    tasks: [...state.tasks],
    activity: [...state.activity],
    notifications: [...state.notifications],
  };
  mutator(draft);
  state = draft;
  emit();
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function getSession() {
  return {
    user: state.currentUser,
    workspaces: state.workspaces,
    projects: state.projects,
    lastVisited: state.lastVisited,
  };
}

export function useMockStore(selector) {
  const snapshot = useSyncExternalStore(subscribe, getState, getState);
  return selector(snapshot);
}

export function resetStore() {
  state = createSeedState();
  emit();
}

export function applyLoginScenario(scenario) {
  if (scenario === "none") {
    update((draft) => {
      draft.workspaces = [];
      draft.projects = [];
      draft.tasks = [];
      draft.activity = [];
      draft.lastVisited = null;
    });
    return;
  }

  if (scenario === "single") {
    update((draft) => {
      draft.workspaces = [draft.workspaces[0]];
      draft.projects = draft.projects.filter((project) => project.workspaceId === draft.workspaces[0].id);
      draft.tasks = draft.tasks.filter((task) => draft.projects.some((project) => project.id === task.projectId));
      draft.activity = draft.activity.filter((entry) => entry.workspaceId === draft.workspaces[0].id);
      draft.lastVisited = null;
    });
    return;
  }

  resetStore();
}

export function getWorkspaceById(workspaceId) {
  return state.workspaces.find((workspace) => workspace.id === workspaceId) || null;
}

export function getProjectsByWorkspace(workspaceId) {
  return state.projects.filter((project) => project.workspaceId === workspaceId);
}

export function getProjectById(projectId) {
  return state.projects.find((project) => project.id === projectId) || null;
}

export function getTasksByProject(projectId) {
  return state.tasks.filter((task) => task.projectId === projectId);
}

export function getActivityForProject(projectId) {
  return state.activity
    .filter((entry) => entry.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function setLastVisited(workspaceId, projectId, view = "board") {
  update((draft) => {
    draft.lastVisited = { workspaceId, projectId, view, visitedAt: new Date().toISOString() };
  });
}

export function updateLastVisited(workspaceId, projectId, view = "board") {
  setLastVisited(workspaceId, projectId, view);
}

export function createWorkspace(name) {
  const workspace = {
    id: createId("ws"),
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    logo: null,
    members: [{ ...CURRENT_USER, role: "Owner" }],
  };

  update((draft) => {
    draft.workspaces = [...draft.workspaces, workspace];
  });

  return workspace;
}

export function createProject(workspaceId, payload) {
  const project = {
    id: createId("pr"),
    workspaceId,
    name: payload.name,
    key: payload.key,
    members: [CURRENT_USER.id],
    lastUpdatedBy: CURRENT_USER.name,
    updatedAt: new Date().toISOString(),
  };

  update((draft) => {
    draft.projects = [...draft.projects, project];
    draft.lastVisited = { workspaceId, projectId: project.id, view: "board", visitedAt: new Date().toISOString() };
    draft.activity = [
      {
        id: createId("a"),
        workspaceId,
        projectId: project.id,
        taskId: null,
        type: "create_project",
        actor: CURRENT_USER.name,
        message: `created project ${payload.name}`,
        createdAt: new Date().toISOString(),
      },
      ...draft.activity,
    ];
  });

  return project;
}

export function getProjectTaskBreakdown(projectId) {
  const now = new Date();
  const tasks = state.tasks.filter((task) => task.projectId === projectId && task.status !== "done");

  let dueToday = 0;
  let inProgress = 0;

  tasks.forEach((task) => {
    if (task.status === "inprogress") inProgress += 1;
    if (task.dueDate) {
      const due = new Date(task.dueDate);
      if (
        due.getFullYear() === now.getFullYear() &&
        due.getMonth() === now.getMonth() &&
        due.getDate() === now.getDate()
      ) {
        dueToday += 1;
      }
    }
  });

  return {
    dueToday,
    inProgress,
    openTasks: tasks.length,
  };
}

export function createTask(projectId, payload) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const task = {
    id: createId("t"),
    projectId,
    title: payload.title,
    status: "todo",
    priority: payload.priority || "P2",
    assignee: payload.assignee || CURRENT_USER.id,
    dueDate: payload.dueDate || "",
    tags: payload.tags || [],
    commentsCount: 0,
    description: payload.description || "",
  };

  update((draft) => {
    draft.tasks = [...draft.tasks, task];
    draft.projects = draft.projects.map((item) =>
      item.id === projectId ? { ...item, updatedAt: new Date().toISOString() } : item
    );
    draft.activity = [
      {
        id: createId("a"),
        workspaceId: project.workspaceId,
        projectId,
        taskId: task.id,
        type: "create_task",
        actor: CURRENT_USER.name,
        message: `created task ${task.title}`,
        createdAt: new Date().toISOString(),
      },
      ...draft.activity,
    ];
  });

  return task;
}

export function updateTask(taskId, patch) {
  const current = state.tasks.find((task) => task.id === taskId);
  if (!current) return;
  const project = getProjectById(current.projectId);
  if (!project) return;

  update((draft) => {
    draft.tasks = draft.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
    draft.projects = draft.projects.map((item) =>
      item.id === current.projectId ? { ...item, updatedAt: new Date().toISOString() } : item
    );
    draft.activity = [
      {
        id: createId("a"),
        workspaceId: project.workspaceId,
        projectId: project.id,
        taskId,
        type: "update_task",
        actor: CURRENT_USER.name,
        message: "updated task details",
        createdAt: new Date().toISOString(),
      },
      ...draft.activity,
    ];
  });
}

export function moveTask(taskId, status) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task || task.status === status) return;

  const project = getProjectById(task.projectId);
  if (!project) return;

  update((draft) => {
    draft.tasks = draft.tasks.map((item) => (item.id === taskId ? { ...item, status } : item));
    draft.activity = [
      {
        id: createId("a"),
        workspaceId: project.workspaceId,
        projectId: task.projectId,
        taskId,
        type: "status_change",
        actor: CURRENT_USER.name,
        message: `moved task to ${status}`,
        createdAt: new Date().toISOString(),
      },
      ...draft.activity,
    ];
  });
}

export function inviteMember(workspaceId, email, role) {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return;

  const member = {
    id: createId("u"),
    name: email.split("@")[0].replace(/\./g, " "),
    email,
    role,
    avatar: email.slice(0, 2).toUpperCase(),
  };

  update((draft) => {
    draft.workspaces = draft.workspaces.map((item) =>
      item.id === workspaceId ? { ...item, members: [...item.members, member] } : item
    );
  });
}

export function updateMemberRole(workspaceId, memberId, role) {
  update((draft) => {
    draft.workspaces = draft.workspaces.map((workspace) => {
      if (workspace.id !== workspaceId) return workspace;
      return {
        ...workspace,
        members: workspace.members.map((member) =>
          member.id === memberId ? { ...member, role } : member
        ),
      };
    });
  });
}

export function removeMember(workspaceId, memberId) {
  update((draft) => {
    draft.workspaces = draft.workspaces.map((workspace) => {
      if (workspace.id !== workspaceId) return workspace;
      return {
        ...workspace,
        members: workspace.members.filter((member) => member.id !== memberId),
      };
    });
  });
}

export function markAllNotificationsRead() {
  update((draft) => {
    draft.notifications = draft.notifications.map((item) => ({ ...item, read: true }));
  });
}

export function getWorkspaceMembers(workspaceId) {
  return getWorkspaceById(workspaceId)?.members || [];
}

export function getMyWorkStats(workspaceId) {
  const workspaceProjects = getProjectsByWorkspace(workspaceId).map((project) => project.id);
  const myTasks = state.tasks.filter(
    (task) => workspaceProjects.includes(task.projectId) && task.assignee === CURRENT_USER.id && task.status !== "done"
  );
  const today = getDayStart();
  const inThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  let dueSoon = 0;
  let overdue = 0;

  myTasks.forEach((task) => {
    if (!task.dueDate) return;
    const due = getDayStart(task.dueDate);
    if (due < today) overdue += 1;
    else if (due <= inThreeDays) dueSoon += 1;
  });

  return {
    assigned: myTasks.length,
    dueSoon,
    overdue,
  };
}

export function getOpenTaskCountByProject(projectId) {
  return state.tasks.filter((task) => task.projectId === projectId && task.status !== "done").length;
}

export function getRecentWorkspaceActivity(workspaceId, limit = 6) {
  return state.activity
    .filter((entry) => entry.workspaceId === workspaceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getWorkspaceOpenTaskCount(workspaceId) {
  const projectIds = state.projects.filter((project) => project.workspaceId === workspaceId).map((project) => project.id);
  return state.tasks.filter((task) => projectIds.includes(task.projectId) && task.status !== "done").length;
}

export function getWorkspaceLastUpdated(workspaceId) {
  const projects = state.projects.filter((project) => project.workspaceId === workspaceId);
  if (projects.length === 0) return null;
  return projects
    .map((project) => project.updatedAt)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

function isSameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDayStart(value = new Date()) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getContinueContext() {
  const fallbackProject = state.projects[0];
  const fallbackWorkspace = fallbackProject
    ? state.workspaces.find((workspace) => workspace.id === fallbackProject.workspaceId)
    : null;

  const workspace =
    state.workspaces.find((item) => item.id === state.lastVisited?.workspaceId) || fallbackWorkspace || null;
  const project =
    state.projects.find((item) => item.id === state.lastVisited?.projectId) || fallbackProject || null;

  if (!workspace || !project) return null;

  const projectTasks = state.tasks.filter((task) => task.projectId === project.id);
  const today = new Date();

  const dueToday = projectTasks.filter((task) => {
    if (!task.dueDate || task.status === "done") return false;
    return isSameDate(new Date(task.dueDate), today);
  }).length;

  const inProgress = projectTasks.filter((task) => task.status === "inprogress").length;
  const openTasks = projectTasks.filter((task) => task.status !== "done").length;

  return { workspace, project, dueToday, inProgress, openTasks };
}

export function getMyWorkTasks(filter = "all", limit = 3) {
  const today = getDayStart();
  const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const mine = state.tasks.filter((task) => task.assignee === state.currentUser.id && task.status !== "done");

  const filtered = mine.filter((task) => {
    if (!task.dueDate) {
      return filter === "assigned" || filter === "all";
    }

    const due = getDayStart(task.dueDate);
    if (filter === "assigned") return true;
    if (filter === "dueSoon") return due >= today && due <= dueSoonLimit;
    if (filter === "overdue") return due < today;
    return true;
  });

  return filtered
    .sort((a, b) => new Date(a.dueDate || "2999-01-01").getTime() - new Date(b.dueDate || "2999-01-01").getTime())
    .slice(0, limit)
    .map((task) => {
      const project = state.projects.find((projectItem) => projectItem.id === task.projectId) || null;
      const workspace = project
        ? state.workspaces.find((workspaceItem) => workspaceItem.id === project.workspaceId) || null
        : null;
      return { ...task, project, workspace };
    });
}

export function getRecentProjects(limit = 5) {
  return [...state.projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
    .map((project) => ({
      ...project,
      workspace: state.workspaces.find((workspace) => workspace.id === project.workspaceId) || null,
    }));
}

export function getProjectStatusMeta(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return null;

  const today = getDayStart();
  const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const tasks = state.tasks.filter((task) => task.projectId === projectId && task.status !== "done");

  const overdueCount = tasks.filter((task) => task.dueDate && getDayStart(task.dueDate) < today).length;
  const dueSoonCount = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = getDayStart(task.dueDate);
    return due >= today && due <= dueSoonLimit;
  }).length;

  let health = "green";
  if (overdueCount > 0) health = "red";
  else if (dueSoonCount > 0) health = "yellow";

  const latestActivity = [...state.activity]
    .filter((entry) => entry.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  return {
    health,
    overdueCount,
    dueSoonCount,
    lastUpdatedBy: latestActivity?.actor || project.lastUpdatedBy || CURRENT_USER.name,
  };
}

export function getProjectLastActivity(projectId) {
  const latestActivity = [...state.activity]
    .filter((entry) => entry.projectId === projectId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (!latestActivity) {
    return {
      actor: CURRENT_USER.name,
      at: new Date().toISOString(),
    };
  }

  return {
    actor: latestActivity.actor,
    at: latestActivity.createdAt,
  };
}

export function getBoardAttentionCounts(projectId, userId = CURRENT_USER.id) {
  const today = getDayStart();
  const dueSoonLimit = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const tasks = state.tasks.filter((task) => task.projectId === projectId && task.status !== "done");

  const overdue = tasks.filter((task) => task.dueDate && getDayStart(task.dueDate) < today).length;
  const dueToday = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = getDayStart(task.dueDate);
    return due.getTime() === today.getTime();
  }).length;
  const blocked = tasks.filter((task) => task.tags.some((tag) => tag.toLowerCase() === "blocked")).length;
  const assignedToMe = tasks.filter((task) => task.assignee === userId).length;
  const dueSoon = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = getDayStart(task.dueDate);
    return due >= today && due <= dueSoonLimit;
  }).length;
  const p1 = tasks.filter((task) => task.priority === "P1").length;

  return {
    overdue,
    dueToday,
    blocked,
    assignedToMe,
    dueSoon,
    p1,
  };
}
