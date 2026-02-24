import { cn } from "@/lib/utils";

function StarBorder({
  as: Component = "div",
  className,
  color = "#22d3ee",
  speed = "6s",
  thickness = 1,
  children,
  style,
  ...props
}) {
  return (
    <Component
      className={cn("relative inline-block overflow-hidden rounded-xl", className)}
      style={{
        padding: `${thickness}px`,
        ...(style || {}),
      }}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-14px] right-[-360%] z-0 h-1/2 w-[440%] rounded-full opacity-100"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 18%)`,
          animation: `rb-star-move-bottom ${speed} linear infinite alternate`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-360%] top-[-12px] z-0 h-1/2 w-[440%] rounded-full opacity-100"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 18%)`,
          animation: `rb-star-move-top ${speed} linear infinite alternate`,
        }}
      />
      <span className="relative z-10 block rounded-[calc(0.75rem-1px)]">{children}</span>
    </Component>
  );
}

export { StarBorder };
