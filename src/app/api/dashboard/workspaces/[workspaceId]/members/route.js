import { requireSessionUser } from "../../../_auth";
import { proxyDashboard } from "../../../_backend";

export async function POST(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const resolvedParams = await params;
  const workspaceId = resolvedParams?.workspaceId;
  return proxyDashboard(`/dashboard/workspaces/${workspaceId}/members`, {
    method: "POST",
    user,
    body,
  });
}
