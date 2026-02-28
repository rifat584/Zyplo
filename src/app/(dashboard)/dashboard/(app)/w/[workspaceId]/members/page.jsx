"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { inviteMember, useMockStore } from "@/components/dashboard/mockStore";

export default function WorkspaceMembersPage() {
  const params = useParams();
  const workspaceId = typeof params.workspaceId === "string" ? params.workspaceId : "";

  const workspaces = useMockStore((state) => state.workspaces || []);
  const workspace = useMemo(
    () => workspaces.find((item) => item.id === workspaceId) || null,
    [workspaces, workspaceId]
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [submitting, setSubmitting] = useState(false);

  async function onInvite() {
    if (!workspaceId || !email.trim()) return;
    try {
      setSubmitting(true);
      await inviteMember(workspaceId, email.trim(), role);
      setEmail("");
      setRole("Member");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Invite Users</h2>

      <div className="grid gap-2 md:grid-cols-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="member@company.com"
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 md:col-span-3 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onInvite}
        disabled={!email.trim() || submitting}
        className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
      >
        Send invite
      </button>

      <div className="space-y-2">
        {(workspace?.members || []).map((member) => (
          <div key={member.id} className="rounded-xl border border-slate-200 px-3 py-3 text-sm dark:border-white/10">
            <p className="font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{member.email} | {member.role}</p>
          </div>
        ))}
        {!workspace?.members?.length ? <p className="text-sm text-slate-500 dark:text-slate-400">No members found.</p> : null}
      </div>
    </section>
  );
}
