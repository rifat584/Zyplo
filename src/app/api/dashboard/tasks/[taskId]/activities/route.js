import { proxyDashboard } from "../../../_backend";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public endpoint on the Express backend; do not require a session here.
export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const taskId = resolvedParams?.taskId;
  return proxyDashboard(`/dashboard/tasks/${taskId}/activities`, { method: "GET" });
}
