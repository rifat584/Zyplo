"use client";

import { useEffect, useMemo, useState } from "react";

const PROJECT_SELECTION_KEY_PREFIX = "dashboard.selectedProject.";
const PROJECT_SELECTION_EVENT = "zyplo-project-selection-change";

export function resolveSelectedProjectId(storedProjectId, workspaceProjects = []) {
  const normalizedProjectId = String(storedProjectId || "");

  if (!workspaceProjects.length) {
    return normalizedProjectId;
  }

  return workspaceProjects.some(
    (project) => String(project?.id || "") === normalizedProjectId,
  )
    ? normalizedProjectId
    : String(workspaceProjects[0]?.id || "");
}

export function getProjectSelectionKey(workspaceId) {
  return `${PROJECT_SELECTION_KEY_PREFIX}${workspaceId}`;
}

export function readSelectedProjectId(workspaceId) {
  if (typeof window === "undefined" || !workspaceId) return "";

  try {
    return window.localStorage.getItem(getProjectSelectionKey(workspaceId)) || "";
  } catch {
    return "";
  }
}

export function writeSelectedProjectId(workspaceId, projectId) {
  if (typeof window === "undefined" || !workspaceId) return;

  const nextProjectId = String(projectId || "");

  try {
    if (nextProjectId) {
      window.localStorage.setItem(
        getProjectSelectionKey(workspaceId),
        nextProjectId,
      );
    } else {
      window.localStorage.removeItem(getProjectSelectionKey(workspaceId));
    }

    window.dispatchEvent(
      new CustomEvent(PROJECT_SELECTION_EVENT, {
        detail: { workspaceId, projectId: nextProjectId },
      }),
    );
  } catch {
    // no-op
  }
}

export function useWorkspaceProjectSelection(workspaceId, workspaceProjects = []) {
  const [storedProjectId, setStoredProjectId] = useState("");
  const [hydratedWorkspaceId, setHydratedWorkspaceId] = useState("");
  const hasReadStoredProjectId = hydratedWorkspaceId === workspaceId;

  useEffect(() => {
    setStoredProjectId(readSelectedProjectId(workspaceId));
    setHydratedWorkspaceId(workspaceId);
  }, [workspaceId]);

  useEffect(() => {
    if (typeof window === "undefined" || !workspaceId) return undefined;

    function handleProjectSelection(event) {
      if (event?.detail?.workspaceId !== workspaceId) return;
      setStoredProjectId(String(event.detail?.projectId || ""));
    }

    function handleStorage(event) {
      if (event.key !== getProjectSelectionKey(workspaceId)) return;
      setStoredProjectId(String(event.newValue || ""));
    }

    window.addEventListener(PROJECT_SELECTION_EVENT, handleProjectSelection);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PROJECT_SELECTION_EVENT, handleProjectSelection);
      window.removeEventListener("storage", handleStorage);
    };
  }, [workspaceId]);

  const selectedProjectId = useMemo(
    () =>
      hasReadStoredProjectId
        ? resolveSelectedProjectId(storedProjectId, workspaceProjects)
        : "",
    [hasReadStoredProjectId, storedProjectId, workspaceProjects],
  );

  const selectedProject = useMemo(() => {
    if (!workspaceProjects.length || !selectedProjectId) return null;

    return (
      workspaceProjects.find(
        (project) => String(project.id) === String(selectedProjectId),
      ) || null
    );
  }, [selectedProjectId, workspaceProjects]);

  useEffect(() => {
    if (!workspaceId || !hasReadStoredProjectId) return;

    if (selectedProjectId !== String(storedProjectId || "")) {
      writeSelectedProjectId(workspaceId, selectedProjectId);
    }
  }, [hasReadStoredProjectId, selectedProjectId, storedProjectId, workspaceId]);

  function updateProjectSelection(nextProjectId) {
    writeSelectedProjectId(workspaceId, nextProjectId);
    setStoredProjectId(String(nextProjectId || ""));
  }

  return {
    selectedProject,
    selectedProjectId,
    updateProjectSelection,
  };
}
