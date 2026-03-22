"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, RefreshCw, UserPlus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  loadDashboard,
  useMockStore,
  useWorkspaceAccess,
} from "@/components/dashboard/mockStore";
import { Avatar } from "@/components/dashboard/ui";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import z from "zod";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

function getWorkspaceAccessError(status, payload, fallback) {
  const message = String(payload?.message || payload?.error || "").trim();

  if (status === 401)
    return "Please sign in again to manage workspace access.";
  if (status === 403)
    return (
      message || "You do not have permission to manage access in this workspace."
    );
  if (status === 404)
    return message || "The workspace, member, or invite could not be found.";
  if (status === 409)
    return message || "This request could not be completed because of a conflict.";
  if (status === 400)
    return message || "This access request is invalid.";
  if (status === 502)
    return "The server could not be reached. Please try again shortly.";
  if (status >= 500)
    return "A server error occurred while managing workspace access.";

  return message || fallback;
}

function AccessConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  destructive = false,
  onClose,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape" && !busy) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/72 px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={() => {
          if (busy) return;
          onClose();
        }}
        className="absolute inset-0"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-access-confirm-title"
        className="relative w-full max-w-lg rounded-xl border border-border/70 bg-card p-6 text-card-foreground"
      >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="space-y-2">
              <h2
                id="workspace-access-confirm-title"
                className="font-heading text-lg font-semibold tracking-tight text-foreground"
              >
                {title}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                disabled={busy}
                className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  destructive
                    ? "bg-destructive text-destructive-foreground shadow-none hover:scale-100 hover:bg-destructive/90 hover:shadow-none"
                    : "bg-primary text-primary-foreground shadow-none hover:scale-100 hover:bg-primary hover:shadow-none",
                )}
              >
                {busy ? "Working..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceMembersPage() {
  const params = useParams();
  const workspaceId =
    typeof params?.workspaceId === "string" ? params.workspaceId : "";
  const { loaded, loading } = useMockStore((state) => ({
    loaded: state.loaded,
    loading: state.loading,
  }));
  const { workspace, isAdmin } = useWorkspaceAccess(workspaceId);
  const [invites, setInvites] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState("");
  const [revokingInviteId, setRevokingInviteId] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const inviteEmailInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "member" },
  });
  const { ref: inviteEmailFieldRef, ...inviteEmailField } = register("email");

  useEffect(() => {
    if (!inviteDialogOpen) return;
    reset({ email: "", role: "member" });
    requestAnimationFrame(() => {
      inviteEmailInputRef.current?.focus();
    });
  }, [inviteDialogOpen, reset]);

  const fetchInvites = useCallback(async () => {
    if (!workspaceId || !isAdmin) return;

    try {
      setLoadingInvites(true);
      setInviteError("");
      const response = await fetch(`/api/workspaces/${workspaceId}/invites`, {
        cache: "no-store",
      });
      const res = await response.json();

      if (!response.ok || !res?.ok) {
        throw new Error(
          getWorkspaceAccessError(
            response.status,
            res,
            "Failed to load invites.",
          ),
        );
      }

      setInvites(Array.isArray(res?.invites) ? res.invites : []);
    } catch (error) {
      const message = String(error?.message || "Failed to load invites.");
      setInviteError(message);
      throw error;
    } finally {
      setLoadingInvites(false);
    }
  }, [isAdmin, workspaceId]);

  useEffect(() => {
    if (!workspaceId || !isAdmin) {
      setInvites([]);
      setInviteError("");
      return;
    }

    fetchInvites().catch((error) => {
      toast.error(String(error?.message || "Failed to load invites."));
    });
  }, [fetchInvites, isAdmin, workspaceId]);

  const members = Array.isArray(workspace?.members) ? workspace.members : [];
  const adminCount = members.reduce((count, member) => {
    const role = String(member?.role || "").toLowerCase();
    return count + (role === "admin" || role === "owner" ? 1 : 0);
  }, 0);
  const pendingInvites = invites.filter((invite) => {
    const status = String(invite?.status || "").toLowerCase();
    return status === "pending" || status === "sent";
  });
  const confirmMemberId = String(confirmation?.member?.id || "");
  const confirmInviteId = String(confirmation?.invite?._id || "");
  const confirmBusy =
    (confirmation?.type === "role" && updatingMemberId === confirmMemberId) ||
    (confirmation?.type === "remove" && removingMemberId === confirmMemberId) ||
    (confirmation?.type === "invite" && revokingInviteId === confirmInviteId);

  const onSubmit = async ({ email, role }) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can send invites.");
      return;
    }

    const response = await fetch(`/api/workspaces/${workspaceId}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, role }),
    });
    const result = await response.json();

    if (!response.ok || !result?.ok) {
      toast.error(
        getWorkspaceAccessError(
          response.status,
          result,
          "Failed to send invite.",
        ),
      );
      return;
    }

    toast.success(result?.message || "Invite created");
    reset({ email: "", role: "member" });
    setInviteDialogOpen(false);
    await fetchInvites().catch(() => {});
  };

  const handleRoleUpdate = async (member, nextRole) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can update member roles.");
      return;
    }

    const memberId = String(member?.id || "");
    const currentRole = String(member?.role || "").toLowerCase();
    const effectiveRole = currentRole === "owner" ? "admin" : currentRole;
    const isLastAdmin = adminCount === 1 && effectiveRole === "admin";

    if (isLastAdmin) {
      toast.error("This workspace must keep at least one admin.");
      return;
    }

    if (!memberId || !nextRole || nextRole === effectiveRole) {
      return;
    }

    try {
      setUpdatingMemberId(memberId);
      const response = await fetch(
        `/api/dashboard/workspaces/${workspaceId}/members/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: nextRole }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result?.member) {
        throw new Error(
          getWorkspaceAccessError(
            response.status,
            result,
            "Failed to update member role.",
          ),
        );
      }

      await loadDashboard({ force: true, silent: true });
      await fetchInvites().catch(() => {});
      toast.success(result?.message || "Member role updated");
    } catch (error) {
      toast.error(String(error?.message || "Failed to update member role."));
    } finally {
      setUpdatingMemberId("");
    }
  };

  const handleRemoveMember = async (member) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can remove members.");
      return;
    }

    const memberId = String(member?.id || "");
    const currentRole = String(member?.role || "").toLowerCase();
    const effectiveRole = currentRole === "owner" ? "admin" : currentRole;
    const isLastAdmin = adminCount === 1 && effectiveRole === "admin";

    if (!memberId || removingMemberId) return;

    if (isLastAdmin) {
      toast.error("This workspace must keep at least one admin.");
      return;
    }

    try {
      setRemovingMemberId(memberId);
      const response = await fetch(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        {
          method: "DELETE",
        },
      );
      const res = await response.json();

      if (!response.ok || !res?.ok) {
        throw new Error(
          getWorkspaceAccessError(
            response.status,
            res,
            "Failed to remove member.",
          ),
        );
      }

      await loadDashboard({ force: true, silent: true });
      await fetchInvites().catch(() => {});
      toast.success(res?.message || "Member removed");
    } catch (error) {
      toast.error(String(error?.message || "Failed to remove member."));
    } finally {
      setRemovingMemberId("");
    }
  };

  const handleDeleteInvite = async (invite) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can cancel invites.");
      return;
    }

    const inviteId = String(invite?._id || "");

    if (!inviteId || revokingInviteId) return;

    try {
      setRevokingInviteId(inviteId);
      const response = await fetch(
        `/api/workspaces/${workspaceId}/invites/${inviteId}`,
        {
          method: "DELETE",
        },
      );
      const res = await response.json();

      if (!response.ok || !res?.ok) {
        throw new Error(
          getWorkspaceAccessError(
            response.status,
            res,
            "Could not cancel invite.",
          ),
        );
      }

      toast.success(res?.message || "Invite canceled");
      await fetchInvites().catch(() => {});
    } catch (error) {
      toast.error(String(error?.message || "Could not cancel invite."));
    } finally {
      setRevokingInviteId("");
    }
  };

  const requestRoleUpdate = (member, nextRole) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can update member roles.");
      return;
    }

    const memberId = String(member?.id || "");
    const currentRole = String(member?.role || "").toLowerCase();
    const effectiveRole = currentRole === "owner" ? "admin" : currentRole;
    const isLastAdmin = adminCount === 1 && effectiveRole === "admin";

    if (isLastAdmin) {
      toast.error("This workspace must keep at least one admin.");
      return;
    }

    if (!memberId || !nextRole || nextRole === effectiveRole) return;

    setConfirmation({
      type: "role",
      member,
      nextRole,
    });
  };

  const requestRemoveMember = (member) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can remove members.");
      return;
    }

    const currentRole = String(member?.role || "").toLowerCase();
    const effectiveRole = currentRole === "owner" ? "admin" : currentRole;
    const isLastAdmin = adminCount === 1 && effectiveRole === "admin";

    if (!String(member?.id || "") || removingMemberId || isLastAdmin) {
      if (isLastAdmin) {
        toast.error("This workspace must keep at least one admin.");
      }
      return;
    }

    setConfirmation({
      type: "remove",
      member,
    });
  };

  const requestDeleteInvite = (invite) => {
    if (!isAdmin) {
      toast.error("Only workspace admins can cancel invites.");
      return;
    }

    if (!String(invite?._id || "") || revokingInviteId) return;

    setConfirmation({
      type: "invite",
      invite,
    });
  };

  const closeConfirmation = () => {
    if (confirmBusy) return;
    setConfirmation(null);
  };

  const handleConfirmAction = async () => {
    if (confirmation?.type === "role") {
      await handleRoleUpdate(confirmation.member, confirmation.nextRole);
      setConfirmation(null);
      return;
    }

    if (confirmation?.type === "remove") {
      await handleRemoveMember(confirmation.member);
      setConfirmation(null);
      return;
    }

    if (confirmation?.type === "invite") {
      await handleDeleteInvite(confirmation.invite);
      setConfirmation(null);
    }
  };

  const confirmMemberName = String(confirmation?.member?.name || "");
  const confirmMemberEmail = String(confirmation?.member?.email || "");
  const confirmMemberLabel =
    confirmMemberName || confirmMemberEmail || "this member";
  const confirmInviteEmail = String(confirmation?.invite?.email || "");
  const confirmNextRole = String(confirmation?.nextRole || "");
  const confirmRoleLabel =
    confirmNextRole === "admin" ? "Admin" : "Member";
  const confirmTitle =
    confirmation?.type === "role"
      ? `Change role to "${confirmRoleLabel}"?`
      : confirmation?.type === "remove"
        ? `Remove member "${confirmMemberLabel}"?`
        : confirmation?.type === "invite"
          ? `Cancel invite for "${confirmInviteEmail}"?`
          : "";
  const confirmDescription =
    confirmation?.type === "role"
      ? `${confirmMemberLabel} will have ${confirmNextRole} access in this workspace.`
      : confirmation?.type === "remove"
        ? `${confirmMemberLabel} will lose access to this workspace. This action cannot be undone.`
        : confirmation?.type === "invite"
          ? "This pending invite will no longer be usable."
          : "";
  const confirmLabel =
    confirmation?.type === "role"
      ? "Change role"
      : confirmation?.type === "remove"
        ? "Remove member"
        : confirmation?.type === "invite"
          ? "Cancel invite"
          : "";

  if (!workspaceId) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-destructive">
        Invalid workspace route.
      </div>
    );
  }

  if (!loaded || loading) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-muted-foreground">
        Loading members...
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="border-b border-border px-0 py-4 text-sm text-destructive">
        Workspace not found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Members
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                See who has access to this workspace and manage member roles.
              </p>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => setInviteDialogOpen(true)}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-primary text-primary-foreground shadow-none hover:scale-100 hover:bg-primary/90 hover:shadow-none",
                )}
              >
                <UserPlus className="size-4" />
                Invite Member
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {members.map((member, index) => {
              const memberId = String(member?.id || "");
              const memberName = String(member?.name || "");
              const memberEmail = String(member?.email || "");
              const memberRole = String(member?.role || "");
              const effectiveRole =
                memberRole.toLowerCase() === "owner" ? "admin" : memberRole;
              const memberStatus = String(member?.status || "");
              const isLastAdmin =
                adminCount === 1 && effectiveRole.toLowerCase() === "admin";
              const rowBusy =
                updatingMemberId === memberId || removingMemberId === memberId;

              return (
                <div
                  key={memberId || memberEmail || `member-${index}`}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <Avatar
                      name={memberName || memberEmail || "Member"}
                      className="size-10 shrink-0 text-sm"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {memberName || memberEmail}
                        </p>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          {effectiveRole}
                        </span>
                      </div>

                      {memberEmail ? (
                        <p className="truncate text-sm text-muted-foreground">
                          {memberEmail}
                        </p>
                      ) : null}

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {memberStatus ? (
                          <span className="rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-success">
                            {memberStatus}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {isAdmin && !isLastAdmin ? (
                    <div className="grid w-full grid-cols-2 gap-2 sm:w-[18rem]">
                      <select
                        value={effectiveRole}
                        onChange={(event) =>
                          requestRoleUpdate(member, event.target.value)
                        }
                        disabled={rowBusy || !memberId}
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => requestRemoveMember(member)}
                        disabled={rowBusy || !memberId}
                        className="h-9 w-full rounded-lg border border-destructive/20 bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/100/15"
                      >
                        {removingMemberId === memberId ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {!members.length ? (
              <div className="py-6 text-sm text-muted-foreground">
                No members found.
              </div>
            ) : null}
          </div>
        </section>

        {isAdmin ? (
          <section>
            <div>
              <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                Pending Invites
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Pending and sent invitations waiting for a response.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {loadingInvites ? (
                <div className="py-4 text-sm text-muted-foreground">
                  Loading pending invites...
                </div>
              ) : null}

              {!loadingInvites && inviteError ? (
                <div className="py-4">
                  <p className="text-sm text-destructive dark:text-destructive">
                    {inviteError}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      fetchInvites().catch((error) => {
                        toast.error(
                          String(error?.message || "Failed to load invites."),
                        );
                      })
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-destructive/25 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <RefreshCw className="size-4" />
                    Retry
                  </button>
                </div>
              ) : null}

              {!loadingInvites && !inviteError
                ? pendingInvites.map((invite, index) => {
                    const inviteId = String(invite?._id || "");
                    const inviteStatus = String(invite?.status || "");
                    const inviteRole = String(invite?.role || "");
                    const createdAt = invite?.createdAt
                      ? new Date(invite.createdAt).toLocaleString()
                      : "";

                    return (
                      <div
                        key={inviteId || `${invite?.email}-${index}`}
                        className="flex flex-col gap-4 rounded-xl border border-border bg-card/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {invite?.email}
                            </p>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                              {inviteRole}
                            </span>
                            <span className="rounded-md border border-info/25 bg-info/15 px-2 py-0.5 text-xs text-info">
                              {inviteStatus}
                            </span>
                          </div>

                          {createdAt ? (
                            <p className="text-xs text-muted-foreground">
                              Invited: {createdAt}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
                          <button
                            type="button"
                            onClick={() => requestDeleteInvite(invite)}
                            disabled={revokingInviteId === inviteId || !inviteId}
                            className="h-9 w-full rounded-lg border border-destructive/20 bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-destructive/30 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/100/15 sm:w-auto"
                          >
                            {revokingInviteId === inviteId
                              ? "Canceling..."
                              : "Cancel Invite"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                : null}

              {!loadingInvites && !inviteError && !pendingInvites.length ? (
                <div className="py-6 text-sm text-muted-foreground">
                  No pending invites.
                </div>
              ) : null}
            </div>
          </section>
        ) : null}
      </div>

      {inviteDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-[12vh]">
          <div className="w-full max-w-md rounded-xl border border-border bg-card">
            <div className="flex items-start justify-between gap-3 px-5 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
                  Invite a member
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Send a workspace invite and choose their role.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isSubmitting) return;
                  setInviteDialogOpen(false);
                }}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close invite dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-3 px-5 pb-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="member-email"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    ref={(element) => {
                      inviteEmailFieldRef(element);
                      inviteEmailInputRef.current = element;
                    }}
                    id="member-email"
                    type="email"
                    placeholder="member@company.com"
                    {...inviteEmailField}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                  {errors.email ? (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="member-role"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Role
                  </label>
                  <select
                    id="member-role"
                    {...register("role")}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isSubmitting) return;
                    setInviteDialogOpen(false);
                  }}
                  className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-primary text-primary-foreground shadow-none hover:scale-100 hover:bg-primary hover:shadow-none",
                  )}
                >
                  {isSubmitting ? "Sending..." : "Send invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <AccessConfirmDialog
        open={Boolean(confirmation)}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel={confirmLabel}
        busy={confirmBusy}
        destructive={confirmation?.type === "remove" || confirmation?.type === "invite"}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
