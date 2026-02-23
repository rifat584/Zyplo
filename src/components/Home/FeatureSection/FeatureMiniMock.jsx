import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const projectsColumns = [
  { name: "Backlog", cards: ["API pagination"] },
  { name: "In Progress", cards: ["Auth middleware"] },
  { name: "Review", cards: ["Billing QA"] },
];

const brainRows = [
  "Open project: Web App Core",
  "Recent issue: Login redirect",
  "Team docs: Deployment checklist",
];

function ProjectsMock() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200/70 bg-white/90 p-2">
      <div className="grid grid-cols-3 gap-2">
      {projectsColumns.map((column) => (
        <div
          key={column.name}
          className="rounded-lg border border-zinc-200/80 bg-zinc-50 p-2"
        >
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            {column.name}
          </p>
          <div className="space-y-1.5">
            {column.cards.map((card) => (
              <div
                key={card}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-700"
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

function BrainMock() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200/70 bg-white/90 p-3">
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[11px] text-zinc-500">
        <Search className="h-3.5 w-3.5" />
        Search workspace...
      </div>
      <div className="mt-2 space-y-1.5">
        {brainRows.map((item) => (
          <div
            key={item}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-[11px] text-zinc-700"
          >
            {item}
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" className="mt-2 h-7 px-2.5 text-[11px] shadow-none">
        View all suggestions
      </Button>
    </div>
  );
}

export function FeatureMiniMock({ mockType }) {
  // Keep mock switching centralized so cards only pass a simple `mockType` string.
  if (mockType === "projects") return <ProjectsMock />;
  return <BrainMock />;
}
