import { requireSessionUser } from "../_auth";
import { buildDashboardAuthHeaders, proxyDashboard } from "../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const response = await proxyDashboard("/dashboard/bootstrap", { user });
  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, { status: response.status });
  }

  // Reuse the signed dashboard token for the socket handshake.
  const socketToken = String(
    buildDashboardAuthHeaders(user)?.Authorization || "",
  ).replace(/^Bearer\s+/i, "");

  return Response.json(
    {
      ...(data || {}),
      socketToken,
    },
    { status: response.status },
  );
}
