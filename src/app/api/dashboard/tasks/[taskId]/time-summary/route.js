import { requireSessionUser } from "../../../_auth";
import { proxyDashboard } from "../../../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const taskId = resolvedParams?.taskId;

  return proxyDashboard(`/dashboard/tasks/${taskId}/time-summary`, { user });
}
