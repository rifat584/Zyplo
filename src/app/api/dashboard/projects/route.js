import { requireSessionUser } from "../_auth";
import { proxyDashboard } from "../_backend";

export async function POST(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  return proxyDashboard("/dashboard/projects", {
    method: "POST",
    user,
    body,
  });
}
