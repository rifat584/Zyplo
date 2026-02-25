"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useMockStore } from "./mockStore";

export default function BreadcrumbNav() {
  const pathname = usePathname();
  const params = useParams();

  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";

  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);
  const project = useMockStore((s) => s.projects.find((item) => item.id === projectId) || null);

  let crumbs = [{ label: "Workspaces", href: "/dashBoardTest/workspaces" }];

  if (pathname === "/dashBoardTest/my-work") {
    crumbs = [
      { label: "Workspaces", href: "/dashBoardTest/workspaces" },
      { label: "My Work", href: "/dashBoardTest/my-work" },
    ];
  } else if (pathname === "/dashBoardTest/activity") {
    crumbs = [
      { label: "Workspaces", href: "/dashBoardTest/workspaces" },
      { label: "Activity", href: "/dashBoardTest/activity" },
    ];
  } else if (workspace && project && pathname.includes("/p/")) {
    crumbs = [
      { label: "Workspaces", href: "/dashBoardTest/workspaces" },
      { label: workspace.name, href: `/dashBoardTest/w/${workspace.id}` },
      { label: project.name, href: `/dashBoardTest/w/${workspace.id}/p/${project.id}` },
    ];
  } else if (workspace && pathname.includes(`/w/${workspace.id}`)) {
    crumbs = [
      { label: "Workspaces", href: "/dashBoardTest/workspaces" },
      { label: workspace.name, href: `/dashBoardTest/w/${workspace.id}` },
    ];
  }

  return (
    <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index > 0 ? <ChevronRight className="size-3 text-slate-400" /> : null}
          <Link href={crumb.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            {crumb.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
