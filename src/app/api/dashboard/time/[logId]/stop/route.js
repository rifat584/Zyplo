import { requireSessionUser } from "../../../_auth";
import { proxyDashboard } from "../../../_backend";

export async function POST(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const resolvedParams = await params;
  const logId = resolvedParams?.logId;

  return proxyDashboard(`/dashboard/time/${logId}/stop`, {
    method: "POST",
    user,
    body,
  });
}
