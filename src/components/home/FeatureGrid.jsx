import {
  Bell,
  Bot,
  ClipboardList,
  Clock3,
  FileText,
  History,
  KanbanSquare,
  Link2,
  ShieldCheck,
  FolderKanban,
} from "lucide-react";

const smallTiles = [
  { label: "Tasks", icon: ClipboardList },
  { label: "Projects", icon: FolderKanban },
  { label: "Kanban Boards", icon: KanbanSquare },
  { label: "Time Tracking", icon: Clock3 },
  { label: "Docs", icon: FileText },
  { label: "Activity History", icon: History },
  { label: "Notifications", icon: Bell },
  { label: "Roles", icon: ShieldCheck },
  { label: "Integrations", icon: Link2 },
  { label: "Smart Automation", icon: Bot },
];

const heroGradientClass =
  "bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.14),transparent_36%)]";

function HighlightPreview({ variant }) {
  if (variant === "automation") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/80 p-3 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-2.5 w-24 rounded-full bg-gray-200" />
          <div className="h-5 w-16 rounded-full border border-gray-200 bg-gray-50" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-primary/25" />
            <span className="h-2.5 w-28 rounded-full bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-secondary/25" />
            <span className="h-2.5 w-20 rounded-full bg-gray-200" />
          </div>
          <div className="flex gap-2 pt-1">
            <span className="h-5 w-14 rounded-full border border-gray-200 bg-gray-50" />
            <span className="h-5 w-12 rounded-full border border-gray-200 bg-gray-50" />
            <span className="h-5 w-16 rounded-full border border-gray-200 bg-gray-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white/80 p-3 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-8 w-8 rounded-full bg-primary/20" />
        <div className="space-y-1">
          <div className="h-2.5 w-20 rounded-full bg-gray-200" />
          <div className="h-2.5 w-14 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200" />
        <div className="h-2.5 w-11/12 rounded-full bg-gray-200" />
        <div className="h-2.5 w-8/12 rounded-full bg-gray-200" />
      </div>
      <div className="mt-3 flex gap-2">
        <span className="h-5 w-16 rounded-full border border-gray-200 bg-gray-50" />
        <span className="h-5 w-12 rounded-full border border-gray-200 bg-gray-50" />
      </div>
    </div>
  );
}

function HighlightTile({ badge, title, description, variant }) {
  return (
    <button
      type="button"
      aria-label={title}
      className={`group relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:translate-y-1 hover:border-gray-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 lg:col-span-2`}
    >
      <div className={`pointer-events-none absolute inset-0 ${heroGradientClass}`} />
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-secondary/20 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-700">
          {badge}
        </span>
        <h3 className="mt-3 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-gray-600">{description}</p>
        <div className="mt-5">
          <HighlightPreview variant={variant} />
        </div>
      </div>
    </button>
  );
}

export default function FeatureGrid() {
  return (
    <section
      aria-labelledby="feature-grid-heading"
      className="w-full bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2
            id="feature-grid-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Everything dev teams need — without the clutter
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Tasks, projects, docs, automation, and time tracking — built for
            developer flow.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {smallTiles.slice(0, 4).map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:translate-y-1 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-gray-800">{label}</p>
            </button>
          ))}

          <HighlightTile
            badge="Core"
            title="Projects + Time Tracking"
            description="Plan work, track effort, and keep delivery momentum in one flow-friendly workspace."
            variant="projects"
          />

          {smallTiles.slice(4, 8).map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:translate-y-1 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-gray-800">{label}</p>
            </button>
          ))}

          <HighlightTile
            badge="New"
            title="Smart Automation + Docs"
            description="Trigger updates, generate docs context, and remove repetitive workflow handoffs."
            variant="automation"
          />

          {smallTiles.slice(8).map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:translate-y-1 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-gray-800">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
