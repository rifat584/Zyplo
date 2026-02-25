import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export async function POST() {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  return proxyDashboard("/dashboard/notifications/read-all", {
    method: "POST",
    user,
  });
}
