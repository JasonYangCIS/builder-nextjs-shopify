import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative border bg-card text-card-foreground", className)}
      style={{ borderColor: "var(--border)", borderRadius: "var(--r-xs)" }}
      {...props}
    />
  ),
);
Card.displayName = "Card";
export default Card;
