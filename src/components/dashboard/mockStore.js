"use client";

import { useSyncExternalStore } from "react";

let state = {
  currentUser: null,
  workspaces: [],
  tasks: [],
  projects: [],
  activity: [],
  notifications: [],
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
  state = { ...state, ...patch };
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
      const nextState = { ...data, loaded: true };
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
  await request("/api/dashboard/notifications/read-all", { method: "POST" });
  await loadDashboard({ force: true });
}

export function getWorkspaceById(workspaceId) {
  return state.workspaces.find((workspace) => workspace.id === workspaceId) || null;
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
