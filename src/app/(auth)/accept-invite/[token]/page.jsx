"use client";

import { AuthCard, BackToHomeLink } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { getSession, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function AcceptInvitePage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";
  const session = useSession();
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteError, setInviteError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    if (!token) {
      setInviteError("Missing invitation token.");
      setWorkspace(null);
      setLoadingInvite(false);
      return;
    }

    const getTokenData = async () => {
      try {
        setLoadingInvite(true);
        setInviteError("");

        const data = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/${token}`,
        );
        const res = await data.json();

        if (!data.ok || !res?.ok) {
          if (data.status === 404) {
            setInviteError("This invitation link is invalid.");
          } else if (data.status === 409) {
            setInviteError(res?.message || "This invitation has already been used.");
          } else if (data.status === 400) {
            setInviteError(res?.message || "This invitation has expired.");
          } else {
            setInviteError(res?.message || "Could not load invitation details.");
          }
          setWorkspace(null);
          return;
        }

        setWorkspace(res.invite || null);
      } catch {
        setInviteError("Could not load invitation details.");
        setWorkspace(null);
      } finally {
        setLoadingInvite(false);
      }
    };
    getTokenData();
  }, [token]);

  const handleInvite = async (choice) => {
    if (session.status === "loading") {
      return;
    }

    try {
      setActionLoading(choice);

      const freshSession = await getSession();
      const isLoggedIn = !!freshSession?.user?.email;
      const callbackUrl = `/accept-invite/${token}`;

      if (!isLoggedIn) {
        return router.push(
          `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }

      const data = { token, email: freshSession?.user?.email };
      const submitData = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/${choice}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      const result = await submitData.json();

      if (!submitData.ok || !result?.ok) {
        const message = String(result?.message || "");

        if (submitData.status === 404 || message.toLowerCase().includes("invite not found")) {
          router.push("/");
          return;
        }

        if (submitData.status === 403) {
          toast.error(message || "This account does not match the invited email.");
          return;
        }

        if (submitData.status === 400) {
          toast.error(message || "Invitation is invalid or expired.");
          return;
        }

        if (submitData.status === 409) {
          toast.error(message || "Invitation has already been used.");
          return;
        }

        toast.error(message || "Failed to process invitation.");
        return;
      }

      if (choice === "accept") {
        const workspaceId =
          result?.query?.workspaceId || result?.query?.value?.workspaceId || "";
        if (workspaceId) {
          router.push(`/dashboard/w/${workspaceId}`);
        } else {
          router.push("/dashboard/workspaces");
        }
        return;
      }

      if (choice === "reject") {
        router.push("/dashboard/workspaces");
        return;
      }
    } catch {
      toast.error("Network error while processing invitation.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <AuthCard
      title="Accept invite"
      subtitle="Review your invite details before continuing."
    >
      <BackToHomeLink />

      {loadingInvite ? (
        <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-black/20">
          <p className="text-slate-700 dark:text-slate-200">Checking invitation...</p>
        </div>
      ) : null}

      {!loadingInvite && inviteError ? (
        <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm dark:border-rose-500/30 dark:bg-rose-500/10">
          <p className="font-semibold text-rose-700 dark:text-rose-300">Invite issue</p>
          <p className="text-rose-700 dark:text-rose-300">{inviteError}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.push("/")}>
              Go home
            </Button>
            <Button type="button" className="cursor-pointer" onClick={() => router.push("/dashboard/workspaces")}>
              Workspaces
            </Button>
          </div>
        </div>
      ) : null}

      {!loadingInvite && !inviteError && workspace ? (
        <>
          <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-black/20">
            <p className="text-slate-700 dark:text-slate-200">
              Invitee email:{" "}
              <span className="font-semibold">{workspace?.inviteeEmail}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Workspace:{" "}
              <span className="font-semibold">{workspace?.workspace}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Role: <span className="font-semibold">{workspace?.role}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Status: <span className="font-semibold">{workspace?.status}</span>
            </p>
            <p className="text-slate-700 dark:text-slate-200">
              Expiry:{" "}
              <span className="font-semibold text-red-400 dark:text-red-300">
                {workspace?.expiresAt?.split("T")[0] || ""}
              </span>
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              onClick={() => handleInvite("accept")}
              type="button"
              className="w-full cursor-pointer"
              disabled={
                actionLoading.length > 0 ||
                String(workspace?.status || "").toLowerCase() !== "pending"
              }
            >
              {actionLoading === "accept" ? "Accepting..." : "Accept invite"}
            </Button>
            <Button
              onClick={() => handleInvite("reject")}
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              disabled={
                actionLoading.length > 0 ||
                String(workspace?.status || "").toLowerCase() !== "pending"
              }
            >
              {actionLoading === "reject" ? "Rejecting..." : "Reject invite"}
            </Button>
          </div>
        </>
      ) : null}
    </AuthCard>
  );
}

export default AcceptInvitePage;
