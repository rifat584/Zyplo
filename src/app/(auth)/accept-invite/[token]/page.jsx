"use client";

import { AuthCard, BackToHomeLink } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { getSession, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getInviteErrorMessage(status, payload, fallback) {
  const message = String(payload?.message || payload?.error || "").trim();

  if (status === 401) return "Please sign in to continue with this invitation.";
  if (status === 403) return message || "This account cannot use this invitation.";
  if (status === 404) return message || "This invitation link is invalid or no longer exists.";
  if (status === 409) return message || "This invitation has already been used.";
  if (status === 400) return message || "This invitation is invalid or has expired.";
  if (status === 502) return "The server could not be reached. Please try again shortly.";
  if (status >= 500) return "A server error occurred while processing this invitation.";

  return message || fallback;
}

function AcceptInvitePage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";
  const session = useSession();
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteError, setInviteError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const workspaceLabel = workspace?.workspaceName || workspace?.workspace || "this workspace";
  const expiryLabel = workspace?.expiresAt
    ? new Date(workspace.expiresAt).toLocaleString()
    : "Not available";

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

        const data = await fetch(`/api/invites/${token}`);
        const res = await data.json();

        if (!data.ok || !res?.ok) {
          setInviteError(
            getInviteErrorMessage(
              data.status,
              res,
              "Could not load invitation details.",
            ),
          );
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

      const submitData = await fetch(`/api/invites/${choice}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const result = await submitData.json();

      if (!submitData.ok || !result?.ok) {
        const message = getInviteErrorMessage(
          submitData.status,
          result,
          "Failed to process invitation.",
        );

        if (
          submitData.status === 404 ||
          message.toLowerCase().includes("no longer exists")
        ) {
          router.push("/");
          return;
        }

        toast.error(message);
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
      subtitle={`Review your invite details before joining ${workspaceLabel}.`}
    >
      <BackToHomeLink />

      {loadingInvite ? (
        <div className="space-y-3 rounded-xl border border-border/80 bg-card/60 p-3 text-sm dark:border/10 dark:bg-black/20">
          <p className="text-foreground">Checking invitation...</p>
        </div>
      ) : null}

      {!loadingInvite && inviteError ? (
        <div className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm dark:border-destructive/30 dark:bg-destructive/10">
          <p className="font-semibold text-destructive dark:text-destructive">Invite issue</p>
          <p className="text-destructive dark:text-destructive">{inviteError}</p>
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
          <div className="space-y-3 rounded-xl border border-border/80 bg-card/60 p-3 text-sm dark:border/10 dark:bg-black/20">
            <p className="text-foreground">
              Invitee email:{" "}
              <span className="font-semibold">{workspace?.inviteeEmail}</span>
            </p>
            <p className="text-foreground">
              Workspace:{" "}
              <span className="font-semibold">{workspaceLabel}</span>
            </p>
            <p className="text-foreground">
              Role: <span className="font-semibold">{workspace?.role}</span>
            </p>
            <p className="text-foreground">
              Status: <span className="font-semibold">{workspace?.status}</span>
            </p>
            <p className="text-foreground">
              Expiry:{" "}
              <span className="font-semibold text-red-400 dark:text-red-300">
                {expiryLabel}
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
