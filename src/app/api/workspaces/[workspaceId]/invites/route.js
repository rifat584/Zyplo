import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export async function GET(_request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;

  return proxyDashboard(`/workspaces/${workspaceId}/invites`, {
    method: "GET",
    user,
  });
}

export async function POST(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;

  return proxyDashboard(`/workspaces/${workspaceId}/invites`, {
    method: "POST",
    user,
    body,
  });
}
