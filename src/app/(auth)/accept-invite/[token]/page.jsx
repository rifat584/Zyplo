"use client";

import { AuthCard, BackToHomeLink } from "@/components/auth";
import { Button } from "@/components/ui/button";

function AcceptInvitePage() {
  return (
    <AuthCard
      title="Accept invite"
      subtitle="Review your invite details before continuing."
    >
      <BackToHomeLink />

      <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-black/20">
        <p className="text-slate-700 dark:text-slate-200">
          Invitee email: <span className="font-semibold">invitee@example.com</span>
        </p>
        <p className="text-slate-700 dark:text-slate-200">
          Workspace: <span className="font-semibold">Workspace Name</span>
        </p>
        <p className="text-slate-700 dark:text-slate-200">
          Role: <span className="font-semibold">MEMBER</span>
        </p>
        <p className="text-slate-700 dark:text-slate-200">
          Status: <span className="font-semibold">Pending</span>
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" className="w-full">
          Accept invite
        </Button>
        <Button type="button" variant="outline" className="w-full">
          Reject invite
        </Button>
      </div>
    </AuthCard>
  );
}

export default AcceptInvitePage;
