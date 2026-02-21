import { Chrome, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function SocialButtons() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Button type="button" variant="outline" className="w-full text-slate-700 dark:text-slate-200">
          <Github className="size-4" /> GitHub
        </Button>
        <Button type="button" variant="outline" className="w-full text-slate-700 dark:text-slate-200">
          <Chrome className="size-4" /> Google
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">or</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

export default SocialButtons;
