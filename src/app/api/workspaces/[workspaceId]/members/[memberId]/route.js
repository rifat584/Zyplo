import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export async function PATCH(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;
  const memberId = resolvedParams?.memberId;
  const role = body?.role;

  return proxyDashboard(`/dashboard/workspaces/${workspaceId}/members/${memberId}`, {
    method: "PATCH",
    user,
    body: { role },
  });
}

export async function DELETE(_request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;
  const memberId = resolvedParams?.memberId;

  return proxyDashboard(`/dashboard/workspaces/${workspaceId}/members/${memberId}`, {
    method: "DELETE",
    user,
  });
}
