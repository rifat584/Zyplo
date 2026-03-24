import { requireSessionUser } from "../../../../_auth";
import { proxyDashboard } from "../../../../_backend";

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
