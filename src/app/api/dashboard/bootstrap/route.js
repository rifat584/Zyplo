import { requireSessionUser } from "../_auth";
import { proxyDashboard } from "../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const { user, error } = await requireSessionUser();
  if (error) return error;
  return proxyDashboard("/dashboard/bootstrap", { user });
}
