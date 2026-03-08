import { requireSessionUser } from "@/app/api/dashboard/_auth";
import { proxyDashboard } from "@/app/api/dashboard/_backend";

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  return proxyDashboard(`/invites/${slug}`, {
    method: "GET",
  });
}

export async function POST(request, { params }) {
  const { user, error } = await requireSessionUser();
  if (error) return error;

  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const body = await request.json().catch(() => ({}));

  return proxyDashboard(`/invites/${slug}`, {
    method: "POST",
    user,
    body,
  });
}
