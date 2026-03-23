"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ name, className, src = "" }) {
  const [failedSrc, setFailedSrc] = useState("");
  const letters = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
  const normalizedSrc = String(src || "").trim();
  const showImage = Boolean(normalizedSrc) && failedSrc !== normalizedSrc;

  return (
    <div
      className={cn(
        "flex size-8 items-center justify-center overflow-hidden rounded-full border border-border bg-linear-to-br from-primary to-secondary text-xs font-semibold text-primary-foreground",
        className
      )}
    >
      {showImage ? (
        <img
          src={normalizedSrc}
          alt={name || "User avatar"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(normalizedSrc)}
        />
      ) : (
        letters || "U"
      )}
    </div>
  );
}
