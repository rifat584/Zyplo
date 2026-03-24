import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.05] hover:shadow-secondary/20",
        marketing:
          "bg-linear-to-r from-primary via-primary to-secondary text-primary-foreground shadow-[0_16px_36px_-18px_oklch(from_var(--primary)_l_c_h_/_0.85)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_oklch(from_var(--secondary)_l_c_h_/_0.75)]",
        "marketing-outline":
          "border border-border/80 bg-card/85 text-foreground shadow-[0_10px_28px_-22px_oklch(from_var(--foreground)_l_c_h_/_0.35)] backdrop-blur-sm hover:border-primary/25 hover:bg-accent/65 hover:text-foreground",
        outline:
          "border border-border bg-card/80 text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, as: Comp = "button", ...props }) {
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
