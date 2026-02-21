import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BackToHomeLink() {
  return (
    <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 transition-colors hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-300">
      <ArrowLeft className="size-3.5" />
      Back to home
    </Link>
  );
}

export default BackToHomeLink;
