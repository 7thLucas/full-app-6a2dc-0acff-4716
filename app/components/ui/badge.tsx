import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

type BadgeVariant = "default" | "gold" | "muted" | "new" | "certified" | "limited";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  gold: "bg-primary/10 text-primary border border-primary/20",
  muted: "bg-muted/50 text-muted-foreground border border-border",
  new: "bg-emerald-900/30 text-emerald-400 border border-emerald-800/40",
  certified: "bg-primary/10 text-primary border border-primary/20",
  limited: "bg-muted text-muted-foreground border border-border",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-widest uppercase",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
