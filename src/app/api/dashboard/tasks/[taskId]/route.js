import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export async function PATCH(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const resolvedParams = await params;
  const taskId = resolvedParams?.taskId;
  return proxyDashboard(`/dashboard/tasks/${taskId}`, {
    method: "PATCH",
    user,
    body,
  });
}
