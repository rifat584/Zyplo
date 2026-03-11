import { requireSessionUser } from "../../_auth";
import { proxyDashboard } from "../../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const workspaceId = String(body?.workspaceId || "").trim();

  if (!workspaceId) {
    return Response.json({ error: "workspaceId is required" }, { status: 400 });
  }

  return proxyDashboard("/dashboard/github/disconnect", {
    method: "DELETE",
    user,
    body: { workspaceId },
  });
}

