import Image from "next/image";
import { cn } from "@/lib/utils";

const normalizeTextSize = (value) =>
  String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (part.includes(":")) {
        const [prefix, variant] = part.split(":");
        return `${prefix}:${variant.startsWith("text-") ? variant : `text-${variant}`}`;
      }
      return part.startsWith("text-") ? part : `text-${part}`;
    })
    .join(" ");

export default function Logo({
  size = 32,
  textSize = "2xl",
  showText = true,
  className = "",
  imageClassName = "",
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Image
        src="/logo1.png"
        alt="Zyplo Logo"
        width={size}
        height={size}
        priority
        className={cn("rounded-full", imageClassName)}
      />
      {showText && (
        <span className={cn(normalizeTextSize(textSize), "font-bold text-primary")}>
          ZYPL
          <span>O</span>
        </span>
      )}
    </div>
  );
}
