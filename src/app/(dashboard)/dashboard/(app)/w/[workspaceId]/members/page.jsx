"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import InviteDialog from "@/components/dashboard/dialogs/InviteDialog";
import { Avatar } from "@/components/dashboard/ui";
import { removeMember, updateMemberRole, useMockStore } from "../../../../_lib/mockStore";

const ROLES = ["Owner", "Admin", "Member", "Viewer"];

export default function MembersPage() {
  const params = useParams();
  const [inviteOpen, setInviteOpen] = useState(false);
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const workspace = useMockStore((s) => s.workspaces.find((item) => item.id === workspaceId) || null);
  const currentUserId = useMockStore((s) => s.currentUser.id);

  if (!workspace) return <p className="text-sm text-slate-600">Workspace not found.</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Workspace Access</p>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Members & Roles</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage access and permissions for {workspace.name}.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="size-4" />
          Invite
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Total Members</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{workspace.members.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Admins + Owner</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{workspace.members.filter((m) => m.role === "Owner" || m.role === "Admin").length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Contributors</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{workspace.members.filter((m) => m.role === "Member").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        {workspace.members.map((member) => (
          <div key={member.id} className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-white/10">
            <Avatar name={member.name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
              {member.role === "Owner" || member.role === "Admin" ? <ShieldCheck className="size-3.5" /> : <Users className="size-3.5" />}
              {member.role}
            </span>

            <select
              value={member.role}
              onChange={(event) => updateMemberRole(workspaceId, member.id, event.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              disabled={member.id === currentUserId}
              onClick={() => {
                if (confirm(`Remove ${member.name} from workspace?`)) {
                  removeMember(workspaceId, member.id);
                }
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} workspaceId={workspaceId} />
    </div>
  );
}
