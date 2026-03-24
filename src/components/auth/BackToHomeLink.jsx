import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BackToHomeLink() {
  return (
    <Link href="/" className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-slate-600 transition-colors hover:text-secondary dark:text-muted-foreground dark:hover:text-secondary">
      <ArrowLeft className="size-3.5" />
      Back to home
    </Link>
  );
}

export default BackToHomeLink;
