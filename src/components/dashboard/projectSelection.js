"use client";

import { useEffect, useMemo, useState } from "react";

const PROJECT_SELECTION_KEY_PREFIX = "dashboard.selectedProject.";
const PROJECT_SELECTION_EVENT = "zyplo-project-selection-change";

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

  useEffect(() => {
    setStoredProjectId(readSelectedProjectId(workspaceId));
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

  const selectedProject = useMemo(() => {
    if (!workspaceProjects.length) return null;

    const matchedProject = workspaceProjects.find(
      (project) => String(project.id) === String(storedProjectId),
    );

    return matchedProject || workspaceProjects[0] || null;
  }, [storedProjectId, workspaceProjects]);

  useEffect(() => {
    if (!workspaceId) return;

    if (!workspaceProjects.length) {
      if (storedProjectId) writeSelectedProjectId(workspaceId, "");
      return;
    }

    const hasStoredMatch = workspaceProjects.some(
      (project) => String(project.id) === String(storedProjectId),
    );

    if (!hasStoredMatch) {
      writeSelectedProjectId(workspaceId, String(workspaceProjects[0]?.id || ""));
    }
  }, [storedProjectId, workspaceId, workspaceProjects]);

  function updateProjectSelection(nextProjectId) {
    writeSelectedProjectId(workspaceId, nextProjectId);
    setStoredProjectId(String(nextProjectId || ""));
  }

  return {
    selectedProject,
    selectedProjectId: String(selectedProject?.id || ""),
    updateProjectSelection,
  };
}
