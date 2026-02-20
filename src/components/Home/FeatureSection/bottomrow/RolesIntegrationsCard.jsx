import { ShieldCheck } from "lucide-react";
import CardShell from "../ui/CardShell";
import RolesTable from "./RolesTable";
import IntegrationsGrid from "./IntegrationsGrid";

export default function RolesIntegrationsCard({ roles, integrations }) {
  return (
    <CardShell className="p-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Roles & Integrations</h3>
        <ShieldCheck className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Permission sanity, not permission spaghetti.</p>
      <RolesTable roles={roles} />
      <IntegrationsGrid integrations={integrations} />
    </CardShell>
  );
}
