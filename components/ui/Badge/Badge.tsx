import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center px-2 py-0.5",
    "font-mono text-[9px] tracking-[0.18em] uppercase",
    "border transition-colors",
    "chamfer-sm",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-[var(--cyan-line)] bg-[var(--cyan-soft)] text-[var(--cyan-3)]",
          "[box-shadow:var(--glow-cyan-sm)]",
        ].join(" "),
        secondary: [
          "border-[var(--violet-line)] bg-[var(--violet-soft)] text-[var(--violet-3)]",
        ].join(" "),
        destructive: [
          "border-[rgba(255,90,122,0.4)] bg-[rgba(255,90,122,0.1)] text-[var(--xenosphere-danger)]",
        ].join(" "),
        outline: [
          "border-border bg-transparent text-muted-foreground",
        ].join(" "),
        success: [
          "border-[rgba(78,224,168,0.4)] bg-[rgba(78,224,168,0.1)] text-[var(--xenosphere-success)]",
        ].join(" "),
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export default Badge;
