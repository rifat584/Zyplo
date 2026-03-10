import { requireSessionUser } from "../_auth";
import { proxyDashboard } from "../_backend";

export async function GET() {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  return proxyDashboard("/dashboard/profile", {
    method: "GET",
    user,
  });
}

export async function PATCH(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  return proxyDashboard("/dashboard/profile", {
    method: "PATCH",
    user,
    body,
  });
}
