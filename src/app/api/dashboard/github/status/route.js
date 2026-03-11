import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId") || "";

  const qs = new URLSearchParams();
  if (workspaceId) qs.set("workspaceId", workspaceId);

  const path = `/dashboard/github/status${qs.toString() ? `?${qs.toString()}` : ""}`;
  return proxyDashboard(path, { method: "GET", user });
}
