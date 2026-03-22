"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  loadDashboard,
  useMockStore,
} from "@/components/dashboard/mockStore";

export default function WorkspaceLayout({ children }) {
  const params = useParams();
  const router = useRouter();
  const workspaceId =
    typeof params.workspaceId === "string" ? params.workspaceId : "";

  const { loaded, workspaces } = useMockStore((state) => ({
    loaded: Boolean(state.loaded),
    workspaces: state.workspaces || [],
  }));

  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId],
  );

  useEffect(() => {
    loadDashboard({ force: true }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!loaded || !workspaceId || workspace) return;
    router.replace("/dashboard");
  }, [loaded, router, workspace, workspaceId]);

  if (loaded && workspaceId && !workspace) {
    return null;
  }

  return <div className="pt-4 sm:pt-5">{children}</div>;
}
