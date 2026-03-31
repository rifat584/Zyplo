"use client";

import { useSyncExternalStore } from "react";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function resolveMemberMatch(member, user) {
  const userId = String(user?.id || "");
  const userEmail = normalizeEmail(user?.email);
  const memberUserId = String(member?.userId || member?.id || "");
  const memberEmail = normalizeEmail(member?.email);

  return Boolean(
    (userId && memberUserId === userId) ||
      (userEmail && memberEmail === userEmail),
  );
}

function syncCurrentUserIntoWorkspaces(snapshot) {
  const currentUser = snapshot?.currentUser || null;
  const workspaces = Array.isArray(snapshot?.workspaces) ? snapshot.workspaces : null;
  if (!currentUser || !workspaces?.length) return snapshot;

  let workspacesChanged = false;
  const nextWorkspaces = workspaces.map((workspace) => {
    const members = Array.isArray(workspace?.members) ? workspace.members : null;
    if (!members?.length) return workspace;

    let membersChanged = false;
    const nextMembers = members.map((member) => {
      if (!resolveMemberMatch(member, currentUser)) return member;

      const mergedMember = {
        ...member,
        name: currentUser?.name || member?.name,
        email: currentUser?.email || member?.email,
        avatarUrl: currentUser?.avatarUrl || member?.avatarUrl || "",
      };

      const changed =
        mergedMember.name !== member?.name ||
        mergedMember.email !== member?.email ||
        mergedMember.avatarUrl !== (member?.avatarUrl || "");

      if (changed) membersChanged = true;
      return changed ? mergedMember : member;
    });

    if (!membersChanged) return workspace;
    workspacesChanged = true;
    return { ...workspace, members: nextMembers };
  });

  if (!workspacesChanged) return snapshot;
  return { ...snapshot, workspaces: nextWorkspaces };
}

let state = {
  currentUser: null,
  workspaces: [],
  tasks: [],
  projects: [],
  activity: [],
  notifications: [],
  socketToken: "",
  lastVisited: null,
  loaded: false,
  loading: false,
};

const listeners = new Set();
let pendingLoad = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch) {
  state = syncCurrentUserIntoWorkspaces({ ...state, ...patch });
  emit();
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.error || "Request failed";
    throw new Error(message);
  }

  return data;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState() {
  return state;
}

export function useMockStore(selector) {
  const snapshot = useSyncExternalStore(subscribe, getState, getState);
  return selector(snapshot);
}

export async function loadDashboard(options = {}) {
  const force = Boolean(options?.force);
  const silent = Boolean(options?.silent);

  if (state.loading && pendingLoad) {
    if (!force) return pendingLoad;
    try {
      await pendingLoad;
    } catch {
      // ignore and continue with forced reload
    }
  }

  if (!silent) setState({ loading: true });
  const loadPromise = (async () => {
    try {
      const data = await request("/api/dashboard/bootstrap");
      const nextState = {
        ...data,
        loaded: true,
        socketToken: String(data?.socketToken || ""),
      };
      if (!silent) nextState.loading = false;
      setState(nextState);
    } catch (error) {
      const nextState = { loaded: true };
      if (!silent) nextState.loading = false;
      setState(nextState);
      throw error;
    }
  })();
  pendingLoad = loadPromise;

  try {
    await loadPromise;
  } finally {
    if (pendingLoad === loadPromise) pendingLoad = null;
  }
}

// Add a live notification once and keep the list deduped by id.
export function receiveLiveNotification(notification) {
  if (!notification?.id) return;
  if (state.notifications.some((item) => item.id === notification.id)) return;

  setState({
    notifications: [notification, ...state.notifications],
  });
}

// Mark the current notification list as read in local state.
export function readAllNotificationsLocally() {
  setState({
    notifications: state.notifications.map((item) =>
      item?.read ? item : { ...item, read: true },
    ),
  });
}

export async function createWorkspace(name, memberEmails = []) {
  const data = await request("/api/dashboard/workspaces", {
    method: "POST",
    body: JSON.stringify({ name, memberEmails }),
  });
  await loadDashboard({ force: true });
  return data.workspace;
}

export async function deleteWorkspace(workspaceId) {
  await request(`/api/dashboard/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
  setState({
    workspaces: state.workspaces.filter((workspace) => workspace.id !== workspaceId),
    projects: state.projects.filter((project) => project.workspaceId !== workspaceId),
    tasks: state.tasks.filter((task) => task.workspaceId !== workspaceId),
  });
  await loadDashboard({ force: true });
}

export async function createProject(workspaceId, name, key = "") {
  const data = await request("/api/dashboard/projects", {
    method: "POST",
    body: JSON.stringify({ workspaceId, name, key }),
  });
  await loadDashboard({ force: true });
  return data.project;
}

export async function inviteMember(workspaceId, email, role = "Member") {
  const data = await request(`/api/dashboard/workspaces/${workspaceId}/members`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  await loadDashboard({ force: true });
  return data.member;
}

export async function createTask(payload) {
  const data = await request("/api/dashboard/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await loadDashboard({ force: true });
  return data.task;
}

export async function updateTask(taskId, patch) {
  try {
    const data = await request(`/api/dashboard/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    await loadDashboard({ force: true });
    return data.task;
  } catch (error) {
    // Some backend setups update the task but still return 404 "Task not found".
    if (error?.message === "Task not found") {
      await loadDashboard({ force: true });
      return state.tasks.find((item) => item.id === taskId) || null;
    }
    throw error;
  }
}

export async function markAllNotificationsRead() {
  const previousNotifications = state.notifications;
  readAllNotificationsLocally();

  try {
    await request("/api/dashboard/notifications/read-all", { method: "POST" });
  } catch (error) {
    setState({ notifications: previousNotifications });
    throw error;
  }
}

export async function refreshNotifications() {
  const data = await request("/api/dashboard/bootstrap");
  setState({
    notifications: Array.isArray(data?.notifications) ? data.notifications : [],
  });
  return state.notifications;
}

export async function updateProfile(patch) {
  const data = await request("/api/dashboard/profile", {
    method: "PATCH",
    body: JSON.stringify(patch || {}),
  });

  if (data?.currentUser) {
    setState({ currentUser: data.currentUser });
  }
  await loadDashboard({ force: true, silent: true });
  return data?.currentUser || null;
}

export function getWorkspaceById(workspaceId) {
  return state.workspaces.find((workspace) => workspace.id === workspaceId) || null;
}

export function resolveWorkspaceRole(workspace, user) {
  const userId = String(user?.id || "");
  const userEmail = normalizeEmail(user?.email);

  const member = (workspace?.members || []).find((item) => {
    const memberUserId = String(item?.userId || item?.id || "");
    const memberEmail = normalizeEmail(item?.email);

    return (userId && memberUserId === userId) || (userEmail && memberEmail === userEmail);
  });

  // Some legacy workspaces store the workspace owner role as "owner".
  // Treat it as admin for UI gating; backend remains the source of truth.
  const role = String(member?.role || "").toLowerCase();
  return role === "owner" ? "admin" : role;
}

export function useWorkspaceAccess(workspaceId) {
  return useMockStore((state) => {
    const workspace = (state.workspaces || []).find((item) => item.id === workspaceId) || null;
    const currentUser = state.currentUser || null;
    const role = resolveWorkspaceRole(workspace, currentUser);

    return {
      workspace,
      currentUser,
      role,
      isAdmin: role === "admin",
    };
  });
}

export function getWorkspaceMembers(workspaceId) {
  return getWorkspaceById(workspaceId)?.members || [];
}

export function setLastVisited(workspaceId) {
  setState({ lastVisited: { workspaceId, visitedAt: new Date().toISOString() } });
}

export function getProjectsByWorkspace(workspaceId) {
  return state.projects.filter((project) => project.workspaceId === workspaceId);
}
