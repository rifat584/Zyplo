import { CalendarDays, User2 } from "lucide-react";
import { BentoCard } from "../BentoCard";

export function IssueDetailsCard() {
  return (
    <BentoCard
      title="Issue Details"
      right={
        <span className="inline-flex h-5 items-center rounded-full border border-secondary/25 bg-secondary/10 px-2 text-[10px] text-secondary">
          In progress
        </span>
      }
      className="col-span-1 md:col-span-6 lg:col-span-6"
      delay={0.04}
    >
      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="rounded-lg border border-zinc-200 bg-card px-2.5 py-2 dark:border-border dark:bg-[#0F1629]">
          <p className="font-medium text-foreground">
            Resolve data-sync race condition
          </p>
          <p className="mt-0.5">Checklist: 2/5 complete</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-zinc-200 bg-card px-2.5 py-2 dark:border-border dark:bg-[#0F1629]">
            <p className="flex items-center gap-1.5">
              <User2 className="h-3.5 w-3.5" /> Owner: Rifat M
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-card px-2.5 py-2 dark:border-border dark:bg-[#0F1629]">
            <p className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Due: Mar 4
            </p>
          </div>
        </div>
        <p className="rounded-lg border border-zinc-200 bg-card px-2.5 py-2 dark:border-border dark:bg-[#0F1629]">
          Notes: Confirm locking around WebSocket reconciliation path.
        </p>
      </div>
    </BentoCard>
  );
}
