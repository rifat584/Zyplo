import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export async function DELETE(_request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;
  const inviteId = resolvedParams?.inviteId;

  return proxyDashboard(`/workspaces/${workspaceId}/invites/${inviteId}`, {
    method: "DELETE",
    user,
  });
}
