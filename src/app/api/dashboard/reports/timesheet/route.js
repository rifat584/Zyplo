import { requireSessionUser } from "../../../_auth";
import { proxyDashboard } from "../../../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const url = new URL(request.url);
  const qs = url.search ? url.search : "";

  return proxyDashboard(`/dashboard/reports/timesheet${qs}`, { user });
}
