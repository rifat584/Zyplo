import { FileText } from "lucide-react";
import CardShell from "../ui/CardShell";

export default function DocsPanel({ docsPreviewLines }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Docs</h3>
        <FileText className="h-4 w-4 text-slate-500" />
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Specs next to the work that ships them.</p>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs select-none dark:border-slate-700 dark:bg-slate-800">
        {docsPreviewLines.map((line, idx) => (
          <div key={line} className="rounded px-1 py-0.5 text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200">
            {idx >= 3 ? `• ${line}` : idx > 0 ? `${idx}. ${line}` : line}
          </div>
        ))}
      </div>
    </CardShell>
  );
}
