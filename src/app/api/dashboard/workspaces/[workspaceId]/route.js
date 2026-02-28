import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export async function DELETE(_, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;
  return proxyDashboard(`/dashboard/workspaces/${workspaceId}`, {
    method: "DELETE",
    user,
  });
}
