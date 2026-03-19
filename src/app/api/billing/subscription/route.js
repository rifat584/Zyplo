import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const workspaceId = String(searchParams.get("workspaceId") || "").trim();

  const qs = new URLSearchParams();
  if (workspaceId) qs.set("workspaceId", workspaceId);

  const path = `/api/billing/subscription${qs.toString() ? `?${qs.toString()}` : ""}`;
  return proxyDashboard(path, { method: "GET", user });
}
