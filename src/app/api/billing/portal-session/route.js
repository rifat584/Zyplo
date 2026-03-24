import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  return proxyDashboard("/api/billing/portal-session", {
    method: "POST",
    user,
    body,
  });
}
