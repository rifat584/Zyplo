import { redirect } from "next/navigation";

export default async function WorkspaceActivityRedirect({ params }) {
  const resolvedParams = await params;
  redirect(`/dashboard/w/${resolvedParams.workspaceId}/timeline`);
}
