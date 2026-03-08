"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

function getInviteManagementError(status, payload, fallback) {
  const message = String(payload?.message || payload?.error || "").trim();

  if (status === 401) return "Please sign in again to manage workspace invites.";
  if (status === 403) return message || "You do not have permission to manage invites in this workspace.";
  if (status === 404) return message || "The workspace or invite could not be found.";
  if (status === 409) return message || "This invite could not be completed because of a conflict.";
  if (status === 400) return message || "The invite request is invalid.";
  if (status === 502) return "The server could not be reached. Please try again shortly.";
  if (status >= 500) return "A server error occurred while managing invites.";

  return message || fallback;
}

export default function WorkspaceMembersPage() {
  const { workspaceId } = useParams();
  const [invites, setInvites] = useState([]);
  const [members, setMembers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "zyplo@inviteMember.com", role: "member" },
  });

  async function fetchInvites() {
    const getInvites = await fetch(`/api/workspaces/${workspaceId}/invites`);
    const res = await getInvites.json();
    if (!getInvites.ok || !res?.ok) {
      throw new Error(
        getInviteManagementError(
          getInvites.status,
          res,
          "Failed to load invites.",
        ),
      );
    }
    setInvites(res?.invites || []);
    setMembers(res?.workspace?.members || []);
  }

  const onSubmit = async ({ email, role }) => {
    const sendData = await fetch(`/api/workspaces/${workspaceId}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, role }),
    });
    const result = await sendData.json();

    if (!sendData.ok || !result?.ok) {
      toast.error(
        getInviteManagementError(
          sendData.status,
          result,
          "Failed to send invite.",
        ),
      );
      return;
    }

    toast.success(result?.message || "Invite created!");
    reset({ email: "", role: "member" });
    await fetchInvites();
  };

  useEffect(() => {
    if (!workspaceId) return;
    fetchInvites().catch((error) => {
      toast.error(String(error?.message || "Failed to load invites."));
    });
  }, [workspaceId]);

  const handleDelete = async (inviteId) => {
    const deleteInvite = await fetch(
      `/api/workspaces/${workspaceId}/invites/${inviteId}`,
      {
        method: "DELETE",
      }
    );
    const res = await deleteInvite.json();
    if (!deleteInvite.ok || !res?.ok) {
      toast.error(
        getInviteManagementError(
          deleteInvite.status,
          res,
          "Could not delete invite.",
        ),
      );
      return;
    }
    toast.success("Invite Deleted");
    await fetchInvites();
  };

  const pendingOrRevokedInvites = invites.filter((invite) => {
    const status = String(invite?.status || "").toLowerCase();
    return status === "pending" || status === "revoked";
  });

  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Invite Users
      </h2>

      <div className="grid gap-2 md:grid-cols-4">
        <input
          type="email"
          placeholder="member@company.com"
          {...register("email")}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 md:col-span-3 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100"
          {...register("role")}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {errors.email ? (
        <p className="text-xs text-rose-600 dark:text-rose-300">{errors.email.message}</p>
      ) : null}

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600"
      >
        Send invite
      </button>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Members
        </p>

        {members.map((member, i) => (
          <div
            key={member?.id || i}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/20"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                  {member?.name || member?.email}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-white/10">
                    {String(member?.role || "member")}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    accepted
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!members.length ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No members loaded.
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Pending / Sent Invites
        </p>
        {pendingOrRevokedInvites.map((invite, i) => (
          <div
            key={invite?._id || i}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-black/20"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                  {invite.email}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-white/10">
                    {invite.role}
                  </span>

                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                    {invite.status}
                  </span>
                </div>
                {invite?.expiresAt ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expires: {new Date(invite.expiresAt).toLocaleString()}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 sm:justify-end">
                <button
                  onClick={() => handleDelete(invite._id)}
                  disabled={!invite?._id}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!pendingOrRevokedInvites.length ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No invites loaded.
          </p>
        ) : null}
      </div>
    </section>
  );
}
