"use client";
import { Chrome, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

function SocialButtons() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          onClick={() => signIn("github", { callbackUrl })}
          type="button"
          variant="outline"
          className="w-full cursor-pointer text-foreground"
        >
          <Github className="size-4" /> GitHub
        </Button>

        <Button
          onClick={() => signIn("google", { callbackUrl })}
          type="button"
          variant="outline"
          className="w-full cursor-pointer text-foreground"
        >
          <Chrome className="size-4" /> Google
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          or
        </span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}

export default SocialButtons;
