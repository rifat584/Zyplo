import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export async function GET(_request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const projectId = resolvedParams?.projectId;

  return proxyDashboard(`/dashboard/boards/${projectId}`, {
    method: "GET",
    user,
  });
}
