import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  return proxyDashboard("/api/billing/subscription", { method: "GET", user });
}

